from __future__ import annotations

from enum import StrEnum
from typing import Annotated

from pydantic import Field, StringConstraints, model_validator

from app.schemas.configured_schema import ConfiguredSchema

from uuid import UUID
from datetime import datetime


class AfterCleansingAnswer(StrEnum):
    TIGHT_OR_UNCOMFORTABLE = "tight_or_uncomfortable"
    BALANCED = "balanced"
    DRY_AFTER_A_WHILE = "dry_after_a_while"
    OILY_QUICKLY = "oily_quickly"
    NOT_SURE = "not_sure"


class MiddleOfTheDayAnswer(StrEnum):
    BALANCED = "balanced"
    SHINY_T_ZONE = "shiny_t_zone"
    OILY_ALL_OVER = "oily_all_over"
    DRY_OR_TIGHT = "dry_or_tight"
    VARIES = "varies"
    NOT_SURE = "not_sure"


class SkinConcernAnswer(StrEnum):
    DRYNESS = "dryness"
    BREAKOUTS = "breakouts"
    CLOGGED_PORES = "clogged_pores"
    REDNESS = "redness"
    TEXTURE = "texture"
    UNEVEN_TONE = "uneven_tone"
    SENSITIVITY = "sensitivity"


class ReactiveSkinAnswer(StrEnum):
    RARELY = "rarely"
    SOMETIMES = "sometimes"
    OFTEN = "often"
    VERY_EASILY = "very_easily"


class CurrentRoutineAnswer(StrEnum):
    CLEANSER = "cleanser"
    MOISTURIZER = "moisturizer"
    SPF = "spf"
    SERUM = "serum"
    RETINOID = "retinoid"
    EXFOLIANT = "exfoliant"
    ELSE = "else"


class ApproachAnswer(StrEnum):
    MINIMAL = "keep_it_minimal"
    EXPERIMENT = "im_happy_to_experiment"
    ADVANCED = "more_steps"


class ConversationModeAnswer(StrEnum):
    SOFT = "soft"
    CLEAN = "clean"
    DIRECT = "direct"
    CLINICAL = "clinical"


class LovedProductsAnswer(StrEnum):
    YES = "yes"
    NOT_REALLY = "not_really"


class DermatologistAdviceAnswer(StrEnum):
    YES = "yes"
    NO = "no"


ProductName = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1, max_length=200),
]
ProductBrand = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1, max_length=120),
]
FreeText = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1, max_length=2_000),
]


class SkincareProduct(ConfiguredSchema):
    name: ProductName
    brand: ProductBrand | None = None
    notes: FreeText | None = None


class DermatologistAdvice(ConfiguredSchema):
    content: FreeText


class QuestionnaireAnswers(ConfiguredSchema):

    after_cleansing: AfterCleansingAnswer
    middle_day: MiddleOfTheDayAnswer
    concerns: list[SkinConcernAnswer]
    reactive_skin: ReactiveSkinAnswer
    current_routine: list[CurrentRoutineAnswer]
    loved_products_answer: LovedProductsAnswer
    loved_products: list[SkincareProduct] = Field(default_factory=list)
    unliked_products: list[SkincareProduct] = Field(default_factory=list)
    dermatologist_advice_answer: DermatologistAdviceAnswer | None = None
    dermatologist_advice: DermatologistAdvice | None = None

    approach: ApproachAnswer
    conversation_mode: ConversationModeAnswer

    @model_validator(mode="after")
    def validate_conditional_answers(self) -> QuestionnaireAnswers:
        if (
            self.loved_products_answer is LovedProductsAnswer.NOT_REALLY
            and self.loved_products
        ):
            raise ValueError(
                "loved_products must be empty when loved_products_answer is not_really"
            )

        if (
            self.dermatologist_advice_answer is not DermatologistAdviceAnswer.YES
            and self.dermatologist_advice is not None
        ):
            raise ValueError(
                "dermatologist_advice can only be provided when "
                "dermatologist_advice_answer is yes"
            )

        return self


class QuestionnaireResponse(ConfiguredSchema):
    id: UUID
    created_at: datetime
    updated_at: datetime
