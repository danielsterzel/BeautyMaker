from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import String, Boolean
from app.db.base import Base
from uuid import UUID


class Brand(Base):

    __tablename__ = "brands"

    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True)
    brand_name: Mapped[str] = mapped_column(String(120), nullable=False)

    products: Mapped[list["Product"]] = relationship(
        back_populates="brand", passive_deletes=True, cascade="all, delete-orphan"
    )

    is_partner: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )
