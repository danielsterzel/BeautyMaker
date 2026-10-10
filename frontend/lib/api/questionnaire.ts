import {
  QuestionnaireAnswersInput,
  questionnaireAnswersSchema,
  questionnaireResponseSchema,
  QuestionnaireResponse,
} from "@/components/questionnaire";
import { api } from "./client";

const PREFIX = "/questionnaires";

export async function submitQuestionnaireAnswers(
  answers: QuestionnaireAnswersInput,
) {
  const validatedAnswers = questionnaireAnswersSchema.parse(answers);

  const response = await api.post<QuestionnaireResponse>(
    `${PREFIX}/answers`,
    validatedAnswers,
  );

  return questionnaireResponseSchema.parse(response);
}
