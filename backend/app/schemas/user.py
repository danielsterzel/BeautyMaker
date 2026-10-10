from __future__ import annotations

from pydantic import EmailStr, StringConstraints, field_validator, Field
from typing import Annotated
from app.schemas.configured_schema import ConfiguredSchema
from uuid import UUID
from datetime import datetime

from app.schemas.questionnaire import QuestionnaireAnswers

EmailString = Annotated[
    EmailStr, StringConstraints(min_length=6, max_length=320, strip_whitespace=True)
]

Password = Annotated[str, StringConstraints(min_length=12, max_length=256)]

CommonString = Annotated[
    str, StringConstraints(min_length=3, max_length=120, strip_whitespace=True)
]

VerificationToken = Annotated[
    str, StringConstraints(min_length=32, max_length=256, strip_whitespace=True)
]


class APIResponse(ConfiguredSchema):
    success: bool
    message: CommonString


class UserSchema(ConfiguredSchema):
    id: UUID
    display_name: CommonString | None
    email: EmailString
    avatar_url: str | None = Field(max_length=2048)
    email_verified: bool
    last_login_at: datetime | None
    oauth_accounts: list[OAuthAccountSchema] = Field(default_factory=list)
    questionnaire: QuestionnaireAnswers | None


class OAuthAccountSchema(ConfiguredSchema):

    id: UUID
    user_id: UUID
    provider_email: EmailString | None
    provider_email_verified: bool
    created_at: datetime
    updated_at: datetime
    last_used_at: datetime | None


class UserRegisterRequest(ConfiguredSchema):

    display_name: CommonString
    email: EmailString
    password: Password

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: Password) -> Password:
        # need to research regexp checks :(
        return validate_password_helper(value)


class UserLoginRequest(ConfiguredSchema):

    email: EmailString
    password: str


class ConfirmEmailRequest(ConfiguredSchema):
    token: VerificationToken


class ResendEmailRequest(ConfiguredSchema):
    email: EmailString


class UserLoginResponse(ConfiguredSchema):

    tokens: TokenResponse
    user: UserSchema


class TokenResponse(ConfiguredSchema):

    access_token: str


def validate_password_helper(password: str) -> str:
    if not password.strip():
        raise ValueError("Password cannot consist only of whitespace")

    if len(password) < 12:
        raise ValueError("Password must contain at least 12 characters")

    if len(password) > 256:
        raise ValueError("Password cannot exceed 256 characters")

    return password


ALLOWED_EMAIL_DOMAINS = {
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
    "proton.me",
    "protonmail.com",
}
