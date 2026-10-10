export type ModeKey = "puffy" | "clean" | "gnarly" | "clinical";


export const modes: Record<
  ModeKey,
  {
    label: string;
    short: string;
    icon: string;
    accent: string;
    soft: string;
    glow: string;
    message: string;
    note: string;
  }
> = {
  puffy: {
    label: "Puffy Cloud 🌸",
    short: "Puffy Cloud",
    icon: "✿",
    accent: "#d98eac",
    soft: "#fae8ef",
    glow: "#dceefe",
    message: "Your skin looks calm, bouncy and beautifully hydrated today.",
    note: "Way to gooo — we’re so proud of you ✨",
  },
  clean: {
    label: "Clean & Elegant",
    short: "Clean",
    icon: "✦",
    accent: "#202022",
    soft: "#eeeeef",
    glow: "#e2edf5",
    message: "Your skin looks calm and well hydrated today.",
    note: "Your current routine is performing consistently.",
  },
  gnarly: {
    label: "Gnarly",
    short: "Gnarly",
    icon: "⚡",
    accent: "#876347",
    soft: "#eee5dc",
    glow: "#ddcdbd",
    message: "Okay — your skin is looking seriously solid today.",
    note: "Keep the routine. No need to mess with a good thing.",
  },
  clinical: {
    label: "Clinical",
    short: "Clinical",
    icon: "＋",
    accent: "#4e91bd",
    soft: "#e3f1fa",
    glow: "#dff2ec",
    message: "Visible dryness appears reduced compared with your baseline.",
    note: "Continue the current routine and reassess in seven days.",
  },
};



export const storySteps = [
  {
    number: "01",
    eyebrow: "Begin with a gentle check-in",
    title: "Tell us what your skin is experiencing.",
    text: "Your current routine, the things you have noticed and the context around them. No instant verdicts — just a thoughtful starting point.",
    note: "Your skin is observed, never judged.",
    accent: "text-[#b67d87]",
  },
  {
    number: "02",
    eyebrow: "Change one thing",
    title: "A small experiment, designed around you.",
    text: "BeautyMaker suggests one considered change and keeps the rest of your routine steady, so you can learn what genuinely makes a difference.",
    note: "One change. Enough time. A clearer answer.",
    accent: "text-[#9a82ad]",
  },
  {
    number: "03",
    eyebrow: "Let the story unfold",
    title: "Look back with context — not criticism.",
    text: "Compare similar moments, notice patterns and decide whether to keep, revert or gently try what comes next. Progress without perfection pressure.",
    note: "Every skin has its own pace.",
    accent: "text-[#b67d87]",
  },
];