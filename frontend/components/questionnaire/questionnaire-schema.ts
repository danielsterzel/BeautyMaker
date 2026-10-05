import { z } from "zod";

import {
  AfterCleansingAnswer,
  ApproachAnswer,
  ConversationModeAnswer,
  CurrentRoutineAnswer,
  DermatologistAdviceAnswer,
  LovedProductsAnswer,
  MiddleOfTheDayAnswer,
  ReactiveSkinAnswer,
  SkinConcernAnswer,
} from "./answer-enums";

const productNameSchema = z
  .string()
  .trim()
  .min(1, "Product name cannot be empty")
  .max(200, "Product name is too long");

const productBrandSchema = z
  .string()
  .trim()
  .min(1, "Product brand cannot be empty")
  .max(120, "Product brand is too long");

const freeTextSchema = z
  .string()
  .trim()
  .min(1, "Text cannot be empty")
  .max(2_000, "Text is too long");

export const skincareProductSchema = z.object({
  name: productNameSchema,
  brand: productBrandSchema.nullable().optional(),
  notes: freeTextSchema.nullable().optional(),
});

export const dermatologistAdviceSchema = z.object({
  content: freeTextSchema,
});

export const questionnaireAnswersSchema = z
  .object({
    afterCleansing: z.enum(AfterCleansingAnswer),
    middleDay: z.enum(MiddleOfTheDayAnswer),
    concerns: z.array(z.enum(SkinConcernAnswer)),
    reactiveSkin: z.enum(ReactiveSkinAnswer),
    currentRoutine: z.array(z.enum(CurrentRoutineAnswer)),
    lovedProductsAnswer: z.enum(LovedProductsAnswer),
    lovedProducts: z.array(skincareProductSchema).default([]),
    unlikedProducts: z.array(skincareProductSchema).default([]),
    dermatologistAdviceAnswer: z
      .enum(DermatologistAdviceAnswer)
      .nullable()
      .default(null),
    dermatologistAdvice: dermatologistAdviceSchema.nullable().default(null),
    approach: z.enum(ApproachAnswer),
    conversationMode: z.enum(ConversationModeAnswer),
  })
  .superRefine((answers, context) => {
    if (
      answers.lovedProductsAnswer === LovedProductsAnswer.NOT_REALLY &&
      answers.lovedProducts.length > 0
    ) {
      context.addIssue({
        code: "custom",
        path: ["lovedProducts"],
        message:
          "Loved products must be empty when the answer is not really yet",
      });
    }

    if (
      answers.dermatologistAdviceAnswer !== DermatologistAdviceAnswer.YES &&
      answers.dermatologistAdvice !== null
    ) {
      context.addIssue({
        code: "custom",
        path: ["dermatologistAdvice"],
        message:
          "Dermatologist advice can only be provided when the answer is yes",
      });
    }
  });

export type SkincareProductInput = z.input<typeof skincareProductSchema>;
export type QuestionnaireAnswersInput = z.input<
  typeof questionnaireAnswersSchema
>;
export type QuestionnaireAnswers = z.output<typeof questionnaireAnswersSchema>;
