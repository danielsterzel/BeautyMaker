import type { ReactNode } from "react";
import { CupcakeMascot } from "@/components/beauty-maker/cupcake-mascot";

type QuestionnaireShellProps = {
  answeredCount: number;
  totalQuestions: number;
  thinkingLabel: string;
  children: ReactNode;
};

export function QuestionnaireShell({
  answeredCount,
  totalQuestions,
  thinkingLabel,
  children,
}: QuestionnaireShellProps) {
  const progress = Math.min(100, Math.max(0, (answeredCount / totalQuestions) * 100));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f1ed] px-3 py-3 text-[#312c2d] sm:px-5 sm:py-5">
      <div className="pointer-events-none absolute -left-44 top-14 h-[30rem] w-[30rem] rounded-full bg-[#f0dce5]/70 blur-[100px]" />
      <div className="pointer-events-none absolute -right-44 bottom-0 h-[32rem] w-[32rem] rounded-full bg-[#dce9f2]/65 blur-[110px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-black/[0.055] bg-[#fffdfb] shadow-[0_28px_90px_rgba(72,57,62,0.08)] sm:min-h-[calc(100vh-2.5rem)]">
        <header className="grid min-h-24 grid-cols-[1fr_auto] items-center gap-5 border-b border-black/[0.055] px-5 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-12">
          <a href="/" className="text-lg font-bold tracking-[-0.06em]" aria-label="BeautyMaker home">
            BeautyMaker<span className="ml-1 align-top text-xs text-[#c986a2]">✦</span>
          </a>

          <div className="hidden items-center gap-3 text-[#9e9496] lg:flex" aria-live="polite">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#ead8e0] border-t-[#bd839a]" />
            <span className="text-[11px] font-normal tracking-[0.02em]">{thinkingLabel}</span>
          </div>

          <div className="justify-self-end text-right">
            <span className="block text-xs font-medium text-[#6e6567]">{answeredCount} / {totalQuestions}</span>
            <span className="mt-1 block text-[9px] font-normal uppercase tracking-[0.13em] text-[#b2a9ab]">questions answered</span>
          </div>
        </header>

        <div className="h-1 w-full bg-[#f3efec]" aria-hidden="true">
          <div
            className="h-full rounded-r-full bg-gradient-to-r from-[#e8b8ca] via-[#cfc0e5] to-[#bcd7e8] transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative flex flex-1 flex-col">
          <div className="pointer-events-none absolute left-1/2 top-[46%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.98)_0%,rgba(250,243,246,0.62)_45%,rgba(239,235,246,0.12)_72%,transparent_76%)]" />
          <div className="relative z-10 flex flex-1 flex-col">{children}</div>
        </div>

        <footer className="relative z-10 flex flex-col gap-3 border-t border-black/[0.05] px-5 py-5 text-[10px] font-normal text-[#aaa1a3] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>BeautyMaker helps you care for your skin — never judge it.</span>
          <span className="flex items-center gap-2"><CupcakeMascot className="h-7 w-6" decorative /> You can revisit your answers anytime.</span>
        </footer>
      </div>
    </main>
  );
}
