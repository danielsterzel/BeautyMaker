export enum AfterCleansingAnswer {
  TIGHT_OR_UNCOMFORTABLE = "tight_or_uncomfortable",
  BALANCED = "balanced",
  DRY_AFTER_A_WHILE = "dry_after_a_while",
  OILY_QUICKLY = "oily_quickly",
  NOT_SURE = "not_sure",
}

export enum MiddleOfTheDayAnswer {
  BALANCED = "balanced",
  SHINY_T_ZONE = "shiny_t_zone",
  OILY_ALL_OVER = "oily_all_over",
  DRY_OR_TIGHT = "dry_or_tight",
  VARIES = "varies",
  NOT_SURE = "not_sure",
}

export enum SkinConcernAnswer {
  DRYNESS = "dryness",
  BREAKOUTS = "breakouts",
  CLOGGED_PORES = "clogged_pores",
  REDNESS = "redness",
  TEXTURE = "texture",
  UNEVEN_TONE = "uneven_tone",
  SENSITIVITY = "sensitivity",
}

export enum ReactiveSkinAnswer {
  RARELY = "rarely",
  SOMETIMES = "sometimes",
  OFTEN = "often",
  VERY_EASILY = "very_easily",
}

export enum CurrentRoutineAnswer {
  CLEANSER = "cleanser",
  MOISTURIZER = "moisturizer",
  SPF = "spf",
  SERUM = "serum",
  RETINOID = "retinoid",
  EXFOLIANT = "exfoliant",
  ELSE = "else",
}

export enum ApproachAnswer {
  MINIMAL = "keep_it_minimal",
  EXPERIMENT = "im_happy_to_experiment",
  ADVANCED = "more_steps",
}

export enum ConversationModeAnswer {
  SOFT = "soft",
  CLEAN = "clean",
  DIRECT = "direct",
  CLINICAL = "clinical",
}

export enum LovedProductsAnswer {
  YES = "yes",
  NOT_REALLY = "not_really",
}

export enum DermatologistAdviceAnswer {
  YES = "yes",
  NO = "no",
}

export const QUESTION_ANSWER_ENUMS = {
  q1: AfterCleansingAnswer,
  q2: MiddleOfTheDayAnswer,
  q3: SkinConcernAnswer,
  q4: ReactiveSkinAnswer,
  q5: CurrentRoutineAnswer,
  q6: LovedProductsAnswer,
  q8: DermatologistAdviceAnswer,
  q9: ApproachAnswer,
  q10: ConversationModeAnswer,
} as const;

export type QuestionWithEnumAnswer = keyof typeof QUESTION_ANSWER_ENUMS;
