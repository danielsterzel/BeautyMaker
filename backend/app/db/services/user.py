from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.user import UserRepository
from uuid import UUID
from app.models.user import User


class UserDbService:

    def __init__(self, db: AsyncSession):
        self.repository = UserRepository(db)

    async def validate_exists_by_id(self, user_id: UUID) -> bool:

        exits = await self.repository.get_by_id(e_id=user_id)

        return True if exits else False

    async def validate_exists_by_email(self, email: str) -> bool:

        exists = await self.repository.get_by_email(email)

        return True if exists else False

    async def get_by_id(self, user_id: UUID) -> User:

        user = await self.repository.get_by_id(e_id=user_id)
        if not user:
            raise ValueError("UserDbService: No such user")
        return user

    async def get_by_email(self, email: str) -> User | None:
        return await self.repository.get_by_email(email)

    async def save_user(self, user: User) -> None:
        await self.repository.add(user)
