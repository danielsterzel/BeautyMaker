from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.repository import Repository
from app.models.analysis import Analysis


class AnalysisRepository(Repository[Analysis]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, Analysis)

    async def get_by_user_id(self, user_id: UUID) -> list[Analysis]:
        query = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .order_by(self.model.created_at.desc())
        )
        response = await self.session.execute(query)
        return list(response.scalars().all())

    async def get_latest_by_user_id(self, user_id: UUID) -> Analysis | None:
        query = (
            select(self.model)
            .where(self.model.user_id == user_id)
            .order_by(self.model.created_at.desc())
            .limit(1)
        )
        response = await self.session.execute(query)
        return response.scalar_one_or_none()
