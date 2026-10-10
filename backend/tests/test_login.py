from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock
from uuid import uuid4

import pytest
from fastapi import HTTPException

from app.api import auth
from app.schemas.user import UserLoginRequest


class FakeSession:
    def __init__(self):
        self.commit = AsyncMock()
        self.rollback = AsyncMock()
        self.refresh = AsyncMock()


def make_user(**overrides):
    values = {
        "id": uuid4(),
        "display_name": "Beauty User",
        "email": "user@example.com",
        "avatar_url": None,
        "password_hash": "argon2id-password-hash",
        "is_active": True,
        "email_verified": True,
        "last_login_at": None,
        "oauth_accounts": [],
        "questionnaire": None,
    }
    values.update(overrides)
    return SimpleNamespace(**values)


def login_request():
    # Login intentionally does not enforce registration password-strength rules.
    return UserLoginRequest(email="USER@example.com", password="x")


def configure_valid_login(monkeypatch, user):
    monkeypatch.setattr(
        auth.UserDbService,
        "get_by_email",
        AsyncMock(return_value=user),
    )
    monkeypatch.setattr(auth, "verify_password", Mock(return_value=True))
    monkeypatch.setattr(auth, "password_needs_rehash", Mock(return_value=False))
    monkeypatch.setattr(
        auth, "create_access_token", Mock(return_value="signed-access-token")
    )


@pytest.mark.asyncio
async def test_login_succeeds_and_updates_last_login(monkeypatch):
    user = make_user()
    session = FakeSession()
    before_login = datetime.now(timezone.utc)
    configure_valid_login(monkeypatch, user)

    response = await auth.login(login_request(), session)

    assert response.tokens.access_token == "signed-access-token"
    assert response.user.id == user.id
    assert user.last_login_at is not None
    assert user.last_login_at >= before_login
    assert response.user.last_login_at == user.last_login_at
    session.commit.assert_awaited_once()
    session.rollback.assert_not_awaited()
    session.refresh.assert_awaited_once_with(
        user, attribute_names=["oauth_accounts", "questionnaire"]
    )


@pytest.mark.asyncio
async def test_login_rejects_unknown_email_with_generic_401(monkeypatch):
    verify = Mock(return_value=False)
    session = FakeSession()
    monkeypatch.setattr(
        auth.UserDbService,
        "get_by_email",
        AsyncMock(return_value=None),
    )
    monkeypatch.setattr(auth, "verify_password", verify)

    with pytest.raises(HTTPException) as error:
        await auth.login(login_request(), session)

    assert error.value.status_code == 401
    assert error.value.detail == auth.INVALID_CREDENTIALS_MESSAGE
    assert error.value.headers == {"WWW-Authenticate": "Bearer"}
    verify.assert_called_once_with("x", auth.DUMMY_PASSWORD_HASH)
    session.rollback.assert_awaited_once()


@pytest.mark.asyncio
async def test_login_rejects_incorrect_password_with_generic_401(monkeypatch):
    user = make_user()
    session = FakeSession()
    monkeypatch.setattr(
        auth.UserDbService,
        "get_by_email",
        AsyncMock(return_value=user),
    )
    monkeypatch.setattr(auth, "verify_password", Mock(return_value=False))

    with pytest.raises(HTTPException) as error:
        await auth.login(login_request(), session)

    assert error.value.status_code == 401
    assert error.value.detail == auth.INVALID_CREDENTIALS_MESSAGE
    session.rollback.assert_awaited_once()


@pytest.mark.asyncio
async def test_login_rejects_inactive_user(monkeypatch):
    user = make_user(is_active=False)
    session = FakeSession()
    configure_valid_login(monkeypatch, user)

    with pytest.raises(HTTPException) as error:
        await auth.login(login_request(), session)

    assert error.value.status_code == 403
    assert error.value.detail == "User account is inactive"
    session.rollback.assert_awaited_once()
    auth.create_access_token.assert_not_called()


@pytest.mark.asyncio
async def test_login_rejects_unverified_email(monkeypatch):
    user = make_user(email_verified=False)
    session = FakeSession()
    configure_valid_login(monkeypatch, user)

    with pytest.raises(HTTPException) as error:
        await auth.login(login_request(), session)

    assert error.value.status_code == 403
    assert error.value.detail == "Email is not verified"
    session.rollback.assert_awaited_once()
    auth.create_access_token.assert_not_called()


@pytest.mark.asyncio
async def test_login_response_contains_only_public_user_data(monkeypatch):
    user = make_user()
    configure_valid_login(monkeypatch, user)

    response = await auth.login(login_request(), FakeSession())
    payload = response.model_dump(mode="json", by_alias=True)

    assert payload["tokens"] == {"accessToken": "signed-access-token"}
    assert set(payload["user"]) == {
        "id",
        "displayName",
        "email",
        "avatarUrl",
        "emailVerified",
        "lastLoginAt",
        "oauthAccounts",
        "questionnaire",
    }
    assert "password_hash" not in payload["user"]
    assert "passwordHash" not in payload["user"]
