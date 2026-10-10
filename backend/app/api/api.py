from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependency import get_db
from app.db.repositories.questionnaire import QuestionnaireRepository
from app.models.questionnaire import Questionnaire
from app.schemas.questionnaire import (
    QuestionnaireAnswers,
    QuestionnaireResponse,
    LovedProductsAnswer,
    DermatologistAdviceAnswer,
)

from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/questionnaires", tags=["Questionnaires"])


@router.post(
    "/answers",
    response_model=QuestionnaireResponse,
    status_code=status.HTTP_201_CREATED,
)
async def questionnaire_answers(
    questionnaire_post: QuestionnaireAnswers,
    session: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    answers_json = questionnaire_post.model_dump(
        exclude_none=True,
        mode="json",
        exclude={
            "loved_products",
            "dermatologist_advice",
        },
    )

    if questionnaire_post.loved_products_answer == LovedProductsAnswer.YES:
        answers_json["loved_products"] = questionnaire_post.loved_products

    if questionnaire_post.dermatologist_advice_answer == DermatologistAdviceAnswer.YES:
        answers_json["dermatologist_advice"] = questionnaire_post.dermatologist_advice

    questionnaire = Questionnaire(
        user_id=user.id,
        question_answers=answers_json,
    )

    repository = QuestionnaireRepository(session)

    await repository.add(questionnaire)
    await session.commit()
    await session.refresh(questionnaire)

    return questionnaire
