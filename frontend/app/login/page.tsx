"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

export default function Login() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-[#EAD5C5]">
        <img
          src="/register.jpg"
          alt="Skincare ingredients"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <Link
        href="/"
        className="
    absolute top-8 left-8 z-20
    flex items-center gap-3
    rounded-full
    border border-white/40
    bg-white/70 px-5 py-3
    text-sm font-medium tracking-wider
    text-charcoal backdrop-blur-md
    transition-all duration-300
    hover:bg-white hover:-translate-x-1
  "
      >
        <ArrowLeft size={18} strokeWidth={1.5} />
        Back to home
      </Link>

      <div className="absolute inset-0 bg-white/10" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pb-12 pt-28 lg:py-12 lg:justify-end lg:px-16 xl:px-24">
        <div
          className="w-full max-w-[480px] rounded-2xl
          bg-offwhite p-8 shadow-2xl shadow-charcoal/10
          sm:p-12"
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-3xl font-medium">Welcome back</h1>
              <p className="text-center text-sm text-secondary">
                Log in to continue your skin journey.
              </p>
            </div>

            <form
              id="login-form"
              className="flex flex-col gap-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm tracking-wider text-secondary"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="your@email.com"
                  className="w-full min-w-0 rounded-md border
                  border-charcoal/30 bg-transparent px-4 py-3
                  text-sm outline-none transition-colors
                  placeholder:text-secondary/60
                  focus:border-charcoal"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm tracking-wider text-secondary"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="w-full min-w-0 rounded-md border
                  border-charcoal/30 bg-transparent px-4 py-3
                  text-sm outline-none transition-colors
                  placeholder:text-secondary/60
                  focus:border-charcoal"
                />
              </div>

              <button
                type="submit"
                className="mt-3 flex w-full cursor-pointer
                items-center justify-center gap-3 rounded-md
                bg-charcoal px-5 py-3.5 text-white
                transition-opacity duration-300 group"
              >
                <p className="text-sm tracking-widest">Log in</p>
                <ArrowUpRight
                  className="
                transition-transform
                duration-300
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5"
                  size={18}
                  strokeWidth={1.5}
                />
              </button>
            </form>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-tertiary" />
              <span className="text-xs tracking-widest text-secondary">OR</span>
              <div className="h-px flex-1 bg-tertiary" />
            </div>

            <button
              type="button"
              className="flex w-full cursor-pointer items-center
              justify-center gap-3 rounded-md border
              border-charcoal/25 bg-transparent px-4 py-3
              transition-colors duration-300 hover:border-charcoal"
            >
              <img src="/google.svg" alt="" className="h-5 w-5" />
              <p className="text-sm tracking-wider">Continue with Google</p>
            </button>

            <p className="text-center text-sm text-secondary">
              Don’t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-charcoal underline
                underline-offset-4 transition-opacity
                hover:opacity-60"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
