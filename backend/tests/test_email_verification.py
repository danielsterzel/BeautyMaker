from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock
from urllib.parse import parse_qs, urlsplit
from uuid import uuid4

import pytest
from fastapi import HTTPException

from app.api import auth
from app.models.email_verification_token import TOKEN_TTL_MINUTES, utc_now
from app.schemas.user import (
    ConfirmEmailRequest,
    ResendEmailRequest,
    UserRegisterRequest,
)
from app.service import email as email_service
from app.service.email import hash_email_verification_token


class FakeTransaction:
    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, traceback):
        return False


class FakeSession:
    def __init__(self):
        self.flush = AsyncMock()
        self.commit = AsyncMock()
        self.rollback = AsyncMock()

    def begin(self):
        return FakeTransaction()


def verification_token(*, raw_token: str, expires_delta: timedelta):
    now = utc_now()
    return SimpleNamespace(
        id=uuid4(),
        user_id=uuid4(),
        token_hash=hash_email_verification_token(raw_token),
        created_at=now - timedelta(minutes=5),
        expires_at=now + expires_delta,
    )


def test_verification_link_uses_configured_frontend_url(monkeypatch):
    monkeypatch.setattr(email_service.settings, "frontend_url", "http://localhost:3000")

    link = email_service.build_email_verification_link("a_token")

    assert link == "http://localhost:3000/confirm-email?token=a_token"


@pytest.mark.asyncio
async def test_confirm_email_accepts_valid_token_and_consumes_it(monkeypatch):
    raw_token = "v" * 43
    token = verification_token(raw_token=raw_token, expires_delta=timedelta(minutes=5))
    user = SimpleNamespace(id=token.user_id, email_verified=False)
    delete = AsyncMock()

    monkeypatch.setattr(
        auth.EmailVerificationTokenRepository,
        "get_by_hash",
        AsyncMock(return_value=token),
    )
    monkeypatch.setattr(
        auth.EmailVerificationTokenRepository,
        "get_by_hash_for_update",
        AsyncMock(return_value=token),
    )
    monkeypatch.setattr(auth.EmailVerificationTokenRepository, "delete", delete)
    monkeypatch.setattr(
        auth.UserRepository,
        "get_by_id_for_update",
        AsyncMock(return_value=user),
    )

    response = await auth.confirm_email(
        ConfirmEmailRequest(token=raw_token), FakeSession()
    )

    assert response.success is True
    assert user.email_verified is True
    delete.assert_awaited_once_with(token)


@pytest.mark.asyncio
async def test_confirm_email_rejects_and_removes_expired_token(monkeypatch):
    raw_token = "e" * 43
    token = verification_token(raw_token=raw_token, expires_delta=-timedelta(seconds=1))
    delete = AsyncMock()
    get_user = AsyncMock()

    monkeypatch.setattr(
        auth.EmailVerificationTokenRepository,
        "get_by_hash",
        AsyncMock(return_value=token),
    )
    monkeypatch.setattr(
        auth.EmailVerificationTokenRepository,
        "get_by_hash_for_update",
        AsyncMock(return_value=token),
    )
    monkeypatch.setattr(auth.EmailVerificationTokenRepository, "delete", delete)
    monkeypatch.setattr(auth.UserRepository, "get_by_id_for_update", get_user)

    with pytest.raises(HTTPException) as error:
        await auth.confirm_email(ConfirmEmailRequest(token=raw_token), FakeSession())

    assert error.value.status_code == 400
    assert error.value.detail == auth.INVALID_TOKEN_MESSAGE
    delete.assert_awaited_once_with(token)
    get_user.assert_awaited_once_with(token.user_id)


@pytest.mark.asyncio
async def test_confirm_email_rejects_used_token(monkeypatch):
    raw_token = "u" * 43
    token = verification_token(raw_token=raw_token, expires_delta=timedelta(minutes=5))
    user = SimpleNamespace(id=token.user_id, email_verified=False)

    monkeypatch.setattr(
        auth.EmailVerificationTokenRepository,
        "get_by_hash",
        AsyncMock(side_effect=[token, None]),
    )
    monkeypatch.setattr(
        auth.EmailVerificationTokenRepository,
        "get_by_hash_for_update",
        AsyncMock(return_value=token),
    )
    monkeypatch.setattr(auth.EmailVerificationTokenRepository, "delete", AsyncMock())
    monkeypatch.setattr(
        auth.UserRepository,
        "get_by_id_for_update",
        AsyncMock(return_value=user),
    )

    await auth.confirm_email(ConfirmEmailRequest(token=raw_token), FakeSession())

    with pytest.raises(HTTPException) as error:
        await auth.confirm_email(ConfirmEmailRequest(token=raw_token), FakeSession())

    assert error.value.status_code == 400


@pytest.mark.asyncio
async def test_confirm_email_rejects_invalid_token(monkeypatch):
    monkeypatch.setattr(
        auth.EmailVerificationTokenRepository,
        "get_by_hash",
        AsyncMock(return_value=None),
    )

    with pytest.raises(HTTPException) as error:
        await auth.confirm_email(
            ConfirmEmailRequest(token="invalid-token-value-that-is-long-enough"),
            FakeSession(),
        )

    assert error.value.status_code == 400
    assert error.value.detail == auth.INVALID_TOKEN_MESSAGE


@pytest.mark.asyncio
async def test_register_creates_hashed_token_and_sends_email(monkeypatch):
    replace = AsyncMock()
    send = AsyncMock()
    session = FakeSession()

    async def assign_user_id(_service, user):
        user.id = uuid4()

    monkeypatch.setattr(
        auth.UserDbService,
        "validate_exists_by_email",
        AsyncMock(return_value=False),
    )
    monkeypatch.setattr(auth.UserDbService, "save_user", assign_user_id)
    monkeypatch.setattr(
        auth.EmailVerificationTokenRepository, "replace_for_user", replace
    )
    monkeypatch.setattr(auth, "hash_password", lambda password: "password-hash")
    monkeypatch.setattr(auth, "send_verification_email", send)
    monkeypatch.setattr(
        email_service.settings, "frontend_url", "https://beautymaker.com"
    )

    response = await auth.register(
        UserRegisterRequest(
            display_name="Beauty User",
            email="USER@example.com",
            password="a-secure-password",
        ),
        session,
    )

    assert response.success is True
    stored = replace.await_args.kwargs
    recipient, link = send.await_args.args
    raw_token = parse_qs(urlsplit(link).query)["token"][0]
    assert recipient == "user@example.com"
    assert stored["token_hash"] == hash_email_verification_token(raw_token)
    assert raw_token != stored["token_hash"]
    session.commit.assert_awaited_once()
    session.rollback.assert_not_awaited()


@pytest.mark.asyncio
async def test_resend_replaces_token_and_builds_frontend_link(monkeypatch):
    user = SimpleNamespace(id=uuid4(), email_verified=False)
    old_token = SimpleNamespace(
        created_at=utc_now() - timedelta(minutes=2),
        token_hash="old-hash",
    )
    replace = AsyncMock()
    send = AsyncMock()

    monkeypatch.setattr(
        email_service.settings, "frontend_url", "https://beautymaker.com"
    )
    monkeypatch.setattr(
        auth.UserRepository,
        "get_by_email_for_update",
        AsyncMock(return_value=user),
    )
    monkeypatch.setattr(
        auth.EmailVerificationTokenRepository,
        "get_by_user_id_for_update",
        AsyncMock(return_value=old_token),
    )
    monkeypatch.setattr(
        auth.EmailVerificationTokenRepository, "replace_for_user", replace
    )
    monkeypatch.setattr(auth, "send_verification_email", send)

    response = await auth.resend_email(
        ResendEmailRequest(email="USER@example.com"), FakeSession()
    )

    assert response.message == auth.GENERIC_RESEND_MESSAGE
    replace.assert_awaited_once()
    stored = replace.await_args.kwargs
    assert stored["token_hash"] != old_token.token_hash
    assert len(stored["token_hash"]) == 64
    assert stored["expires_at"] - stored["created_at"] == timedelta(
        minutes=TOKEN_TTL_MINUTES
    )

    send.assert_awaited_once()
    recipient, link = send.await_args.args
    parsed_link = urlsplit(link)
    raw_token = parse_qs(parsed_link.query)["token"][0]
    assert recipient == "user@example.com"
    assert parsed_link.scheme == "https"
    assert parsed_link.netloc == "beautymaker.com"
    assert parsed_link.path == "/confirm-email"
    assert stored["token_hash"] == hash_email_verification_token(raw_token)
    assert raw_token not in stored.values()


@pytest.mark.asyncio
async def test_resend_is_rate_limited_and_does_not_reveal_missing_account(
    monkeypatch,
):
    user = SimpleNamespace(id=uuid4(), email_verified=False)
    recent_token = SimpleNamespace(created_at=utc_now(), token_hash="recent-hash")
    get_user = AsyncMock(side_effect=[user, None])
    replace = AsyncMock()
    send = AsyncMock()

    monkeypatch.setattr(auth.UserRepository, "get_by_email_for_update", get_user)
    monkeypatch.setattr(
        auth.EmailVerificationTokenRepository,
        "get_by_user_id_for_update",
        AsyncMock(return_value=recent_token),
    )
    monkeypatch.setattr(
        auth.EmailVerificationTokenRepository, "replace_for_user", replace
    )
    monkeypatch.setattr(auth, "send_verification_email", send)

    limited_response = await auth.resend_email(
        ResendEmailRequest(email="known@example.com"), FakeSession()
    )
    missing_response = await auth.resend_email(
        ResendEmailRequest(email="missing@example.com"), FakeSession()
    )

    assert limited_response == missing_response
    assert limited_response.message == auth.GENERIC_RESEND_MESSAGE
    replace.assert_not_awaited()
    send.assert_not_awaited()
