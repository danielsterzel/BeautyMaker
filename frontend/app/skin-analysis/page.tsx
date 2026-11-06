"use client";
import { Inital } from "./steps/Initial";
import { useSkinAnalysis } from "./SkinAnalysisContext";
export default function SkinAnalysis() {

  const {currentStep} = useSkinAnalysis()
  return (
    <div>
      {/* <Inital/> */}
      {currentStep === 1 && <Inital />}
      {currentStep === 2 && <div>2</div>}

    </div>
  );
}
