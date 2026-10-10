from http.client import responses

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from app.db.base import Base


class Repository[T: Base]:

    def __init__(self, session: AsyncSession, model: type[T]):
        self.session = session
        self.model = model

    async def get_by_id(self, e_id: UUID) -> T | None:

        query = select(self.model).where(self.model.id == e_id)
        response = await self.session.execute(query)
        return response.scalar_one_or_none()

    async def get_all(self) -> list[T]:

        query = select(self.model)
        response = await self.session.execute(query)
        return list(response.scalars().all())

    async def add(self, entity: T) -> T:

        self.session.add(entity)
        await self.session.flush()
        return entity

    async def delete(self, entity: T) -> None:
        await self.session.delete(entity)
