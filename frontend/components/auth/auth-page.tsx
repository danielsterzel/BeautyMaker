"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MailCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { CupcakeMascot } from "@/components/beauty-maker/cupcake-mascot";
import { questionnaireAnswersSchema } from "@/components/questionnaire";
import {
  type LoginInput,
  type RegisterInput,
  loginFormSchema,
  registerFormSchema,
} from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import {
  useLoginMutation,
  useRegisterMutation,
  useResendEmailMutation,
} from "@/lib/hooks/use-auth";
import { useSaveQuestionnaireMutation } from "@/lib/hooks/use-questionnaire";
import { useQuestionnaireStore } from "@/lib/storage";

type AuthPageProps = {
  mode: "login" | "register";
};

const inputClassName =
  "mt-2 w-full rounded-[1rem] border border-black/[0.075] bg-white/75 px-4 py-3.5 text-[13px] font-normal text-[#4e4647] outline-none transition placeholder:text-[#bbb2b3] hover:border-[#d9c4ca] focus:border-[#bd929d] focus:bg-white focus:ring-4 focus:ring-[#ead9df]/45";

const errorClassName = "mt-1.5 block text-[10px] font-medium text-[#a85f69]";

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    if (error.status === 401) return "The email or password is incorrect.";
    if (error.status === 409) return "An account with this email already exists.";
    if (error.status === 403 && typeof error.detail === "string") {
      return error.detail;
    }
    if (error.status === 422) return "Check the entered details and try again.";
  }

  return fallback;
}

function LoginForm() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const saveQuestionnaireMutation = useSaveQuestionnaireMutation();
  const resendMutation = useResendEmailMutation();
  const answers = useQuestionnaireStore((store) => store.answers);
  const clearAnswers = useQuestionnaireStore((store) => store.clear);
  const [formError, setFormError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setResendMessage(null);
    setUnverifiedEmail(null);

    try {
      const response = await loginMutation.mutateAsync(values);
      const pendingQuestionnaire = questionnaireAnswersSchema.safeParse(answers);

      if (response.user.questionnaire !== null) {
        if (Object.keys(answers).length > 0) clearAnswers();
      } else if (pendingQuestionnaire.success) {
        try {
          await saveQuestionnaireMutation.mutateAsync(pendingQuestionnaire.data);
          clearAnswers();
        } catch (error) {
          setFormError(
            errorMessage(
              error,
              "You are signed in, but we could not save your skin story. Your answers are still safe in this browser.",
            ),
          );
          return;
        }
      }

      router.replace("/dashboard");
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 403 &&
        error.detail === "Email is not verified"
      ) {
        setUnverifiedEmail(values.email);
      }
      setFormError(errorMessage(error, "We could not sign you in. Try again."));
    }
  });

  async function resendVerification() {
    if (!unverifiedEmail) return;
    setResendMessage(null);

    try {
      await resendMutation.mutateAsync({ email: unverifiedEmail });
      setResendMessage(
        "If the account still needs verification, a new link has been sent.",
      );
    } catch (error) {
      setResendMessage(
        errorMessage(error, "We could not send a new link. Try again shortly."),
      );
    }
  }

  const isPending = loginMutation.isPending || saveQuestionnaireMutation.isPending;

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <label className="block text-[11px] font-medium text-[#6e6466]">
        Email address
        <input
          className={inputClassName}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? <span className={errorClassName}>{errors.email.message}</span> : null}
      </label>

      <label className="block text-[11px] font-medium text-[#6e6466]">
        Password
        <input
          className={inputClassName}
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password ? (
          <span className={errorClassName}>{errors.password.message}</span>
        ) : null}
      </label>

      {formError ? (
        <div
          className="rounded-[1rem] border border-[#e7c9cc] bg-[#fbf1f1] px-4 py-3 text-[11px] leading-5 text-[#8e5960]"
          role="alert"
        >
          {formError}
          {unverifiedEmail ? (
            <button
              type="button"
              onClick={resendVerification}
              disabled={resendMutation.isPending}
              className="mt-2 flex cursor-pointer items-center gap-2 font-semibold text-[#925f67] underline decoration-[#dcbcc4] underline-offset-4 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw size={12} className={resendMutation.isPending ? "animate-spin" : ""} />
              Send a new verification link
            </button>
          ) : null}
        </div>
      ) : null}

      {resendMessage ? (
        <p className="rounded-[1rem] border border-[#d6e4d9] bg-[#f1f7f2] px-4 py-3 text-[11px] leading-5 text-[#607864]" aria-live="polite">
          {resendMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-[1rem] bg-[#aa7c80] px-5 py-4 text-[12px] font-medium text-white shadow-[0_12px_28px_rgba(124,86,90,0.16)] transition hover:-translate-y-0.5 hover:bg-[#956a6e] disabled:cursor-wait disabled:opacity-65"
      >
        {isPending
          ? saveQuestionnaireMutation.isPending
            ? "Saving your skin story…"
            : "Signing in…"
          : "Sign in"}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}

function RegisterForm() {
  const registerMutation = useRegisterMutation();
  const resendMutation = useResendEmailMutation();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { displayName: "", email: "", password: "" },
  });

  const onSubmit = handleSubmit(
    async (values) => {
      setFormError(null);
      try {
        await registerMutation.mutateAsync(values);
        setRegisteredEmail(values.email);
      } catch (error) {
        setFormError(
          errorMessage(error, "We could not create your account. Try again."),
        );
      }
    },
    () => {
      setFormError(
        "Please complete the highlighted fields before creating your account.",
      );
    },
  );

  async function resendVerification() {
    if (!registeredEmail) return;
    setResendMessage(null);
    try {
      await resendMutation.mutateAsync({ email: registeredEmail });
      setResendMessage("A fresh link is on its way if your account still needs it.");
    } catch (error) {
      setResendMessage(
        errorMessage(error, "We could not send a new link. Try again shortly."),
      );
    }
  }

  if (registeredEmail) {
    return (
      <div className="rounded-[1.4rem] border border-[#d9e5dc] bg-[#f4f8f4] p-6 text-[#5d6e61]" aria-live="polite">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#6f8e77]">
            <MailCheck size={20} />
          </span>
          <div>
            <p className="text-[12px] font-semibold">Check your inbox</p>
            <p className="mt-1 break-all text-[10px] text-[#78827a]">{registeredEmail}</p>
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-5">
          We sent a verification link. Your questionnaire answers will stay in this browser until you confirm your email and sign in.
        </p>
        <button
          type="button"
          onClick={resendVerification}
          disabled={resendMutation.isPending}
          className="mt-5 flex cursor-pointer items-center gap-2 text-[11px] font-semibold text-[#7c6569] underline decoration-[#dcbcc4] underline-offset-4 disabled:cursor-wait disabled:opacity-60"
        >
          <RefreshCw size={12} className={resendMutation.isPending ? "animate-spin" : ""} />
          Resend verification email
        </button>
        {resendMessage ? <p className="mt-3 text-[10px] leading-5">{resendMessage}</p> : null}
        <Link
          href="/login"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[1rem] bg-[#aa7c80] px-5 py-4 text-[12px] font-medium text-white transition hover:bg-[#956a6e]"
        >
          Continue to sign in <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <label className="block text-[11px] font-medium text-[#6e6466]">
        Your name
        <input
          className={inputClassName}
          type="text"
          autoComplete="name"
          placeholder="How should we call you?"
          aria-invalid={Boolean(errors.displayName)}
          {...register("displayName")}
        />
        {errors.displayName ? <span className={errorClassName}>{errors.displayName.message}</span> : null}
      </label>

      <label className="block text-[11px] font-medium text-[#6e6466]">
        Email address
        <input
          className={inputClassName}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        {errors.email ? <span className={errorClassName}>{errors.email.message}</span> : null}
      </label>

      <label className="block text-[11px] font-medium text-[#6e6466]">
        Password
        <input
          className={inputClassName}
          type="password"
          autoComplete="new-password"
          placeholder="At least 12 characters"
          aria-invalid={Boolean(errors.password)}
          {...register("password")}
        />
        {errors.password ? <span className={errorClassName}>{errors.password.message}</span> : null}
      </label>

      {formError ? (
        <p className="rounded-[1rem] border border-[#e7c9cc] bg-[#fbf1f1] px-4 py-3 text-[11px] leading-5 text-[#8e5960]" role="alert">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-[1rem] bg-[#aa7c80] px-5 py-4 text-[12px] font-medium text-white shadow-[0_12px_28px_rgba(124,86,90,0.16)] transition hover:-translate-y-0.5 hover:bg-[#956a6e] disabled:cursor-wait disabled:opacity-65"
      >
        {registerMutation.isPending ? "Creating your account…" : "Create my account"}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </button>

      <p className="text-center text-[9px] font-normal leading-4 text-[#aaa1a3]">
        By creating an account, you agree to care for your skin with patience. Legal links will live here before launch.
      </p>
    </form>
  );
}

export function AuthPage({ mode }: AuthPageProps) {
  const isLogin = mode === "login";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f1ed] px-3 py-3 text-[#342e2f] selection:bg-[#f0ccd9] sm:px-5 sm:py-5">
      <div className="pointer-events-none absolute -left-44 top-0 h-[30rem] w-[30rem] rounded-full bg-[#f0dce5]/70 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#dce9f2]/65 blur-[110px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-black/[0.055] bg-[#fffdfb] shadow-[0_28px_90px_rgba(72,57,62,0.08)] sm:min-h-[calc(100vh-2.5rem)]">
        <header className="relative z-20 flex min-h-20 items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="text-lg font-bold tracking-[-0.06em]" aria-label="BeautyMaker home">
            BeautyMaker<span className="ml-1 align-top text-xs text-[#c986a2]">✦</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-[11px] font-normal text-[#8d8385] transition hover:text-[#4c4445]">
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
                {isLogin ? "Continue your" : "Make space for your"}
                <em className="mt-1 block font-light italic text-[#ad777e]">skin story.</em>
              </h1>
              <p className="mt-6 max-w-md text-[13px] font-normal leading-6 text-[#8f8587]">
                {isLogin
                  ? "Return to your observations, experiments and the routine that is becoming truly yours."
                  : "Create your account so BeautyMaker can remember what your skin loves — gently, over time."}
              </p>

              <button type="button" className="mt-8 flex w-full cursor-pointer items-center justify-center gap-3 rounded-[1rem] border border-black/[0.075] bg-white px-4 py-3.5 text-[12px] font-medium text-[#51494a] shadow-[0_8px_24px_rgba(76,58,64,0.04)] transition hover:-translate-y-0.5 hover:border-[#d6bdc5]">
                <span className="grid h-5 w-5 place-items-center rounded-full border border-black/[0.08] bg-[#fffdfb] text-[11px] font-semibold">G</span>
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-4" aria-hidden="true">
                <span className="h-px flex-1 bg-black/[0.06]" />
                <span className="text-[9px] font-normal uppercase tracking-[0.15em] text-[#b0a7a9]">or with email</span>
                <span className="h-px flex-1 bg-black/[0.06]" />
              </div>

              {isLogin ? <LoginForm /> : <RegisterForm />}

              <p className="mt-7 text-center text-[11px] font-normal text-[#92888a]">
                {isLogin ? "New to BeautyMaker?" : "Already have an account?"}{" "}
                <Link href={isLogin ? "/register" : "/login"} className="font-medium text-[#9f7178] underline decoration-[#dcbcc4] underline-offset-4 transition hover:text-[#79545a]">
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
                  <span className="text-[9px] font-medium uppercase tracking-[0.17em] text-[#a17d83]">BeautyMaker note</span>
                  <p className="mt-4 max-w-sm text-[clamp(1.55rem,2.6vw,2.8rem)] font-light leading-[1.18] tracking-[-0.045em] text-[#514748]">
                    {isLogin ? "Your routine is waiting exactly where you left it." : "You do not need a perfect routine to begin."}
                  </p>
                </div>
                <Sparkles className="shrink-0 text-[#bd8f9d]" size={19} />
              </div>

              <div className="relative mx-auto my-8 h-64 w-full max-w-[32rem]">
                <div className="absolute bottom-4 left-[8%] right-[5%] h-9 rounded-[50%] bg-[#c7aa9d]/25 blur-md" />
                <div className="absolute bottom-8 left-[10%] h-44 w-[29%] rounded-[2.8rem_2.8rem_1.5rem_1.5rem] border border-white/80 bg-gradient-to-b from-[#fffdfb] to-[#ddc9bf] shadow-[0_24px_45px_rgba(83,64,68,0.1)]"><span className="absolute -top-8 left-1/2 h-10 w-11 -translate-x-1/2 rounded-t-xl bg-[#786364]" /></div>
                <div className="absolute bottom-8 right-[9%] h-36 w-[27%] rounded-[2.2rem_2.2rem_1.5rem_1.5rem] border border-white/80 bg-gradient-to-b from-[#c2939d] from-[22%] via-[#f8ece6] via-[23%] to-[#f4dfd4] shadow-[0_24px_45px_rgba(83,64,68,0.1)]" />
                <div className="absolute left-[26%] top-3 w-[59%] rounded-[1.35rem] border border-white/90 bg-[#fffdfb]/90 p-4 shadow-[0_18px_40px_rgba(83,64,68,0.1)] backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <CupcakeMascot className="h-12 w-11 shrink-0" decorative />
                    <div><span className="text-[8px] font-medium uppercase tracking-[0.14em] text-[#b37e8d]">A gentle reminder</span><p className="mt-1.5 text-[11px] font-normal leading-5 text-[#6e6264]">We learn gently — one thoughtful change at a time.</p></div>
                  </div>
                </div>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-3">
                {["Private by design", "No perfection pressure", "Your pace, always"].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/45 px-3 py-3 text-[9px] font-medium text-[#796d6f] backdrop-blur-sm">
                    <Check size={12} className="shrink-0 text-[#ac7c86]" />{item}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
