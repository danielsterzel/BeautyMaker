

"use client";

import { useOnboarding } from "./OnboardingContext";

export function SkinProfileProgress() {
  const { currentStep, totalSteps } = useOnboarding();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <p className="tracking-wider text-deep-champagne text-xs uppercase">
          Your skin profile
        </p>

        <p className="tracking-widest text-xs text-deep-champagne">
          {String(currentStep).padStart(2, "0")} /{" "}
          {String(totalSteps).padStart(2, "0")}
        </p>
      </div>

      <div className="flex w-full gap-1.5">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              index < currentStep
                ? "bg-deep-champagne"
                : "bg-neutral-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}