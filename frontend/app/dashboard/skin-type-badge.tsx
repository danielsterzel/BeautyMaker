import { Droplets, Sparkles } from "lucide-react";

type SkinType = "Balanced" | "Combination" | "Dry" | "Oily";

function inferSkinType(
  questionnaire: Record<string, unknown> | null,
): SkinType | null {
  if (!questionnaire) return null;

  const afterCleansing = questionnaire.afterCleansing;
  const middleDay = questionnaire.middleDay;

  if (middleDay === "shiny_t_zone" || middleDay === "varies") {
    return "Combination";
  }

  if (middleDay === "oily_all_over") {
    return afterCleansing === "tight_or_uncomfortable" ||
      afterCleansing === "dry_after_a_while"
      ? "Combination"
      : "Oily";
  }

  if (middleDay === "dry_or_tight") {
    return afterCleansing === "oily_quickly" ? "Combination" : "Dry";
  }

  if (afterCleansing === "oily_quickly") return "Oily";
  if (
    afterCleansing === "tight_or_uncomfortable" ||
    afterCleansing === "dry_after_a_while"
  ) {
    return "Dry";
  }
  if (afterCleansing === "balanced" && middleDay === "balanced") {
    return "Balanced";
  }

  return null;
}

export function SkinTypeBadge({
  questionnaire,
}: Readonly<{ questionnaire: Record<string, unknown> | null }>) {
  const skinType = inferSkinType(questionnaire);

  return (
    <div
      className="mt-7 inline-flex items-center gap-3 rounded-full border border-[#e4cfd3] bg-[linear-gradient(110deg,rgba(255,253,251,0.96),rgba(249,235,239,0.9))] py-2 pl-2 pr-4 shadow-[0_10px_28px_rgba(132,87,96,0.09)]"
      aria-label={skinType ? `Skin type: ${skinType}` : "Skin type ready to discover"}
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eedde2] text-[#a66f79] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75)]">
        <Droplets size={17} strokeWidth={1.8} />
      </span>
      <span className="text-left">
        <span className="block text-[8px] font-semibold uppercase tracking-[0.18em] text-[#aa8d92]">
          Skin type based on questionnaire
        </span>
        <span className="mt-0.5 block text-[13px] font-semibold tracking-[-0.02em] text-[#4d4143]">
          {skinType ? `${skinType} skin` : "Ready to discover"}
        </span>
      </span>
      <Sparkles
        size={13}
        className="ml-1 text-[#c28f98]"
      />
    </div>
  );
}
