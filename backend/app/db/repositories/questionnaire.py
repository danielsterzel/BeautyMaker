from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.repository import Repository
from app.models import Questionnaire


class QuestionnaireRepository(Repository[Questionnaire]):

    def __init__(self, session: AsyncSession):
        super().__init__(session, Questionnaire)
