from decimal import Decimal

from pydantic import BaseModel, field_validator
from typing import Literal, Any, Self
from uuid import UUID
from datetime import datetime

class NormalizedSkinTarget(BaseModel):
    original_name: str
    normalized_name: str
    category: Literal["SKIN_CONCERN", "SKIN_GOAL", "PRODUCT_FUNCTION", "OTHER"]
    needs_review: bool


class NormalizedSkinOutput(BaseModel):
    normalized_targets: list[NormalizedSkinTarget]

import pandas as pd

# ['brand', 'product-name', 'ingredients', 'category', 'sub-category', 'application-area',
#  'inci', 'size[ml]', 'price[euro]', 'source-url', 'last-verified', 'features', 'concentration-ingredient',
#  'concentration', 'targets', 'sutied-for', 'ph', 'rating', 'review-count']

df = pd.read_parquet("skincare-products-clean.parquet")

# print(df['product-name'].isna().any())
# print(df['product-name'].str.strip().eq("").fillna(False))

# print(df['ingredients'].isna().any())
# print(df['ingredients'].apply(lambda l: isinstance(l, list) and len(l) == 0).any())

# print(df['category'].isna().any())
# print(df['category'].isna().sum())
# print(df['sub-category'].isna().sum())
# print(df['application-area'].isna().sum())

# print(df['inci'].isna().sum())
# print(df['size[ml]'].isna().sum())
# print(df['price[euro]'].isna().sum())
# print(df['source-url'].isna().sum())
# print(df['targets'].dtype)

OptString = str | None

class ProductNode(BaseModel):
    id: UUID
    brand: str
    product_name: str # not null
    ingredients: list[str] # no empty lists I checked
    category: OptString = None# some nulls 172 out of 1930 records
    sub_category: OptString = None # 751 nulls out of 1930
    application_area: OptString = None# 657 nulls
    inci:OptString = None# 1054 nulls...
    size: float | None = None# in ml, 503 nulls
    price: Decimal | None = None # 1712 nulls
    source_url: str # no nulls
    last_verified: datetime
    features: list[str] | None = None
    concentration_ingredient: OptString = None
    concentration: float | None = None
    targets: OptString = None
    suited_for: OptString = None
    ph: tuple[float, float] | list[float] | None = None
    rating: float | None = None
    review_count: int

