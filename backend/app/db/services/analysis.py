from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.analysis import AnalysisRepository
from app.models.analysis import Analysis


class AnalysisDbService:
    def __init__(self, db: AsyncSession):
        self.repository = AnalysisRepository(db)

    async def validate_exists_by_id(self, analysis_id: UUID) -> bool:
        analysis = await self.repository.get_by_id(e_id=analysis_id)
        return analysis is not None

    async def get_by_id(self, analysis_id: UUID) -> Analysis:
        analysis = await self.repository.get_by_id(e_id=analysis_id)
        if not analysis:
            raise ValueError("AnalysisDbService: No such analysis")
        return analysis

    async def get_by_user_id(self, user_id: UUID) -> list[Analysis]:
        return await self.repository.get_by_user_id(user_id)

    async def get_latest_by_user_id(self, user_id: UUID) -> Analysis | None:
        return await self.repository.get_latest_by_user_id(user_id)

    async def save_analysis(self, analysis: Analysis) -> None:
        await self.repository.add(analysis)
