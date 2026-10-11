from __future__ import annotations
import json
from openai import AsyncOpenAI
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.dependency import AsyncSessionLocal
from app.core.settings import settings
from app.models import Questionnaire
from app.schemas.configured_schema import ConfiguredSchema
from app.schemas.questionnaire import QuestionnaireAnswers, LovedProductsAnswer, SkincareProduct, \
    DermatologistAdviceAnswer
from uuid import UUID
import logging

logger = logging.getLogger("beautymaker.tokens")
logger.setLevel(logging.INFO)

handler = logging.FileHandler("token_usage.log", encoding="utf-8")
logger.addHandler(handler)

async def infer_model(user_id: UUID):

    async with AsyncSessionLocal() as session:

        questionnaire = await get_user_questionnaire_info(session=session, user_id=user_id)

        instruction, context = prepare_prompt_context(questionnaire)

        async with AsyncOpenAI(
            api_key=settings.open_ai_key
        ) as client:

            async with client.responses.stream(
                model=settings.open_ai_model,
                instructions=instruction,
                input=context,
                text_format=SkinAnalysis,
            ) as stream:

                async for event in stream:
                    if event.type == "response.output_text.delta":
                        yield event.delta

                    elif event.type == "response.completed":
                        usage = event.response.usage

                        if usage:
                            logger.info(
                                "Model=%s | Input=%s | Output=%s | Total=%s",
                                event.response.model,
                                usage.input_tokens,
                                usage.output_tokens,
                                usage.total_tokens,
                            )

async def get_user_questionnaire_info(session: AsyncSession, user_id: UUID) -> Questionnaire | None:

    query = select(Questionnaire).where(Questionnaire.user_id == user_id)

    response = await session.execute(query)

    questionnaire = response.scalar_one_or_none()

    return questionnaire

def prepare_prompt_context(questionnaire: Questionnaire | None) -> tuple[str, str] | None:
    if not questionnaire:
        return None

    instructions = """
    You are an skincare research assitant
    
    Your tasks:
    1. Analyze the user's questionnaire
    2. Identify reported skin concerns
    3. Distinguish observations from assumptions
    4. Do not provide medical diagnoses.
    5. Provide advice what potential ingredients, serums, moisturizers or any other product
        can improve user's skin concerns. Provide a list of top 7 products. If 
        you determine that there are less products than 7 then return only the list
        of less than 7.
    6. Conversation mode is really important. Do not shy away from using emoticons
    
    Respect the user's preferences and reported dermatologist advice.
    Clearly communicate uncertainty.
    
    Return concerns as short labels suitable for UI badges.
    Keep short_analysis to 2-3 sentences.
    Write full_analysis as detailed Markdown.
    """



    schema = QuestionnaireAnswers.model_validate(questionnaire.question_answers)

    used_products = ", ".join(str(routine_product.value) for routine_product in schema.current_routine)


    user_questionnaire_answers = {
        "How user's skin feels after cleansing": schema.after_cleansing.value,
        "How user's skin feels in the middle of the day (some time after cleansing)": schema.middle_day.value,
        "How often does user's skin react to new products": schema.reactive_skin.value,
        "User's current used products (categories)": used_products,
        "User's preferred approach": schema.approach.value
    }

    include_user_loved_products = schema.loved_products_answer == LovedProductsAnswer.YES
    has_dermatologist = schema.dermatologist_advice_answer == DermatologistAdviceAnswer.YES

    unliked_products = schema.unliked_products

    if include_user_loved_products:

        loved_products = ", ".join(SkincareProduct.model_dump_json(product) for product in schema.loved_products) # to jest json wiec czy to będzie
        # problem dla modelu?
        inclusion = """User's loved products. Include these or similar depending on the mode of approach answer.
                              If approach answer is 'minimal' include loved products along with a few advised products. If 
                              approach answer is 'experiment' include products that are similar to loved products. If 
                              approach answer is 'advanced' include both loved products and advised products"""
        user_questionnaire_answers[inclusion] = loved_products

    if unliked_products:
        unliked_inclusion = "User's unliked products (avoid these)"
        unliked = ", ".join(SkincareProduct.model_dump_json(product) for product in schema.unliked_products)
        user_questionnaire_answers[unliked_inclusion] = unliked

    if has_dermatologist:

        dermatologist_inclusion = "User has  dermatologist advice or recommendations. Strictly follow it."
        dermatologist_advice = schema.dermatologist_advice.content

        user_questionnaire_answers[dermatologist_inclusion] = dermatologist_advice

    user_concerns = ", ".join([str(concern.value) for concern in schema.concerns])

    context = f"""
        [USER SKIN CONCERNS]:
        {json.dumps([user_concerns], ensure_ascii=False)}

        [USER QUESTIONNAIRE]:
        {json.dumps(user_questionnaire_answers, ensure_ascii=False, indent=2)}

        [USER PREFERRED CONVERSATION MODE]:
        {schema.conversation_mode.value}
    """

    return instructions, context

class SkinAnalysis(ConfiguredSchema):
    concerns: list[str]
    short_analysis: str
    full_analysis: str