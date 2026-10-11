from app.db.base import Base
from datetime import datetime
from sqlalchemy import ForeignKey, Date, func, String, Text
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB, ARRAY
from uuid import UUID, uuid4


class Analysis(Base):

    __tablename__ = "analyses"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    concerns: Mapped[list[str]] = mapped_column(ARRAY(String))
    short_analysis: Mapped[str] = mapped_column(String)
    full_analysis: Mapped[str] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        Date, onupdate=func.now(), default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        Date, onupdate=func.now(), default=func.now()
    )

    user: Mapped["User"] = relationship(back_populates="analyses")
