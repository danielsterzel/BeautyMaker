from datetime import datetime, timedelta, timezone
from typing import Literal
from uuid import UUID

import jwt

from app.core.settings import settings

TokenType = Literal["access", "refresh"]


def get_private_key() -> str:
    return settings.jwt_private_key_path.read_text()


def get_public_key() -> str:
    return settings.jwt_public_key_path.read_text()


def create_token(
    user_id: UUID,
    token_type: TokenType,
    expires_delta: timedelta,
) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user_id),
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }

    return jwt.encode(
        payload,
        get_private_key(),
        algorithm=settings.jwt_algorithm,
    )


def create_access_token(user_id: UUID) -> str:
    return create_token(
        user_id=user_id,
        token_type="access",
        expires_delta=timedelta(minutes=15),
    )


def create_refresh_token(user_id: UUID) -> str:
    return create_token(
        user_id=user_id,
        token_type="refresh",
        expires_delta=timedelta(days=30),
    )


def decode_token(token: str) -> dict:
    return jwt.decode(
        token,
        get_public_key(),
        algorithms=[settings.jwt_algorithm],
    )
