from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.repository import Repository
from app.models.email_verification_token import EmailVerificationToken


class EmailVerificationTokenRepository(Repository[EmailVerificationToken]):
    def __init__(self, session: AsyncSession):
        super().__init__(session, EmailVerificationToken)

    async def get_by_hash(self, token_hash: str) -> EmailVerificationToken | None:
        query = select(self.model).where(self.model.token_hash == token_hash)
        response = await self.session.execute(query)
        return response.scalar_one_or_none()

    async def get_by_hash_for_update(
        self, token_hash: str
    ) -> EmailVerificationToken | None:
        query = (
            select(self.model)
            .where(self.model.token_hash == token_hash)
            .with_for_update()
        )
        response = await self.session.execute(query)
        return response.scalar_one_or_none()

    async def get_by_user_id_for_update(
        self, user_id: UUID
    ) -> EmailVerificationToken | None:
        query = (
            select(self.model).where(self.model.user_id == user_id).with_for_update()
        )
        response = await self.session.execute(query)
        return response.scalar_one_or_none()

    async def replace_for_user(
        self,
        *,
        user_id: UUID,
        token_hash: str,
        created_at: datetime,
        expires_at: datetime,
    ) -> EmailVerificationToken:
        token = await self.get_by_user_id_for_update(user_id)

        if token is None:
            token = EmailVerificationToken(user_id=user_id, token_hash=token_hash)
            self.session.add(token)

        token.token_hash = token_hash
        token.created_at = created_at
        token.expires_at = expires_at
        await self.session.flush()
        return token
