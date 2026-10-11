from app.schemas.configured_schema import ConfiguredSchema
from uuid import UUID
from datetime import datetime


class AnalysisRead(ConfiguredSchema):
    id: UUID
    concerns: list[str]
    short_analysis: str
    full_analysis: str
    created_at: datetime
    updated_at: datetime


class AnalysisWrite(ConfiguredSchema):
    concerns: list[str]
    short_analysis: str
    full_analysis: str
