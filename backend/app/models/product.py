from enum import StrEnum

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import String, Text, ForeignKey, Enum, Boolean
from app.db.base import Base
from uuid import UUID


class ProductTypeEnum(StrEnum):

    SPF = "spf"
    MOISTURIZER = "moisturizer"
    SERUM = "serum"
    RETINOID = "retinoid"
    EXFOLIANT = "exfoliant"
    CLEANSER = "cleanser"
    ELSE = "else"


class Product(Base):

    __tablename__ = "products"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), nullable=False, primary_key=True
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    brand_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("brands.id", ondelete="CASCADE"),
        nullable=False,
    )
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    category: Mapped[ProductTypeEnum] = mapped_column(
        Enum(ProductTypeEnum, name="product_type_enum"), nullable=False
    )

    brand: Mapped["Brand"] = relationship(back_populates="products")

    is_sponsored: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="false"
    )
