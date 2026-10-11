"use client";

import {
  Check,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { CupcakeMascot } from "@/components/beauty-maker/cupcake-mascot";
import { storySteps } from "./static-data";
import { modes } from "./static-data";
import type { ModeKey } from "./static-data";
import { Navbar } from "./navbar";

const skinTones = ["#f3d8c9", "#e6bea2", "#c88c63", "#9d6242", "#68402f", "#38251f"];

function StoryPreviewPlaceholder({ step }: { step: number }) {
  return (
    <div className="relative aspect-[1.15/1] w-full overflow-hidden rounded-[2rem] border border-black/[0.06] bg-gradient-to-br from-[#f7eeea] via-[#fbf8f5] to-[#eee8f3] p-5 shadow-[0_24px_65px_rgba(74,57,65,0.08)] sm:p-8">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#ead2dd]/55 blur-[55px]" />
      <div className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-[#dfd6ec]/55 blur-[55px]" />

      <div className="relative flex h-full flex-col rounded-[1.5rem] border border-white/80 bg-[#fffdfb]/78 p-4 backdrop-blur-sm sm:p-6">
        <div className="flex items-center justify-between border-b border-black/[0.05] pb-4">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#d6afb4]" />
            <span className="h-2 w-2 rounded-full bg-[#dfd4e7]" />
            <span className="h-2 w-2 rounded-full bg-[#ddd7d2]" />
          </div>
          <span className="text-[9px] font-medium uppercase tracking-[0.17em] text-[#aa9da0]">Product screen · placeholder</span>
        </div>

        {step === 1 && (
          <div className="flex flex-1 flex-col justify-center">
            <div className="mx-auto w-full max-w-md">
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#b67d87]">Today&apos;s check-in</span>
              <h4 className="mt-3 text-xl font-light tracking-[-0.04em] text-[#3d3637] sm:text-2xl">What has your skin been telling you lately?</h4>
              <div className="mt-6 space-y-2.5">
                {[
                  "It feels a little dry",
                  "Something in my routine changed",
                  "I simply want to check in",
                ].map((label, index) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-white/70 px-4 py-3 text-[11px] font-normal text-[#756b6c]">
                    <span className={`h-3.5 w-3.5 rounded-full border ${index === 0 ? "border-[#b67d87] bg-[#ead0d5]" : "border-[#d9d1d0]"}`} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-md rounded-[1.4rem] border border-black/[0.06] bg-white/75 p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eee8f4] text-[#8e78a0]"><FlaskConical size={17} /></span>
                  <div>
                    <span className="block text-[9px] font-medium uppercase tracking-[0.12em] text-[#a79ba9]">Experiment 04</span>
                    <strong className="mt-1 block text-[12px] font-medium text-[#494143]">Lightweight mornings</strong>
                  </div>
                </div>
                <span className="rounded-full bg-[#f1edf5] px-3 py-1.5 text-[9px] font-medium text-[#8b759a]">14 days</span>
              </div>
              <div className="mt-7 grid grid-cols-[auto_1fr] gap-x-4 gap-y-5">
                {["Keep your cleanser", "Pause the heavier cream", "Check in after two weeks"].map((label, index) => (
                  <div key={label} className="contents">
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-[#c9bad2] text-[9px] text-[#8e78a0]">{index + 1}</span>
                    <div className="border-b border-black/[0.05] pb-4 text-[11px] font-normal text-[#756b6c] last:border-0">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-1 flex-col justify-center">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "3 months ago", color: "from-[#e7d6ce] to-[#cda99d]" },
                { label: "Today", color: "from-[#f2ddd8] to-[#d9b8bc]" },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.25rem] border border-white/85 bg-white/58 p-3">
                  <div className={`aspect-[1.1/1] rounded-[1rem] bg-gradient-to-br ${item.color}`} />
                  <span className="mt-3 block text-[9px] font-medium uppercase tracking-[0.1em] text-[#9e9293]">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-black/[0.05] bg-white/70 px-4 py-3">
              <span className="text-[10px] font-normal text-[#746a6b]">Visible dryness</span>
              <span className="text-[10px] font-medium text-[#ad777e]">Reduced</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<ModeKey>("puffy");
  const [submitted, setSubmitted] = useState(false);
  const active = modes[mode];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#fbf8f4] text-[#202022] selection:bg-[#f2cddd]"
      style={
        {
          "--accent": active.accent,
          "--soft": active.soft,
          "--glow": active.glow,
        } as React.CSSProperties
      }
    >
        <Navbar/>

      <section id="top" className="relative z-10 px-3 pb-16 sm:px-6">
        <div className="relative isolate mx-auto min-h-[calc(100vh-7rem)] w-full max-w-[1460px] overflow-visible rounded-[2.25rem]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.25rem] border border-black/[0.06] bg-[#fffdfb] shadow-[0_28px_90px_rgba(75,57,64,0.08)]">
            <div className="absolute -left-40 -top-52 h-[33rem] w-[33rem] rounded-full bg-[var(--soft)] blur-[90px] transition-colors duration-500" />
            <div className="absolute -bottom-44 right-8 h-[32rem] w-[32rem] rounded-full bg-[var(--glow)] blur-[100px] transition-colors duration-500" />
          </div>

          <div className="relative z-10 px-6 pb-14 pt-24 sm:pt-28 lg:px-16 lg:pb-16 lg:pt-28">

          <div className="relative grid items-center gap-14 lg:grid-cols-[0.87fr_1.13fr]">
            <div className="max-w-[39rem] lg:pl-2">
              <div className="mb-10 flex items-center gap-4">
                <span className="h-px w-10 bg-[#b98d8f]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#907678]">01 — Your skin story</span>
              </div>

              <h1 className="max-w-[12ch] text-[clamp(3rem,4.6vw,5.05rem)] font-normal leading-[1.04] tracking-[-0.06em] text-[#292425]">
                <span className="block">Skincare that</span>
                <span
                  className="mt-1 block font-serif font-normal italic tracking-[-0.045em] text-[#ad777e]"
                  style={{ fontFamily: '"Bodoni 72", Didot, "Times New Roman", serif' }}
                >
                  learns what works for you.
                </span>
              </h1>

              <div className="mt-9 max-w-[31rem] border-l border-[#d9babb] pl-5">
                <p className="text-[15px] font-normal leading-7 text-[#665c5d]">
                  One gentle experiment at a time.
                  <span className="mt-1 block text-[#887c7d]">BeautyMaker remembers how your skin responds, so your routine becomes truly yours.</span>
                </p>
              </div>

              <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <a
                  href="#join"
                  className="rounded-[0.85rem] border border-[#9e7376] bg-[#aa7c80] px-6 py-3.5 text-[12px] font-medium tracking-[0.01em] text-white shadow-[0_10px_24px_rgba(124,86,90,0.14)] transition hover:bg-[#956a6e] duration-200"
                >
                  Start your skin story&nbsp; ↗
                </a>
                <a href="#how" className="text-[12px] font-normal text-[#76696a] transition hover:text-[#332c2d]">How it works →</a>
              </div>

              <p
                className="mt-10 max-w-md font-serif text-[16px] font-normal italic leading-7 text-[#78696a]"
                style={{ fontFamily: '"Bodoni 72", Didot, "Times New Roman", serif' }}
              >
                “Your skin is not a problem to perfect.”
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-1" aria-label="Designed for a wide range of skin tones">
                  {skinTones.map((tone) => (
                    <span key={tone} className="h-4 w-4 rounded-full border-2 border-[#fffdfb] shadow-[0_0_0_1px_rgba(0,0,0,0.07)]" style={{ backgroundColor: tone }} />
                  ))}
                </div>
                <span className="text-[10px] font-normal tracking-[0.04em] text-[#9a8e8e]">Every skin has its own story</span>
              </div>
            </div>

            <div className="relative mx-auto min-h-[34rem] w-full max-w-[680px] py-5 sm:min-h-[36rem] lg:min-h-[38rem]">
              <div className="absolute inset-x-[4%] inset-y-[2%] rounded-[48%_48%_30%_30%] bg-gradient-to-br from-[#f4dedf] via-[#eee3dc] to-[#dfe8ea] opacity-75 blur-[42px]" />
              <div className="absolute inset-x-[10%] bottom-[4%] top-[8%] overflow-hidden rounded-[14rem_14rem_3rem_3rem] border border-white/75 bg-[#efe5de]/75 shadow-[0_35px_90px_rgba(96,69,72,0.11)] backdrop-blur-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,rgba(255,255,255,0.88),transparent_28%),linear-gradient(150deg,rgba(255,255,255,0.12),rgba(201,160,159,0.13))]" />
                <div className="absolute left-[16%] top-[17%] h-16 w-16 rounded-full border border-white/60 bg-white/20" />
                <div className="absolute right-[12%] top-[34%] h-7 w-7 rounded-full bg-[#d7bdad]/35" />
                <div className="absolute left-[8%] top-[48%] h-4 w-4 rounded-full bg-white/55" />
              </div>

              <div className="absolute bottom-[7%] left-[14%] right-[4%] h-[13%] rounded-[50%] bg-[#c8a99b]/24 blur-sm" />
              <div className="absolute bottom-[10%] left-[12%] right-[1%] h-8 rounded-[50%] border border-white/55 bg-[#eadcd3] shadow-[0_18px_34px_rgba(87,61,61,0.14)]" />

              <div className="absolute bottom-[13%] left-[23%] z-10 h-[61%] w-[27%] min-w-[8rem]">
                <div className="absolute left-1/2 top-0 h-[7%] w-[42%] -translate-x-1/2 rounded-t-lg bg-[#5f514e]" />
                <div className="absolute left-[43%] top-[-2%] h-[4%] w-[38%] rounded-full bg-[#5f514e]" />
                <div className="absolute left-1/2 top-[5%] h-[10%] w-[25%] -translate-x-1/2 rounded-sm bg-[#d3c1b7]" />
                <div className="absolute inset-x-0 bottom-0 top-[12%] overflow-hidden rounded-[2rem_2rem_1.5rem_1.5rem] border border-white/70 bg-gradient-to-br from-[#f6eee8] to-[#dac5b8] shadow-[inset_8px_8px_18px_rgba(255,255,255,0.65),0_24px_38px_rgba(82,58,57,0.2)]">
                  <div className="absolute inset-x-[12%] top-[36%] border-y border-[#796662]/20 py-4 text-center">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.24em] text-[#5e4d4c]">BeautyMaker</span>
                    <span className="mt-2 block text-[8px] font-medium uppercase tracking-[0.12em] text-[#8a7471]">Gentle barrier milk</span>
                    <span className="mt-3 block text-[8px] text-[#8a7471]">02 · hydrate</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[12%] right-[13%] z-20 h-[34%] w-[31%] min-w-[8.5rem]">
                <div className="absolute inset-x-0 top-0 h-[30%] rounded-[2rem_2rem_0.8rem_0.8rem] border border-white/55 bg-gradient-to-b from-[#b98d8f] to-[#9f7478] shadow-[inset_0_3px_5px_rgba(255,255,255,0.25)]" />
                <div className="absolute inset-x-0 bottom-0 top-[23%] overflow-hidden rounded-[1rem_1rem_2rem_2rem] border border-white/70 bg-gradient-to-br from-[#fffaf5] to-[#eadbd0] shadow-[inset_8px_8px_18px_rgba(255,255,255,0.7),0_23px_35px_rgba(82,58,57,0.18)]">
                  <div className="absolute inset-x-[11%] top-[38%] text-center">
                    <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-[#665252]">Daily Cloud</span>
                    <span className="mt-2 block text-[8px] font-medium text-[#917c78]">soft moisturizer</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[30%] left-[3%] z-30 w-[48%] rounded-[1.45rem] border border-black/[0.06] bg-[#fffdfb]/94 p-4 shadow-[0_20px_48px_rgba(77,56,61,0.13)] backdrop-blur-xl sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#a08384]">How you&apos;re doing ✦</span>
                    <p className="mt-2 text-[13px] font-bold leading-5 tracking-[-0.025em]">{active.message}</p>
                    <p className="mt-2 text-[11px] font-medium leading-4 text-zinc-500">Let&apos;s keep it steady for another week.</p>
                  </div>
                  <span className="mt-0.5 text-[var(--accent)]">{active.icon}</span>
                </div>
              </div>

              <div className="absolute right-[1%] top-[8%] z-30 flex max-w-[15rem] items-center gap-3 rounded-[1.4rem] border border-black/[0.06] bg-[#fffdfb]/92 p-3.5 shadow-[0_16px_42px_rgba(77,56,61,0.11)] backdrop-blur-xl sm:p-4">
                <CupcakeMascot className="h-14 w-12 shrink-0" />
                <div>
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.11em] text-[#a08384]">BeautyMaker says</span>
                  <p className="mt-1 text-[10px] font-semibold leading-4 text-zinc-600">We learn gently — one change at a time.</p>
                </div>
              </div>

              <div className="absolute bottom-[5%] right-[5%] z-30 flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/90 px-4 py-2.5 text-[10px] font-semibold text-zinc-600 shadow-md backdrop-blur">
                <FlaskConical size={13} className="text-[var(--accent)]" /> Experiment 04 · day 7
              </div>
            </div>
          </div>

          <div id="personality" className="relative mt-14 border-t border-black/[0.06] pt-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">Choose your conversation mode</span>
                <p className="mt-1 text-xs font-medium text-zinc-500">Same thoughtful care. A personality that feels like you.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:flex" role="group" aria-label="Choose conversation mode">
                {(Object.keys(modes) as ModeKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMode(key)}
                    aria-pressed={mode === key}
                    className={`rounded-full border px-4 py-2.5 text-[10px] font-semibold transition sm:text-[11px] ${
                      mode === key
                        ? "border-transparent bg-[#202022] text-white shadow-md"
                        : "border-black/[0.08] bg-white/65 text-zinc-500 hover:bg-white"
                    }`}
                  >
                    {modes[key].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto w-[92%] max-w-[1400px] py-28 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#b67d87]">A story that learns with your skin</p>
          <h2 className="mt-6 text-[clamp(2.7rem,4.7vw,5rem)] font-light leading-[1.06] tracking-[-0.055em]">
            Tiny changes.<br /><span className="font-light italic text-[#aaa0aa]">A clearer story.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-[15px] font-normal leading-7 text-[#8d8586]">A calmer way to understand what helps — with enough time, context and kindness to make every observation meaningful.</p>
        </div>

        <div className="mt-24 space-y-28 lg:mt-32 lg:space-y-40">
          {storySteps.map((step, index) => (
            <article key={step.number} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
              <div className={index % 2 === 1 ? "lg:order-2" : "lg:order-1"}>
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-[#d4bec5]" />
                  <span className={`text-[10px] font-medium uppercase tracking-[0.18em] ${step.accent}`}>Step {step.number}</span>
                </div>
                <p className="mt-8 text-[11px] font-normal uppercase tracking-[0.14em] text-[#aaa1a3]">{step.eyebrow}</p>
                <h3 className="mt-4 max-w-[14ch] text-[clamp(2.25rem,3.7vw,4.2rem)] font-light leading-[1.08] tracking-[-0.055em] text-[#494143]">{step.title}</h3>
                <p className="mt-7 max-w-lg text-[15px] font-normal leading-8 text-[#999092]">{step.text}</p>
                <p className={`mt-8 font-serif text-[17px] font-normal italic ${step.accent}`} style={{ fontFamily: '"Bodoni 72", Didot, "Times New Roman", serif' }}>{step.note}</p>
              </div>

              <div className={index % 2 === 1 ? "lg:order-1" : "lg:order-2"}>
                <StoryPreviewPlaceholder step={index + 1} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="care" className="mx-auto grid w-[94%] max-w-[1460px] gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <article className="relative min-h-[34rem] overflow-hidden rounded-[2.2rem] bg-[#202022] p-8 text-white sm:p-14 lg:p-20 hover:scale-[1.02] duration-200 cursor-default">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#f0cddd]/20 blur-[70px]" />
          <ShieldCheck size={27} strokeWidth={1.5} className="relative" />
          <div className="relative mt-28 max-w-2xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">Independent by design</span>
            <h2 className="mt-5 text-[clamp(2.5rem,4vw,4.2rem)] font-light leading-[1.06] tracking-[-0.055em]">Your skin comes before a brand.</h2>
            <p className="mt-6 max-w-xl text-[13px] font-medium leading-6 text-zinc-400">Sponsored never means ranked higher. And when you already have what you need, BeautyMaker will simply say: don&apos;t buy anything.</p>
          </div>
        </article>

        <article className="flex min-h-[34rem] flex-col rounded-[2.2rem] bg-gradient-to-br from-[#e4f1fa] to-[#f8e7ee] p-8 sm:p-14 hover:scale-[1.02] duration-200 cursor-default">
          <Stethoscope size={27} strokeWidth={1.5} />
          <div className="mt-auto">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">Health before experimentation</span>
            <h2 className="mt-5 text-[clamp(2.35rem,3.5vw,3.7rem)] font-light leading-[1.06] tracking-[-0.055em]">When skincare isn&apos;t the answer, we say so.</h2>
            <p className="mt-6 text-[13px] font-medium leading-6 text-zinc-600">If something looks concerning or several careful changes don&apos;t help, we stop and guide you toward professional care.</p>
          </div>
        </article>
      </section>

      <section id="join" className="relative mx-auto mt-4 flex min-h-[42rem] w-[94%] max-w-[1460px] flex-col items-center justify-center overflow-hidden rounded-[2.2rem] bg-[#fffdfb] px-6 py-24 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#f7deea] to-[#dceefe] opacity-80 blur-[90px]" />
        <div className="relative z-10 flex max-w-3xl flex-col items-center">
          <span className="grid h-20 w-20 place-items-center rounded-[1.5rem] bg-[#f8e7ee] shadow-sm"><CupcakeMascot className="h-16 w-14" /></span>
          <h2 className="mt-8 text-[clamp(2.9rem,5.4vw,5.8rem)] font-light leading-[1.02] tracking-[-0.06em]">
            Ready to learn what your skin <em className="font-light italic text-[#ad777e]">loves?</em>
          </h2>
          <p className="mt-7 max-w-xl text-[14px] font-medium leading-7 text-zinc-500 cursor-pointer">Join the early list and be among the first to build a routine around evidence from your own skin.</p>

          {submitted ? (
            <div className="mt-9 flex items-center gap-3 rounded-full border border-black/10 bg-white/80 px-6 py-4 text-[13px] font-semibold shadow-lg backdrop-blur"><Check size={18} /> You&apos;re on the list. Thank you.</div>
          ) : (
            <form onSubmit={submit} className="mt-9 flex w-full max-w-lg flex-col gap-2 rounded-[1.35rem] border border-black/[0.08] bg-white/75 p-2 shadow-[0_14px_38px_rgba(55,45,49,0.08)] backdrop-blur sm:flex-row sm:rounded-full">
              <label className="sr-only" htmlFor="email">Email address</label>
              <input id="email" type="email" required autoComplete="email" placeholder="you@example.com" className="min-h-12 flex-1 rounded-full bg-transparent px-5 text-[13px] font-medium outline-none placeholder:text-zinc-400" />
              <button type="submit" className="min-h-12 rounded-full bg-[#202022] px-6 text-[12px] font-semibold text-white transition hover:bg-zinc-700 cursor-pointer">Join the early list</button>
            </form>
          )}
          <p className="mt-3 text-[10px] font-medium text-zinc-400">No noise. Just thoughtful updates.</p>
        </div>
      </section>

      <footer className="mx-auto flex w-[92%] max-w-[1460px] flex-col gap-4 py-12 text-[11px] font-medium text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <a href="#top" className="text-lg font-bold tracking-[-0.06em] text-zinc-900">BeautyMaker<span className="ml-1 text-xs text-[var(--accent)]">✦</span></a>
        <p>BeautyMaker helps you care for your skin. It does not teach you to dislike your face.</p>
        <p>© 2026 BeautyMaker</p>
      </footer>
    </main>
  );
}

