import type { Metadata } from "next";
import { QuestionnaireDemo } from "@/components/questionnaire";

export const metadata: Metadata = {
  title: "Your skin story — BeautyMaker",
  description: "A gentle introduction to your skin, routine and preferences.",
};

export default function QuestionnairePage() {
  return <QuestionnaireDemo />;
}
