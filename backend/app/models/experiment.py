from app.db.base import Base
from datetime import datetime
from sqlalchemy import String, ForeignKey, Date, func
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from uuid import UUID, uuid4


class Experiment(Base):

    __tablename__ = "experiments"
    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid4
    )
