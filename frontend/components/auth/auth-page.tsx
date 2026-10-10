"use client";

import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";

import { CupcakeMascot } from "@/components/beauty-maker/cupcake-mascot";

type AuthPageProps = {
  mode: "login" | "register";
};

const inputClassName =
  "mt-2 w-full rounded-[1rem] border border-black/[0.075] bg-white/75 px-4 py-3.5 text-[13px] font-normal text-[#4e4647] outline-none transition placeholder:text-[#bbb2b3] hover:border-[#d9c4ca] focus:border-[#bd929d] focus:bg-white focus:ring-4 focus:ring-[#ead9df]/45";

export function AuthPage({ mode }: AuthPageProps) {
  const isLogin = mode === "login";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f1ed] px-3 py-3 text-[#342e2f] selection:bg-[#f0ccd9] sm:px-5 sm:py-5">
      <div className="pointer-events-none absolute -left-44 top-0 h-[30rem] w-[30rem] rounded-full bg-[#f0dce5]/70 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#dce9f2]/65 blur-[110px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-black/[0.055] bg-[#fffdfb] shadow-[0_28px_90px_rgba(72,57,62,0.08)] sm:min-h-[calc(100vh-2.5rem)]">
        <header className="relative z-20 flex min-h-20 items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="text-lg font-bold tracking-[-0.06em]"
            aria-label="BeautyMaker home"
          >
            BeautyMaker
            <span className="ml-1 align-top text-xs text-[#c986a2]">✦</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-[11px] font-normal text-[#8d8385] transition hover:text-[#4c4445]"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
        </header>

        <div className="grid flex-1 lg:grid-cols-[0.88fr_1.12fr]">
          <section className="relative z-10 flex items-center px-5 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-24">
            <div className="mx-auto w-full max-w-[29rem]">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c399a1]" />
                <span className="text-[9px] font-medium uppercase tracking-[0.19em] text-[#9c7a7f]">
                  {isLogin ? "Welcome back" : "A gentle beginning"}
                </span>
              </div>

              <h1 className="mt-6 text-[clamp(2.6rem,4.3vw,4.7rem)] font-light leading-[1.02] tracking-[-0.065em] text-[#393233]">
                {isLogin ? (
                  <>
                    Continue your
                    <em className="mt-1 block font-light italic text-[#ad777e]">
                      skin story.
                    </em>
                  </>
                ) : (
                  <>
                    Make space for your
                    <em className="mt-1 block font-light italic text-[#ad777e]">
                      skin story.
                    </em>
                  </>
                )}
              </h1>

              <p className="mt-6 max-w-md text-[13px] font-normal leading-6 text-[#8f8587]">
                {isLogin
                  ? "Return to your observations, experiments and the routine that is becoming truly yours."
                  : "Create your account so BeautyMaker can remember what your skin loves — gently, over time."}
              </p>

              <button
                type="button"
                className="mt-8 flex w-full cursor-pointer items-center justify-center gap-3 rounded-[1rem] border border-black/[0.075] bg-white px-4 py-3.5 text-[12px] font-medium text-[#51494a] shadow-[0_8px_24px_rgba(76,58,64,0.04)] transition hover:-translate-y-0.5 hover:border-[#d6bdc5] hover:shadow-[0_12px_28px_rgba(76,58,64,0.07)]"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full border border-black/[0.08] bg-[#fffdfb] text-[11px] font-semibold">
                  G
                </span>
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-4" aria-hidden="true">
                <span className="h-px flex-1 bg-black/[0.06]" />
                <span className="text-[9px] font-normal uppercase tracking-[0.15em] text-[#b0a7a9]">
                  or with email
                </span>
                <span className="h-px flex-1 bg-black/[0.06]" />
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin ? (
                  <label className="block text-[11px] font-medium text-[#6e6466]">
                    Your name
                    <input
                      className={inputClassName}
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="How should we call you?"
                      required
                    />
                  </label>
                ) : null}

                <label className="block text-[11px] font-medium text-[#6e6466]">
                  Email address
                  <input
                    className={inputClassName}
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className="block text-[11px] font-medium text-[#6e6466]">
                  Password
                  <input
                    className={inputClassName}
                    type="password"
                    name="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    placeholder={isLogin ? "Your password" : "At least 8 characters"}
                    minLength={8}
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-[1rem] bg-[#aa7c80] px-5 py-4 text-[12px] font-medium text-white shadow-[0_12px_28px_rgba(124,86,90,0.16)] transition hover:-translate-y-0.5 hover:bg-[#956a6e]"
                >
                  {isLogin ? "Sign in" : "Create my account"}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </form>

              {!isLogin ? (
                <p className="mt-4 text-center text-[9px] font-normal leading-4 text-[#aaa1a3]">
                  By creating an account, you agree to care for your skin with
                  patience. Legal links will live here before launch.
                </p>
              ) : null}

              <p className="mt-7 text-center text-[11px] font-normal text-[#92888a]">
                {isLogin ? "New to BeautyMaker?" : "Already have an account?"}{" "}
                <Link
                  href={isLogin ? "/register" : "/login"}
                  className="font-medium text-[#9f7178] underline decoration-[#dcbcc4] underline-offset-4 transition hover:text-[#79545a]"
                >
                  {isLogin ? "Create an account" : "Sign in"}
                </Link>
              </p>
            </div>
          </section>

          <aside className="relative m-3 min-h-[30rem] overflow-hidden rounded-[1.7rem] border border-white/80 bg-gradient-to-br from-[#f4e5e1] via-[#f4eee9] to-[#e4ebf1] p-6 sm:m-5 sm:p-10 lg:ml-0 lg:min-h-0 xl:p-14">
            <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/65 bg-white/20" />
            <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-[#e9cfd9]/55 blur-[40px]" />

            <div className="relative flex h-full min-h-[27rem] flex-col justify-between">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <span className="text-[9px] font-medium uppercase tracking-[0.17em] text-[#a17d83]">
                    BeautyMaker note
                  </span>
                  <p className="mt-4 max-w-sm text-[clamp(1.55rem,2.6vw,2.8rem)] font-light leading-[1.18] tracking-[-0.045em] text-[#514748]">
                    {isLogin
                      ? "Your routine is waiting exactly where you left it."
                      : "You do not need a perfect routine to begin."}
                  </p>
                </div>
                <Sparkles className="shrink-0 text-[#bd8f9d]" size={19} />
              </div>

              <div className="relative mx-auto my-8 h-64 w-full max-w-[32rem]">
                <div className="absolute bottom-4 left-[8%] right-[5%] h-9 rounded-[50%] bg-[#c7aa9d]/25 blur-md" />
                <div className="absolute bottom-8 left-[10%] h-44 w-[29%] rounded-[2.8rem_2.8rem_1.5rem_1.5rem] border border-white/80 bg-gradient-to-b from-[#fffdfb] to-[#ddc9bf] shadow-[0_24px_45px_rgba(83,64,68,0.1)]">
                  <span className="absolute -top-8 left-1/2 h-10 w-11 -translate-x-1/2 rounded-t-xl bg-[#786364]" />
                </div>
                <div className="absolute bottom-8 right-[9%] h-36 w-[27%] rounded-[2.2rem_2.2rem_1.5rem_1.5rem] border border-white/80 bg-gradient-to-b from-[#c2939d] from-[22%] via-[#f8ece6] via-[23%] to-[#f4dfd4] shadow-[0_24px_45px_rgba(83,64,68,0.1)]" />

                <div className="absolute left-[26%] top-3 w-[59%] rounded-[1.35rem] border border-white/90 bg-[#fffdfb]/90 p-4 shadow-[0_18px_40px_rgba(83,64,68,0.1)] backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <CupcakeMascot className="h-12 w-11 shrink-0" decorative />
                    <div>
                      <span className="text-[8px] font-medium uppercase tracking-[0.14em] text-[#b37e8d]">
                        A gentle reminder
                      </span>
                      <p className="mt-1.5 text-[11px] font-normal leading-5 text-[#6e6264]">
                        We learn gently — one thoughtful change at a time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-3">
                {["Private by design", "No perfection pressure", "Your pace, always"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/45 px-3 py-3 text-[9px] font-medium text-[#796d6f] backdrop-blur-sm"
                    >
                      <Check size={12} className="shrink-0 text-[#ac7c86]" />
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
