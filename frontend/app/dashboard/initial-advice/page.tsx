import type { Metadata } from "next";

import { InitialAdvice } from "../initial-advice";

export const metadata: Metadata = {
  title: "Your skin analysis — BeautyMaker",
  description: "Your personalized BeautyMaker skincare analysis.",
};

export default function InitialAdvicePage() {
  return <InitialAdvice />;
}
