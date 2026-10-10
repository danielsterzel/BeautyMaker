from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.db.repositories.repository import Repository
from app.models.user import User
from sqlalchemy import select


class UserRepository(Repository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, User)

    async def get_by_email(self, email: str) -> User | None:

        query = select(self.model).where(self.model.email == email)

        response = await self.session.execute(query)
        return response.scalar_one_or_none()

    async def get_by_email_for_update(self, email: str) -> User | None:
        query = select(self.model).where(self.model.email == email).with_for_update()

        response = await self.session.execute(query)
        return response.scalar_one_or_none()

    async def get_by_id_for_update(self, user_id: UUID) -> User | None:
        query = select(self.model).where(self.model.id == user_id).with_for_update()

        response = await self.session.execute(query)
        return response.scalar_one_or_none()
