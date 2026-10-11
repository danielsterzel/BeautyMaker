"use client";

import {
  ArrowRight,
  Check,
  Clock3,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { CupcakeMascot } from "@/components/beauty-maker/cupcake-mascot";
import { ApiError } from "@/lib/api/client";
import { useCurrentUserQuery } from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/storage";

function DashboardLoader() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f3ef] px-6 text-[#393233]">
      <div className="flex flex-col items-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-[1.6rem] border border-white bg-white/70 shadow-[0_18px_50px_rgba(95,69,74,0.09)]">
          <CupcakeMascot className="h-14 w-14 animate-pulse" decorative />
        </div>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a18387]">
          Preparing your space
        </p>
      </div>
    </main>
  );
}

export function Dashboard() {
  const router = useRouter();
  const accessToken = useAuthStore((store) => store.accessToken);
  const sessionInitialized = useAuthStore(
    (store) => store.sessionInitialized,
  );
  const userQuery = useCurrentUserQuery();

  useEffect(() => {
    if (sessionInitialized && !accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router, sessionInitialized]);

  useEffect(() => {
    if (userQuery.error instanceof ApiError && userQuery.error.status === 401) {
      router.replace("/login");
    }
  }, [router, userQuery.error]);

  if (!sessionInitialized || !accessToken || userQuery.isPending) {
    return <DashboardLoader />;
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f3ef] px-6 text-[#393233]">
        <section className="w-full max-w-lg rounded-[2rem] border border-black/[0.06] bg-[#fffdfb] p-8 text-center shadow-[0_24px_70px_rgba(95,69,74,0.09)] sm:p-11">
          <CupcakeMascot className="mx-auto h-20 w-20" />
          <h1 className="mt-6 text-3xl font-light tracking-[-0.045em]">
            Your space needs a moment
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-[13px] leading-6 text-[#817677]">
            We could not load your profile just now. Your session is still safe.
          </p>
          <button
            type="button"
            onClick={() => void userQuery.refetch()}
            className="mt-7 rounded-xl bg-[#292526] px-5 py-3 text-[11px] font-semibold text-white transition hover:bg-[#4c4445]"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  const user = userQuery.data;
  const firstName = user.displayName?.trim().split(/\s+/)[0] || "there";
  const lastLogin = user.lastLoginAt
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(user.lastLoginAt))
    : "Just now";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f3ef] px-4 py-4 text-[#332e2f] sm:px-6 sm:py-6">
      <div className="pointer-events-none absolute -left-48 top-12 h-[32rem] w-[32rem] rounded-full bg-[#efdce4]/70 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[34rem] w-[34rem] rounded-full bg-[#e2e0ee]/70 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <header className="flex items-center justify-between rounded-[1.35rem] border border-white/80 bg-[#fffdfb]/80 px-5 py-4 shadow-[0_14px_45px_rgba(79,59,64,0.06)] backdrop-blur-xl sm:px-7">
          <Link
            href="/"
            className="text-lg font-bold tracking-[-0.055em] text-[#2d2829]"
          >
            BeautyMaker<span className="ml-1 text-xs text-[#ad777e]">✦</span>
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-[#dfcfd2] bg-[#fbf3f4] px-3 py-2 text-[10px] font-semibold text-[#8f6268]">
            <span className="h-2 w-2 rounded-full bg-[#83a68c] shadow-[0_0_0_3px_rgba(131,166,140,0.14)]" />
            Signed in
          </div>
        </header>

        <section className="mt-5 overflow-hidden rounded-[2rem] border border-white/80 bg-[#fffdfb]/86 shadow-[0_28px_80px_rgba(79,59,64,0.08)] backdrop-blur-xl sm:mt-7">
          <div className="grid gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-center lg:px-14">
            <div>
              <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#aa7c82]">
                <span className="h-px w-9 bg-[#d7b9be]" />
                Your personal space
              </div>
              <h1 className="mt-5 max-w-2xl text-[clamp(2.7rem,6vw,5rem)] font-light leading-[1.02] tracking-[-0.06em]">
                Welcome back,
                <span className="block font-serif italic text-[#ad777e]">
                  {firstName}.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-[14px] leading-7 text-[#776d6e]">
                You are signed in as <strong className="font-semibold text-[#4a4243]">{user.email}</strong>.
                This is the beginning of your calm, personal skincare space.
              </p>
            </div>

            <div className="relative mx-auto grid h-44 w-44 place-items-center rounded-full bg-[#f3e5e6]/75 lg:mx-4">
              <div className="absolute inset-3 rounded-full border border-white/90" />
              <CupcakeMascot className="relative h-28 w-28" />
              <Sparkles className="absolute right-3 top-5 text-[#bd8c95]" size={20} />
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-5 md:grid-cols-3">
          <article className="rounded-[1.65rem] border border-white/80 bg-[#fffdfb]/82 p-6 shadow-[0_18px_55px_rgba(79,59,64,0.06)] backdrop-blur-xl">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#e9f0e9] text-[#63816a]">
              <ShieldCheck size={20} />
            </span>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9d9293]">
              Account
            </p>
            <h2 className="mt-2 text-xl font-medium tracking-[-0.035em]">
              Email verified
            </h2>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#718174]">
              <Check size={14} /> Your account is ready
            </div>
          </article>

          <article className="rounded-[1.65rem] border border-white/80 bg-[#fffdfb]/82 p-6 shadow-[0_18px_55px_rgba(79,59,64,0.06)] backdrop-blur-xl">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f5e7ec] text-[#a36f78]">
              <Heart size={20} />
            </span>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9d9293]">
              Skin story
            </p>
            <h2 className="mt-2 text-xl font-medium tracking-[-0.035em]">
              {user.questionnaire ? "Saved with care" : "Ready when you are"}
            </h2>
            <Link
              href="/questionnaire"
              className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold text-[#98666e] transition hover:gap-3"
            >
              {user.questionnaire ? "Review your answers" : "Tell your skin story"}
              <ArrowRight size={14} />
            </Link>
          </article>

          <article className="rounded-[1.65rem] border border-white/80 bg-[#fffdfb]/82 p-6 shadow-[0_18px_55px_rgba(79,59,64,0.06)] backdrop-blur-xl">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eceaf3] text-[#7e7290]">
              <Clock3 size={20} />
            </span>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9d9293]">
              Last sign-in
            </p>
            <h2 className="mt-2 text-lg font-medium tracking-[-0.03em]">
              {lastLogin}
            </h2>
            <p className="mt-4 text-[11px] leading-5 text-[#8a8081]">
              Your access token stays only in this browser tab&apos;s memory.
            </p>
          </article>
        </section>

        <footer className="flex items-center justify-between px-2 py-8 text-[10px] text-[#9b9192]">
          <span>BeautyMaker · early dashboard</span>
          <Link href="/" className="transition hover:text-[#4e4546]">
            Back to home
          </Link>
        </footer>
      </div>
    </main>
  );
}
