"""add email verification tokens

Revision ID: 78be0d43f921
Revises: a053d6411b8f
Create Date: 2026-10-11
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "78be0d43f921"
down_revision: Union[str, Sequence[str], None] = "a053d6411b8f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "email_verification_tokens",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=False),
        sa.Column("token_hash", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", name="uq_email_verification_tokens_user_id"),
        sa.UniqueConstraint("token_hash"),
    )
    op.create_index(
        op.f("ix_email_verification_tokens_expires_at"),
        "email_verification_tokens",
        ["expires_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_email_verification_tokens_expires_at"),
        table_name="email_verification_tokens",
    )
    op.drop_table("email_verification_tokens")
