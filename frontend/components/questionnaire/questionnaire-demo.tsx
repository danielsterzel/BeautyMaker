"use client";

import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { CupcakeMascot } from "@/components/beauty-maker/cupcake-mascot";
import {
  AfterCleansingAnswer,
  ApproachAnswer,
  ConversationModeAnswer,
  CurrentRoutineAnswer,
  DermatologistAdviceAnswer,
  LovedProductsAnswer,
  MiddleOfTheDayAnswer,
  ReactiveSkinAnswer,
  SkinConcernAnswer,
} from "./answer-enums";
import { MultiChoice, SingleChoice, TextAnswer } from "./answer-controls";
import { QuestionVisual } from "./question-visual";
import { QuestionnaireShell } from "./questionnaire-shell";
import type { ChoiceOption, QuestionDefinition } from "./types";

const questions: QuestionDefinition[] = [
  { id: "q1", question: "How does your skin usually feel after cleansing?", supportingText: "Think about the first 10–15 minutes, before applying anything else.", thinkingLabel: "understanding your post-cleanse feel", visual: "flower", tone: "cream" },
  { id: "q2", question: "How does your skin usually feel by the middle of the day?", supportingText: "There is no ideal answer — we are simply noticing your skin’s natural rhythm.", thinkingLabel: "learning your skin’s daily rhythm", visual: "cream", tone: "powder" },
  { id: "q3", question: "What would you most like to improve right now?", supportingText: "Choose everything that feels relevant. We will help you prioritize gently.", thinkingLabel: "mapping what matters to you", visual: "sparkles", tone: "lavender" },
  { id: "q4", question: "Does your skin tend to react easily to new products?", supportingText: "This helps us understand how slowly and carefully to introduce change.", thinkingLabel: "understanding your skin’s sensitivity", visual: "drop", tone: "blush" },
  { id: "q5", question: "What does your current routine look like?", supportingText: "Select everything you use regularly — even if it is not every single day.", thinkingLabel: "getting to know your current routine", visual: "routine", tone: "peach" },
  { id: "q6", question: "Are there products your skin already loves?", supportingText: "A trusted favorite tells us a lot about textures and ingredients that may suit you.", thinkingLabel: "noticing your skin’s favorites", visual: "heart", tone: "blush" },
  { id: "q7", question: "Anything your skin definitely doesn’t like?", supportingText: "Products, ingredients, textures or past experiences — share only what you remember.", thinkingLabel: "learning what your skin prefers to avoid", visual: "shield", tone: "lavender" },
  { id: "q8", question: "Are you following any skincare advice from a dermatologist?", supportingText: "Professional guidance always comes first. You can add as much or as little detail as you wish.", thinkingLabel: "making space for professional advice", visual: "doctor", tone: "powder" },
  { id: "q9", question: "How would you like BeautyMaker to approach your routine?", supportingText: "We will shape future suggestions around the amount of change that feels comfortable to you.", thinkingLabel: "understanding your routine preferences", visual: "path", tone: "cream" },
  { id: "q10", question: "And finally — how should BeautyMaker talk to you?", supportingText: "The care stays thoughtful. You choose the personality.", thinkingLabel: "finding a voice that feels like you", visual: "conversation", tone: "blush" },
];

const standardOptions: Record<string, ChoiceOption[]> = {
  q1: [
    { value: AfterCleansingAnswer.TIGHT_OR_UNCOMFORTABLE, label: "Tight or uncomfortable" },
    { value: AfterCleansingAnswer.BALANCED, label: "Comfortable and balanced" },
    { value: AfterCleansingAnswer.DRY_AFTER_A_WHILE, label: "Comfortable at first, then dry" },
    { value: AfterCleansingAnswer.OILY_QUICKLY, label: "Oily or shiny quite quickly" },
    { value: AfterCleansingAnswer.NOT_SURE, label: "I’m not really sure yet" },
  ],
  q2: [
    { value: MiddleOfTheDayAnswer.BALANCED, label: "Mostly balanced" },
    { value: MiddleOfTheDayAnswer.SHINY_T_ZONE, label: "A little shiny around my T-zone" },
    { value: MiddleOfTheDayAnswer.OILY_ALL_OVER, label: "Oily or shiny all over" },
    { value: MiddleOfTheDayAnswer.DRY_OR_TIGHT, label: "Dry, tight or uncomfortable" },
    { value: MiddleOfTheDayAnswer.VARIES, label: "It changes from day to day" },
    { value: MiddleOfTheDayAnswer.NOT_SURE, label: "I’m not really sure yet" },
  ],
  q4: [
    { value: ReactiveSkinAnswer.RARELY, label: "Rarely", description: "My skin usually adapts easily" },
    { value: ReactiveSkinAnswer.SOMETIMES, label: "Sometimes", description: "Certain products cause a reaction" },
    { value: ReactiveSkinAnswer.OFTEN, label: "Often", description: "I introduce new things carefully" },
    { value: ReactiveSkinAnswer.VERY_EASILY, label: "Very easily", description: "My skin can be highly reactive" },
  ],
  q9: [
    { value: ApproachAnswer.MINIMAL, label: "Keep it minimal", description: "Fewer products and only essential changes" },
    { value: ApproachAnswer.EXPERIMENT, label: "I’m happy to experiment", description: "Thoughtful trials, one at a time" },
    { value: ApproachAnswer.ADVANCED, label: "I don’t mind a few more steps", description: "A more involved routine is okay with me" },
  ],
  q10: [
    { value: ConversationModeAnswer.SOFT, label: "Soft & dreamy 🌸", description: "Warm, encouraging and a little fluffy" },
    { value: ConversationModeAnswer.CLEAN, label: "Clean & elegant", description: "Polished, calm and understated" },
    { value: ConversationModeAnswer.DIRECT, label: "Direct & pragmatic", description: "Honest, casual and straight to the point" },
    { value: ConversationModeAnswer.CLINICAL, label: "Clinical & concise", description: "Clear, structured and matter-of-fact" },
  ],
};

const concernOptions: ChoiceOption[] = [
  { value: SkinConcernAnswer.DRYNESS, label: "Dryness" },
  { value: SkinConcernAnswer.BREAKOUTS, label: "Breakouts" },
  { value: SkinConcernAnswer.CLOGGED_PORES, label: "Clogged pores" },
  { value: SkinConcernAnswer.REDNESS, label: "Redness" },
  { value: SkinConcernAnswer.TEXTURE, label: "Texture" },
  { value: SkinConcernAnswer.UNEVEN_TONE, label: "Uneven tone" },
  { value: SkinConcernAnswer.SENSITIVITY, label: "Sensitivity" },
];

const routineOptions: ChoiceOption[] = [
  { value: CurrentRoutineAnswer.CLEANSER, label: "Cleanser", description: "Gel, milk, balm or oil" },
  { value: CurrentRoutineAnswer.MOISTURIZER, label: "Moisturizer", description: "Cream, lotion or gel" },
  { value: CurrentRoutineAnswer.SPF, label: "SPF", description: "Daily sun protection" },
  { value: CurrentRoutineAnswer.SERUM, label: "Serum", description: "Hydrating or active" },
  { value: CurrentRoutineAnswer.RETINOID, label: "Retinoid", description: "Retinol or prescription" },
  { value: CurrentRoutineAnswer.EXFOLIANT, label: "Exfoliant", description: "AHA, BHA or enzyme" },
  { value: CurrentRoutineAnswer.ELSE, label: "Something else", description: "Mist, toner, oil or treatment" },
];

type Answers = Record<string, string | string[]>;

export function QuestionnaireDemo() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const isComplete = step === questions.length;
  const question = questions[Math.min(step, questions.length - 1)];

  function setSingle(id: string, value: string) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  function setMultiple(id: string, values: string[]) {
    setAnswers((current) => ({ ...current, [id]: values }));
  }

  function stringAnswer(id: string) {
    return typeof answers[id] === "string" ? answers[id] as string : "";
  }

  function arrayAnswer(id: string) {
    return Array.isArray(answers[id]) ? answers[id] as string[] : [];
  }

  function renderAnswer() {
    if (question.id === "q3") {
      return <MultiChoice options={concernOptions} values={arrayAnswer("q3")} onChange={(values) => setMultiple("q3", values)} columns={4} />;
    }

    if (question.id === "q5") {
      return <MultiChoice options={routineOptions} values={arrayAnswer("q5")} onChange={(values) => setMultiple("q5", values)} columns={4} />;
    }

    if (question.id === "q6") {
      return (
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <SingleChoice
            options={[{ value: LovedProductsAnswer.YES, label: "Yes — I’ll add them" }, { value: LovedProductsAnswer.NOT_REALLY, label: "Not really yet" }]}
            value={stringAnswer("q6")}
            onChange={(value) => setSingle("q6", value)}
          />
          {stringAnswer("q6") === LovedProductsAnswer.YES ? (
            <TextAnswer value={stringAnswer("q6-products")} onChange={(value) => setSingle("q6-products", value)} placeholder="Search for a product or type its name…" />
          ) : null}
        </div>
      );
    }

    if (question.id === "q7") {
      return (
        <div className="mx-auto w-full max-w-3xl">
          <TextAnswer value={stringAnswer("q7")} onChange={(value) => setSingle("q7", value)} placeholder="For example: heavy creams, fragrance, a product that caused irritation…" multiline />
          <p className="mt-3 text-center text-[10px] font-normal text-[#aaa1a3]">It’s completely okay to leave this blank.</p>
        </div>
      );
    }

    if (question.id === "q8") {
      return (
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <SingleChoice options={[{ value: DermatologistAdviceAnswer.YES, label: "Yes" }, { value: DermatologistAdviceAnswer.NO, label: "No" }]} value={stringAnswer("q8")} onChange={(value) => setSingle("q8", value)} />
          {stringAnswer("q8") === DermatologistAdviceAnswer.YES ? (
            <TextAnswer value={stringAnswer("q8-advice")} onChange={(value) => setSingle("q8-advice", value)} placeholder="Optionally add the diagnosis, advice or products your dermatologist recommended…" multiline />
          ) : null}
        </div>
      );
    }

    return <SingleChoice options={standardOptions[question.id]} value={stringAnswer(question.id)} onChange={(value) => setSingle(question.id, value)} />;
  }

  if (isComplete) {
    return (
      <QuestionnaireShell answeredCount={10} totalQuestions={10} thinkingLabel="your first skin story is ready">
        <section className="flex flex-1 flex-col items-center justify-center px-5 py-14 text-center sm:px-8">
          <CupcakeMascot className="h-24 w-20" />
          <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.18em] text-[#b67d87]">Your starting point</p>
          <h1 className="mt-5 max-w-3xl text-[clamp(2.8rem,5vw,5.4rem)] font-light leading-[1.04] tracking-[-0.06em] text-[#433b3c]">
            Your skin story has <em className="font-light italic text-[#ad777e]">somewhere gentle to begin.</em>
          </h1>
          <p className="mt-7 max-w-xl text-[14px] font-normal leading-7 text-[#968d8f]">We&apos;ll use your answers to keep recommendations thoughtful, explainable and comfortably paced.</p>

          <div className="mt-10 grid w-full max-w-3xl gap-3 text-left sm:grid-cols-3">
            {[
              { label: "Routine approach", value: stringAnswer("q9") || "Your choice" },
              { label: "Conversation mode", value: stringAnswer("q10") || "Your choice" },
              { label: "First principle", value: "One change at a time" },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.2rem] border border-black/[0.055] bg-white/65 p-4">
                <span className="text-[9px] font-normal uppercase tracking-[0.12em] text-[#aaa1a3]">{item.label}</span>
                <strong className="mt-2 block text-[12px] font-normal capitalize text-[#5c5355]">{item.value}</strong>
              </div>
            ))}
          </div>

          <button type="button" className="mt-10 rounded-[0.9rem] bg-[#aa7c80] px-7 py-4 text-[12px] font-medium text-white shadow-[0_12px_28px_rgba(124,86,90,0.15)] transition hover:-translate-y-0.5 hover:bg-[#956a6e]">
            Save my skin story
          </button>
          <p className="mt-3 text-[10px] font-normal text-[#aaa1a3]">Account creation will be connected here later.</p>
        </section>
      </QuestionnaireShell>
    );
  }

  return (
    <QuestionnaireShell answeredCount={step} totalQuestions={10} thinkingLabel={question.thinkingLabel}>
      <section className="flex flex-1 flex-col px-5 py-10 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center text-center">
          <QuestionVisual visual={question.visual} tone={question.tone} />
          <span className="mt-5 text-[9px] font-medium uppercase tracking-[0.18em] text-[#b4abad]">Question {step + 1} of 10</span>
          <h1 className="mt-4 max-w-4xl text-[clamp(2rem,3.8vw,4rem)] font-light leading-[1.08] tracking-[-0.055em] text-[#484041]">{question.question}</h1>
          {question.supportingText ? <p className="mt-4 max-w-2xl text-[12px] font-normal leading-6 text-[#9d9496]">{question.supportingText}</p> : null}
          <div className="mt-8 w-full">{renderAnswer()}</div>
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-5xl items-center justify-between border-t border-black/[0.05] pt-5">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            disabled={step === 0}
            className="flex cursor-pointer items-center gap-2 px-2 py-2 text-[11px] font-normal text-[#8f8587] transition hover:text-[#4c4445] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={15} /> Back
          </button>
          <span className="hidden items-center gap-2 text-[9px] font-normal text-[#b0a7a9] sm:flex"><Sparkles size={12} /> There are no wrong answers.</span>
          <button
            type="button"
            onClick={() => setStep((current) => Math.min(questions.length, current + 1))}
            className="flex cursor-pointer items-center gap-2 rounded-[0.8rem] bg-[#4a4243] px-5 py-3 text-[11px] font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#655a5c]"
          >
            {step === questions.length - 1 ? "See my skin story" : "Continue"} <ChevronRight size={14} />
          </button>
        </div>
      </section>
    </QuestionnaireShell>
  );
}
