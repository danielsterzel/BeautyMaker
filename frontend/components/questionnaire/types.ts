export type QuestionTone = "blush" | "powder" | "lavender" | "peach" | "cream";

export type QuestionVisualName =
  | "flower"
  | "cream"
  | "sparkles"
  | "drop"
  | "routine"
  | "heart"
  | "shield"
  | "doctor"
  | "path"
  | "conversation";

export type ChoiceOption = {
  value: string;
  label: string;
  description?: string;
};

export type QuestionDefinition = {
  id: string;
  question: string;
  supportingText?: string;
  thinkingLabel: string;
  visual: QuestionVisualName;
  tone: QuestionTone;
};
