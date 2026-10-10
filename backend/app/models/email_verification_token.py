from datetime import datetime, timedelta, timezone
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

TOKEN_TTL_MINUTES = 30


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def token_expiration() -> datetime:
    return utc_now() + timedelta(minutes=TOKEN_TTL_MINUTES)


class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"
    __table_args__ = (
        UniqueConstraint("user_id", name="uq_email_verification_tokens_user_id"),
    )

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    token_hash: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=token_expiration,
        nullable=False,
        index=True,
    )

    @property
    def is_expired(self) -> bool:
        return utc_now() >= self.expires_at
