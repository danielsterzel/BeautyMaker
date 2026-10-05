from fastapi import APIRouter, HTTPException, status

from app.schemas.questionnaire import QuestionnaireAnswers

router = APIRouter()

@router.post("/questionnaire-answers")
async def questionnaire_answers(questionnaire_post: QuestionnaireAnswers):


    ...
