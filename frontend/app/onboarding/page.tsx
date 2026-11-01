"use client";
import { Inital } from "./steps/Initial";
import { useOnboarding } from "./OnboardingContext";
export default function Onboarding() {

  const {currentStep} = useOnboarding()
  return (
    <div>
      {/* <Inital/> */}
      {currentStep === 1 && <Inital />}
      {currentStep === 2 && <div>2</div>}

    </div>
  );
}
