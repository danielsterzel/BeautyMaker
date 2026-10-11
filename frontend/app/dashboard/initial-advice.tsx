"use client";

import { streamAnalysis } from "@/lib/api/analysis";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  FlaskConical,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Allow, parse } from "partial-json";

type SkinAnalysis = {
  concerns: string[];
  shortAnalysis: string;
  fullAnalysis: string;
};

function AnalysisActions() {
  return (
    <div
      className="beautymaker-report-reveal mt-6 border-t border-[#e7e1e2] pt-6"
      style={{ animationDelay: "420ms" }}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e8f5fb] text-[#579fc5]">
          <MessageCircle size={15} strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="text-lg font-medium tracking-[-0.035em] text-[#3f3839]">
            Want to change something?
          </h2>
          <p className="mt-1 text-[12px] leading-5 text-[#817677]">
            Tell BeautyMaker what doesn’t feel right, or ask about another
            ingredient.
          </p>
        </div>
      </div>

      <textarea
        rows={2}
        placeholder="I’d prefer something gentler…"
        className="mt-4 w-full resize-none rounded-[1rem] border border-[#ddd3d5] bg-[#fbf8f6] px-4 py-3 text-[13px] text-[#40393a] outline-none transition placeholder:text-[#a79d9f] focus:border-[#8bbcd4] focus:bg-white focus:ring-4 focus:ring-[#68a9ce]/10"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="group flex items-center gap-3 rounded-[1rem] border border-[#e3dcdd] bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-[#cddfe8] hover:shadow-[0_12px_30px_rgba(68,117,143,0.08)]"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#f5ebee] text-[#a46f78]">
            <Bookmark size={15} strokeWidth={1.8} />
          </span>
          <span>
            <span className="block text-[11px] font-semibold text-[#4a4243]">
              Save analysis
            </span>
            <span className="mt-0.5 block text-[10px] text-[#978c8e]">
              Keep it in your timeline
            </span>
          </span>
        </button>

        <button
          type="button"
          className="group flex items-center gap-3 rounded-[1rem] border border-[#e3dcdd] bg-white px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-[#d9d5e3] hover:shadow-[0_12px_30px_rgba(88,75,105,0.08)]"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#eceaf3] text-[#7e7290]">
            <FlaskConical size={15} strokeWidth={1.8} />
          </span>
          <span>
            <span className="block text-[11px] font-semibold text-[#4a4243]">
              Start experiment
            </span>
            <span className="mt-0.5 block text-[10px] text-[#978c8e]">
              Turn advice into a routine
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

export function InitialAdvice() {
  const [analysis, setAnalysis] = useState<Partial<SkinAnalysis>>({});

  const analysisMutation = useMutation({
    mutationFn: () => {
      let buffer = "";

      return streamAnalysis((chunk) => {
        buffer += chunk;

        try {
          const parsed = parse(buffer, Allow.ALL) as Partial<SkinAnalysis>;
          setAnalysis(parsed);
        } catch {
          // next json fragment
        }
      });
    },
  });

  const analysisComplete =
    analysisMutation.isSuccess && Boolean(analysis.fullAnalysis);

  return (
    <main className="min-h-screen bg-white px-5 py-6 text-[#332e2f] sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col sm:min-h-[calc(100vh-4rem)]">
        <header className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#8a7f81] transition-colors hover:text-[#3f3738]"
          >
            <ArrowLeft size={15} /> Back to dashboard
          </Link>
          <span className="text-lg font-bold tracking-[-0.055em] text-[#2d2829]">
            BeautyMaker<span className="ml-1 text-xs text-[#68a9ce]">✦</span>
          </span>
        </header>

        <section
          className={`flex flex-1 flex-col items-center text-center ${analysisComplete ? "pt-8 sm:pt-10" : "pt-16 sm:pt-24"}`}
        >
          <div
            className={`relative grid place-items-center ${analysisComplete ? "h-20 w-20" : "h-28 w-28"}`}
          >
            <svg
              viewBox="0 0 112 112"
              className={`absolute inset-0 h-full w-full ${
                analysisMutation.isPending ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "1.6s" }}
              aria-hidden="true"
            >
              <circle
                cx="56"
                cy="56"
                r="48"
                fill="none"
                stroke="#eee9eb"
                strokeWidth="8"
              />
              {analysisMutation.isPending && (
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="#68a9ce"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="92 302"
                />
              )}
            </svg>
            <span
              className={`grid place-items-center rounded-full bg-[#e8f5fb] text-[#68a9ce] ${analysisComplete ? "h-11 w-11" : "h-14 w-14"}`}
            >
              <Sparkles
                size={analysisComplete ? 19 : 23}
                strokeWidth={1.8}
              />
            </span>
          </div>

          {analysisComplete ? (
            <div className="mt-5 w-full max-w-3xl text-left">
              <div className="beautymaker-report-reveal">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8a7f81]">
                  Your personal skin report
                </p>
                <h1 className="mt-2 text-[clamp(1.9rem,4vw,3rem)] font-light leading-none tracking-[-0.055em]">
                  Your skin, understood
                  <span className="ml-2 text-[#68a9ce]">✦</span>
                </h1>
              </div>
              <p
                className="beautymaker-report-reveal mt-3 max-w-2xl text-[12px] leading-5 text-[#776d6e]"
                style={{ animationDelay: "130ms" }}
              >
                {analysis.shortAnalysis ??
                  "Your personalized analysis is complete. Here’s what we can work on together."}
              </p>
              {analysis.concerns?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.concerns.map((concern, index) => (
                    <span
                      key={concern}
                      className="beautymaker-report-reveal inline-flex items-center gap-2 rounded-full border border-[#d7e8f0] bg-[#f3f9fc] px-3 py-1.5 text-[10px] font-semibold text-[#527b90] shadow-[0_7px_18px_rgba(87,159,197,0.08)]"
                      style={{ animationDelay: `${230 + index * 70}ms` }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-[#68a9ce] shadow-[0_0_0_3px_rgba(104,169,206,0.12)]"
                        aria-hidden="true"
                      />
                      {concern}
                    </span>
                  ))}
                </div>
              ) : null}
              <AnalysisActions />
            </div>
          ) : (
            <>
              <h1 className="mt-8 text-[clamp(2rem,4vw,3.2rem)] font-light tracking-[-0.05em]">
                Analyzing your skin…
              </h1>
              <p className="mt-3 text-[13px] text-[#8b8182] sm:text-[14px]">
                Creating your personalized skincare recommendations
              </p>
            </>
          )}

          {!analysisComplete ? (
            <button
              type="button"
              onClick={() => analysisMutation.mutate()}
              className="group mt-8 inline-flex cursor-pointer items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#6eb6d8] to-[#579fc5] px-7 py-3.5 text-[12px] font-semibold text-white shadow-[0_14px_32px_rgba(87,159,197,0.28)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(87,159,197,0.34)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#68a9ce] focus-visible:ring-offset-4"
            >
              <Sparkles size={16} aria-hidden="true" />
              <span>Begin analysis</span>
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          ) : null}

          {!analysisComplete ? (
            <div className="mt-10 h-1.5 w-full max-w-3xl overflow-hidden rounded-full bg-[#eaf3f7]">
              <div className="h-full w-2/5 animate-pulse rounded-full bg-gradient-to-r from-[#a9d9ef] to-[#68a9ce]" />
            </div>
          ) : null}

          <div
            className={`w-full max-w-3xl text-left ${analysisComplete ? "mt-12 border-t border-[#e7e1e2] pt-10" : "mt-10"}`}
            aria-live="polite"
          >
            {analysisComplete ? (
              <h2 className="mb-7 text-2xl font-medium tracking-[-0.04em] text-[#3f3839]">
                Your personalized recommendations
              </h2>
            ) : null}
            <div className="prose prose-sm w-full max-w-none min-w-0 text-left">
              {analysis.fullAnalysis ? (
                <ReactMarkdown>{analysis.fullAnalysis}</ReactMarkdown>
              ) : (
                <p className="animate-pulse text-center text-xs text-[#a69c9e]">
                  Here will be your analysis 😊
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
