import {
  DermatologistAdviceAnswer,
  LovedProductsAnswer,
  QuestionnaireAnswers,
  QuestionnaireAnswersInput,
} from "@/components/questionnaire";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const questionToField = {
  q1: "afterCleansing",
  q2: "middleDay",
  q3: "concerns",
  q4: "reactiveSkin",
  q5: "currentRoutine",
  q6: "lovedProductsAnswer",
  "q6-products": "lovedProducts",
  q7: "unlikedProducts",
  q8: "dermatologistAdviceAnswer",
  "q8-advice": "dermatologistAdvice",
  q9: "approach",
  q10: "conversationMode",
} as const satisfies Record<string, keyof QuestionnaireAnswers>;

export type QuestionKey = keyof typeof questionToField;
export type QuestionAnswerKey = QuestionKey | "q6-products" | "q8-advice";
type QuestionnaireStoreData = {
  answers: Partial<QuestionnaireAnswersInput>;
  expiresAt: Date;
};
type QuestionnaireStoreActions = {
  setAnswers: (questionKey: QuestionAnswerKey, value: unknown) => void;
  clear: () => void;
};
type QuestionnaireStore = QuestionnaireStoreActions & QuestionnaireStoreData;

function parseProductNames(value: unknown) {
  if (typeof value !== "string") return [];

  return value
    .split(",")
    .map((productName) => productName.trim())
    .filter(Boolean)
    .map((name) => ({ name }));
}


// The access token lives only in memory. The refresh token stays in an
// HttpOnly cookie managed by the backend.
type JWTTokenStoreData = {
  accessToken: string | null;
  sessionInitialized: boolean;
};
type JWTTokenStoreActions = {
  setToken: (accessToken: string) => void;
  clearTokens: () => void;
  markSessionInitialized: () => void;
};

type JWTTokenStore = JWTTokenStoreData & JWTTokenStoreActions;

export const useAuthStore = create<JWTTokenStore>()((updateToken) => ({
  accessToken: null,
  sessionInitialized: false,
  setToken: (accessToken) => {
    updateToken({ accessToken, sessionInitialized: true });
  },
  clearTokens: () => {
    updateToken({ accessToken: null, sessionInitialized: true });
  },
  markSessionInitialized: () => {
    updateToken({ sessionInitialized: true });
  },
}));

export const useQuestionnaireStore = create<QuestionnaireStore>()(
  persist(
    (updateStore) => ({
      answers: {},
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),

      setAnswers: (questionKey, value) => {
        updateStore((state) => {
          if (questionKey === "q6-products") {
            return {
              answers: {
                ...state.answers,
                lovedProducts: parseProductNames(value),
              },
            };
          }

          if (questionKey === "q7") {
            return {
              answers: {
                ...state.answers,
                unlikedProducts: parseProductNames(value),
              },
            };
          }

          if (questionKey === "q8-advice") {
            const advice = typeof value === "string" ? value : "";

            return {
              answers: {
                ...state.answers,
                dermatologistAdvice: advice ? { content: advice } : null,
              },
            };
          }

          const field = questionToField[questionKey];

          return {
            answers: {
              ...state.answers,
              [field]: value,
              ...(questionKey === "q6" && value !== LovedProductsAnswer.YES
                ? { lovedProducts: [] }
                : {}),
              ...(questionKey === "q8" &&
              value !== DermatologistAdviceAnswer.YES
                ? { dermatologistAdvice: null }
                : {}),
            },
          };
        });
      },
      clear: () => {
        updateStore({
          answers: {},
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        });
      },
    }),
    {
      name: "questionnaire-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
