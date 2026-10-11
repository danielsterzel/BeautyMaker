"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  BadgeCheck,
  CircleAlert,
  LoaderCircle,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { CupcakeMascot } from "@/components/beauty-maker/cupcake-mascot";
import {
  type ResendEmailInput,
  resendEmailSchema,
} from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import {
  useConfirmEmailMutation,
  useResendEmailMutation,
} from "@/lib/hooks/use-auth";

type ConfirmationState =
  | "verifying"
  | "success"
  | "invalid"
  | "missing"
  | "error";

const stateCopy: Record<
  ConfirmationState,
  { eyebrow: string; title: string; description: string }
> = {
  verifying: {
    eyebrow: "Just a moment",
    title: "Confirming your email",
    description:
      "We are checking your secure link. This usually takes only a second.",
  },
  success: {
    eyebrow: "You are all set",
    title: "Your email is confirmed",
    description:
      "Your BeautyMaker account is ready. You can now sign in and continue your skin story.",
  },
  invalid: {
    eyebrow: "This link has rested",
    title: "The confirmation link is no longer valid",
    description:
      "It may have expired or already been used. Request a fresh link and we will get you back on track.",
  },
  missing: {
    eyebrow: "Something is missing",
    title: "There is no confirmation token",
    description:
      "Open the complete link from your BeautyMaker email, including the token after the question mark.",
  },
  error: {
    eyebrow: "A small connection hiccup",
    title: "We could not confirm your email yet",
    description:
      "Your link has not been used. Check your connection and try again in a moment.",
  },
};

function StatusIcon({ state }: { state: ConfirmationState }) {
  const sharedClassName = "h-7 w-7";

  if (state === "verifying") {
    return (
      <LoaderCircle
        className={`${sharedClassName} animate-spin motion-reduce:animate-none`}
        aria-hidden="true"
      />
    );
  }

  if (state === "success") {
    return <BadgeCheck className={sharedClassName} aria-hidden="true" />;
  }

  if (state === "invalid" || state === "missing") {
    return <CircleAlert className={sharedClassName} aria-hidden="true" />;
  }

  return <RefreshCw className={sharedClassName} aria-hidden="true" />;
}

function ResendEmailForm() {
  const resendMutation = useResendEmailMutation();
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendEmailInput>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);
    try {
      await resendMutation.mutateAsync(values);
      setMessage(
        "If your account still needs verification, a fresh link has been sent.",
      );
    } catch {
      setMessage("We could not send a new link. Please try again shortly.");
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate>
      <label className="block text-[10px] font-medium text-[#6e6466]">
        Email address
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(errors.email)}
          className="mt-2 w-full rounded-[1rem] border border-black/[0.075] bg-white px-4 py-3.5 text-[12px] text-[#4e4647] outline-none transition placeholder:text-[#bbb2b3] focus:border-[#bd929d] focus:ring-4 focus:ring-[#ead9df]/45"
          {...register("email")}
        />
      </label>
      {errors.email ? (
        <p className="text-[10px] font-medium text-[#a85f69]" role="alert">
          {errors.email.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={resendMutation.isPending}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[1rem] bg-[#aa7c80] px-5 py-4 text-[12px] font-medium text-white transition hover:bg-[#956a6e] disabled:cursor-wait disabled:opacity-65"
      >
        <RefreshCw
          size={14}
          className={resendMutation.isPending ? "animate-spin" : ""}
        />
        {resendMutation.isPending ? "Sending…" : "Send a fresh link"}
      </button>
      {message ? (
        <p className="text-[10px] leading-5 text-[#786d6f]" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}

export function EmailConfirmation() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [retryCount, setRetryCount] = useState(0);
  const [state, setState] = useState<ConfirmationState>(
    token ? "verifying" : "missing",
  );
  const lastRequest = useRef<string | null>(null);
  const { mutate: confirmEmail } = useConfirmEmailMutation();

  useEffect(() => {
    if (!token) {
      setState("missing");
      return;
    }

    const requestKey = `${token}:${retryCount}`;
    if (lastRequest.current === requestKey) {
      return;
    }

    lastRequest.current = requestKey;
    setState("verifying");

    confirmEmail(token, {
      onSuccess: () => {
        if (lastRequest.current === requestKey) {
          setState("success");
        }
      },
      onError: (error: unknown) => {
        if (lastRequest.current !== requestKey) {
          return;
        }

        if (error instanceof ApiError && [400, 422].includes(error.status)) {
          setState("invalid");
          return;
        }

        setState("error");
      },
    });
  }, [confirmEmail, retryCount, token]);

  const copy = stateCopy[state];
  const isSuccess = state === "success";
  const isWaiting = state === "verifying";

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

          <span className="flex items-center gap-2 rounded-full border border-black/[0.06] bg-white/65 px-3 py-2 text-[9px] font-medium uppercase tracking-[0.13em] text-[#8d8385]">
            <ShieldCheck size={13} className="text-[#ad7f84]" />
            Secure confirmation
          </span>
        </header>

        <div className="grid flex-1 items-stretch lg:grid-cols-[1.03fr_0.97fr]">
          <section className="relative z-10 flex items-center px-6 py-12 sm:px-12 lg:px-20 lg:py-16 xl:px-28">
            <div className="w-full max-w-[36rem]">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c399a1]" />
                <span className="text-[9px] font-medium uppercase tracking-[0.19em] text-[#9c7a7f]">
                  Email confirmation
                </span>
              </div>

              <h1 className="mt-7 text-[clamp(2.9rem,5vw,5.4rem)] font-light leading-[0.98] tracking-[-0.067em] text-[#393233]">
                One last,
                <em className="mt-1 block font-light italic text-[#ad777e]">
                  gentle step.
                </em>
              </h1>

              <p className="mt-7 max-w-md text-[14px] font-normal leading-7 text-[#8f8587]">
                Confirming your email keeps your personal skin notes and routine
                connected only to you.
              </p>

              <div className="mt-10 flex flex-wrap gap-3 text-[9px] font-medium uppercase tracking-[0.11em] text-[#8e8385]">
                <span className="rounded-full border border-black/[0.06] bg-white px-4 py-2.5">
                  Private by design
                </span>
                <span className="rounded-full border border-black/[0.06] bg-white px-4 py-2.5">
                  One-time link
                </span>
                <span className="rounded-full border border-black/[0.06] bg-white px-4 py-2.5">
                  30-minute window
                </span>
              </div>
            </div>
          </section>

          <aside className="relative m-3 flex min-h-[32rem] items-center overflow-hidden rounded-[1.7rem] border border-white/80 bg-gradient-to-br from-[#f4e5e1] via-[#f5eeea] to-[#e4ebf1] p-6 sm:m-5 sm:p-10 lg:ml-0 xl:p-14">
            <div className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-white/65 bg-white/20" />
            <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-[#e9cfd9]/55 blur-[40px]" />
            <div className="absolute left-[15%] top-[12%] h-32 w-32 rounded-full border border-white/50" />

            <div
              className="relative mx-auto w-full max-w-[34rem] rounded-[1.8rem] border border-white/85 bg-[#fffdfb]/88 p-6 shadow-[0_28px_65px_rgba(83,64,68,0.11)] backdrop-blur-xl sm:p-9"
              aria-live="polite"
              aria-busy={isWaiting}
            >
              <div className="flex items-start justify-between gap-5">
                <div
                  className={`grid h-14 w-14 place-items-center rounded-2xl ${
                    isSuccess
                      ? "bg-[#e7f0e9] text-[#6f8e77]"
                      : state === "invalid" || state === "missing"
                        ? "bg-[#f5e6e4] text-[#ad777e]"
                        : "bg-[#eee8f4] text-[#9179a0]"
                  }`}
                >
                  <StatusIcon state={state} />
                </div>
                <CupcakeMascot className="h-20 w-[4.5rem]" decorative />
              </div>

              <p className="mt-8 text-[9px] font-medium uppercase tracking-[0.17em] text-[#a17d83]">
                {copy.eyebrow}
              </p>
              <h2 className="mt-3 max-w-[15ch] text-[clamp(1.9rem,3vw,2.8rem)] font-light leading-[1.08] tracking-[-0.05em] text-[#514748]">
                {copy.title}
              </h2>
              <p className="mt-5 max-w-md text-[13px] font-normal leading-6 text-[#8b8082]">
                {copy.description}
              </p>

              <div className="mt-8 border-t border-black/[0.055] pt-6">
                {state === "success" ? (
                  <Link
                    href="/login"
                    className="group flex w-full items-center justify-center gap-2 rounded-[1rem] bg-[#aa7c80] px-5 py-4 text-[12px] font-medium text-white shadow-[0_12px_28px_rgba(124,86,90,0.16)] transition hover:-translate-y-0.5 hover:bg-[#956a6e]"
                  >
                    Continue to sign in
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                ) : null}

                {state === "error" ? (
                  <button
                    type="button"
                    onClick={() => setRetryCount((count) => count + 1)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[1rem] bg-[#aa7c80] px-5 py-4 text-[12px] font-medium text-white shadow-[0_12px_28px_rgba(124,86,90,0.16)] transition hover:-translate-y-0.5 hover:bg-[#956a6e]"
                  >
                    <RefreshCw size={14} />
                    Try again
                  </button>
                ) : null}

                {state === "invalid" ? (
                  <div className="space-y-3">
                    <ResendEmailForm />
                    <Link
                      href="/login"
                      className="flex w-full items-center justify-center gap-2 px-5 py-2 text-[11px] font-medium text-[#776a6c] transition hover:text-[#4c4445]"
                    >
                      Go to sign in
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : null}

                {state === "missing" ? (
                  <Link
                    href="/"
                    className="flex w-full items-center justify-center gap-2 rounded-[1rem] border border-black/[0.075] bg-white px-5 py-4 text-[12px] font-medium text-[#665b5d] transition hover:-translate-y-0.5 hover:border-[#d6bdc5]"
                  >
                    Back to BeautyMaker
                    <ArrowRight size={14} />
                  </Link>
                ) : null}

                {state === "verifying" ? (
                  <div className="flex items-center gap-3 rounded-[1rem] border border-black/[0.055] bg-white/65 px-4 py-3.5 text-[11px] text-[#8d8385]">
                    <MailCheck size={15} className="text-[#ad7f84]" />
                    Keep this page open while we check your link.
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
