import logging
from datetime import timedelta
from typing import Annotated
from uuid import UUID

from aiosmtplib.errors import SMTPException
from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from jwt import InvalidTokenError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.db.dependency import get_db
from app.db.repositories.email_verification_token import (
    EmailVerificationTokenRepository,
)
from app.db.repositories.user import UserRepository
from app.db.services.user import UserDbService
from app.core.settings import settings
from app.models import User
from app.models.email_verification_token import TOKEN_TTL_MINUTES, utc_now
from app.schemas.user import (
    APIResponse,
    ConfirmEmailRequest,
    OAuthAccountSchema,
    ResendEmailRequest,
    TokenResponse,
    UserLoginRequest,
    UserLoginResponse,
    UserRegisterRequest,
    UserSchema,
)
from app.service.email import (
    build_email_verification_link,
    generate_email_verification_token,
    hash_email_verification_token,
    send_verification_email,
)
from app.service.jwt_auth import create_access_token, create_refresh_token, decode_token
from app.service.password_hasher import (
    hash_password,
    password_needs_rehash,
    verify_password,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth")

RESEND_COOLDOWN_SECONDS = 60
GENERIC_RESEND_MESSAGE = (
    "If an unverified account exists, a verification email has been sent"
)
INVALID_TOKEN_MESSAGE = "Invalid or expired verification token"
INVALID_CREDENTIALS_MESSAGE = "Incorrect email or password"

# A valid Argon2id hash used only to make unknown-email attempts perform the
# same password verification work as known-email attempts.
DUMMY_PASSWORD_HASH = (
    "$argon2id$v=19$m=65536,t=3,p=4$"
    "dGVzdC1vbmx5LXNhbHQ$"
    "8Q7G3RJ2jvkpqpbTVnMs5iKGRpoIjlxVsDgWy0FjOGY"
)


# TODO: Refresh token security
# - Verify that the user still exists and is active.
# - Implement refresh token rotation and revocation.
# - Add logout endpoint that invalidates the refresh token and clears the cookie.
# - Review CSRF protection and cookie settings for production.
# - Add rate limiting and tests for the refresh flow.

# TODO Oauth:
# do oauth


async def _replace_verification_token(
    repository: EmailVerificationTokenRepository,
    *,
    user_id: UUID,
) -> str:
    raw_token = generate_email_verification_token()
    created_at = utc_now()
    await repository.replace_for_user(
        user_id=user_id,
        token_hash=hash_email_verification_token(raw_token),
        created_at=created_at,
        expires_at=created_at + timedelta(minutes=TOKEN_TTL_MINUTES),
    )
    return raw_token


@router.post(
    "/register",
    response_model=APIResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    request: UserRegisterRequest, db: Annotated[AsyncSession, Depends(get_db)]
):
    service = UserDbService(db)
    token_repository = EmailVerificationTokenRepository(db)
    parsed_email = str(request.email).lower()

    exists = await service.validate_exists_by_email(parsed_email)
    if exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already registered",
        )

    new_user = User(
        display_name=request.display_name,
        email=parsed_email,
        password_hash=hash_password(password=request.password),
    )

    try:
        await service.save_user(new_user)
        raw_token = await _replace_verification_token(
            token_repository,
            user_id=new_user.id,
        )
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User already registered",
        )
    except SQLAlchemyError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while saving user",
        )

    try:
        verification_link = build_email_verification_link(raw_token)
        await send_verification_email(parsed_email, verification_link)
    except (SMTPException, OSError, TimeoutError):
        # The account and token are already durable. The generic resend endpoint
        # lets the user retry without exposing delivery internals.
        logger.error("Verification email delivery failed after registration")

    return APIResponse(
        success=True,
        message="User has been registered",
    )


@router.post("/login", response_model=UserLoginResponse)
async def login(
    request: UserLoginRequest,
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    service = UserDbService(db)
    email = str(request.email).lower()

    try:
        user = await service.get_by_email(email)
        password_hash = (
            user.password_hash
            if user is not None and user.password_hash is not None
            else DUMMY_PASSWORD_HASH
        )
        password_is_valid = verify_password(request.password, password_hash)

        if user is None or not password_is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=INVALID_CREDENTIALS_MESSAGE,
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive",
            )

        if not user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email is not verified",
            )

        await db.refresh(user, attribute_names=["oauth_accounts", "questionnaire"])

        if password_needs_rehash(password_hash):
            user.password_hash = hash_password(request.password)

        last_login_at = utc_now()
        user.last_login_at = last_login_at
        access_token = create_access_token(user.id)

        public_user = UserSchema(
            id=user.id,
            display_name=user.display_name,
            email=user.email,
            avatar_url=user.avatar_url,
            email_verified=user.email_verified,
            last_login_at=last_login_at,
            oauth_accounts=[
                OAuthAccountSchema.model_validate(account)
                for account in user.oauth_accounts
            ],
            questionnaire=(
                user.questionnaire.question_answers
                if user.questionnaire is not None
                else None
            ),
        )
        login_response = UserLoginResponse(
            tokens=TokenResponse(access_token=access_token),
            user=public_user,
        )
        await db.commit()

    except HTTPException:
        await db.rollback()
        raise
    except SQLAlchemyError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while logging in",
        )

    refresh_token = create_refresh_token(user.id)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.frontend_url.lower().startswith("https://"),
        samesite="lax",
        path="/api/v1/auth",
        max_age=60 * 60 * 24 * 30,
    )
    return login_response


@router.get("/me", response_model=UserSchema)
async def get_me(
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    if not user.is_active or not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session is no longer valid",
        )

    try:
        await db.refresh(user, attribute_names=["oauth_accounts", "questionnaire"])
        return UserSchema(
            id=user.id,
            display_name=user.display_name,
            email=user.email,
            avatar_url=user.avatar_url,
            email_verified=user.email_verified,
            last_login_at=user.last_login_at,
            oauth_accounts=[
                OAuthAccountSchema.model_validate(account)
                for account in user.oauth_accounts
            ],
            questionnaire=(
                user.questionnaire.question_answers
                if user.questionnaire is not None
                else None
            ),
        )
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while loading user",
        )


@router.post("/confirm-email", response_model=APIResponse)
async def confirm_email(
    request: ConfirmEmailRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    token_repository = EmailVerificationTokenRepository(db)
    user_repository = UserRepository(db)
    token_hash = hash_email_verification_token(request.token)
    confirmed = False

    try:
        candidate = await token_repository.get_by_hash(token_hash)

        if candidate is not None:
            # All flows lock the user before the token. Re-reading the token
            # after acquiring both locks also handles a concurrent resend.
            user = await user_repository.get_by_id_for_update(candidate.user_id)
            token = await token_repository.get_by_hash_for_update(token_hash)

            if token is not None:
                now = utc_now()
                if token.expires_at <= now:
                    await token_repository.delete(token)
                elif user is not None:
                    user.email_verified = True
                    await token_repository.delete(token)
                    await db.flush()
                    confirmed = True

        await db.commit()

    except SQLAlchemyError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while confirming email",
        )

    if not confirmed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=INVALID_TOKEN_MESSAGE,
        )

    return APIResponse(success=True, message="Email has been confirmed")


@router.post("/resend-email", response_model=APIResponse)
async def resend_email(
    request: ResendEmailRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    email = str(request.email).lower()
    user_repository = UserRepository(db)
    token_repository = EmailVerificationTokenRepository(db)

    try:
        user = await user_repository.get_by_email_for_update(email)
        if user is None or user.email_verified:
            await db.commit()
            return APIResponse(success=True, message=GENERIC_RESEND_MESSAGE)

        current_token = await token_repository.get_by_user_id_for_update(user.id)
        now = utc_now()
        if current_token is not None and current_token.created_at > now - timedelta(
            seconds=RESEND_COOLDOWN_SECONDS
        ):
            await db.commit()
            return APIResponse(success=True, message=GENERIC_RESEND_MESSAGE)

        raw_token = await _replace_verification_token(
            token_repository,
            user_id=user.id,
        )
        verification_link = build_email_verification_link(raw_token)
        await send_verification_email(email, verification_link)
        await db.commit()

    except (SMTPException, OSError, TimeoutError):
        # Rolling back token replacement preserves the last successfully sent link.
        await db.rollback()
        logger.error("Verification email delivery failed during resend")
    except SQLAlchemyError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while resending verification email",
        )

    return APIResponse(success=True, message=GENERIC_RESEND_MESSAGE)


@router.post("/reset-password")
async def reset_password(): ...


# place for oauth login only google for now


@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    db: Annotated[AsyncSession, Depends(get_db)],
    refresh_token: Annotated[str | None, Cookie()] = None,
):
    if refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing refresh token",
        )

    try:
        payload = decode_token(refresh_token)

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )

        user_id = UUID(payload["sub"])
        user = await UserRepository(db).get_by_id(user_id)
        if user is None or not user.is_active or not user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session is no longer valid",
            )

        return TokenResponse(access_token=create_access_token(user_id))
    except (InvalidTokenError, ValueError, KeyError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong while refreshing the session",
        )
