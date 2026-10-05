import {
  Droplets,
  Flower2,
  Heart,
  Layers3,
  MessageCircleMore,
  Route,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import type { QuestionTone, QuestionVisualName } from "./types";

const toneStyles: Record<QuestionTone, string> = {
  blush: "from-[#f4dfe7] via-white to-[#fbf4f6] text-[#b88a99]",
  powder: "from-[#e4eef5] via-white to-[#f5f8fa] text-[#8ea6b7]",
  lavender: "from-[#ebe5f2] via-white to-[#f8f5fb] text-[#9c8aaa]",
  peach: "from-[#f7e3d8] via-white to-[#fcf7f2] text-[#bd927d]",
  cream: "from-[#eee6dc] via-white to-[#faf7f1] text-[#aa9684]",
};

function CreamTubeIcon() {
  return (
    <svg viewBox="0 0 80 90" className="h-16 w-16" aria-hidden="true">
      <path d="M24 11h32l-4 13H28Z" fill="currentColor" opacity=".22" />
      <path d="M28 22h24l8 50a7 7 0 0 1-7 8H27a7 7 0 0 1-7-8Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.4" />
      <path d="M24 63h32M33 40h14" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" />
      <circle cx="40" cy="50" r="4" fill="currentColor" opacity=".28" />
    </svg>
  );
}

const icons = {
  flower: Flower2,
  sparkles: Sparkles,
  drop: Droplets,
  routine: Layers3,
  heart: Heart,
  shield: ShieldCheck,
  doctor: Stethoscope,
  path: Route,
  conversation: MessageCircleMore,
};

type QuestionVisualProps = {
  visual: QuestionVisualName;
  tone: QuestionTone;
};

export function QuestionVisual({ visual, tone }: QuestionVisualProps) {
  const Icon = visual === "cream" ? null : icons[visual];

  return (
    <div className="relative mx-auto grid h-40 w-40 place-items-center sm:h-48 sm:w-48" aria-hidden="true">
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${toneStyles[tone]} opacity-85 blur-[1px]`} />
      <div className="absolute inset-[18%] rounded-full border border-white/90 bg-white/45 backdrop-blur-sm" />
      <span className="relative text-[#a9a2a3]">
        {visual === "cream" ? <CreamTubeIcon /> : Icon ? <Icon size={62} strokeWidth={1.15} /> : null}
      </span>
      <span className="absolute right-[8%] top-[17%] h-3 w-3 rounded-full bg-white/80 shadow-sm" />
      <span className="absolute bottom-[15%] left-[5%] h-5 w-5 rounded-full border border-white/80 bg-white/35" />
    </div>
  );
}
