"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowLeft, Check, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { executeRegister } from "@/lib/auth/auth-service";
import { toast } from "sonner";
import { useMe } from "@/lib/hooks/useMe";
import { useRouter } from "next/navigation";

export default function Register() {

  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [retypedPassword, setRetypedPassword] = useState("")
  const register = useMutation({
    mutationFn: executeRegister,
    onSuccess: () => {
      toast.success("Account has been created", {
        description: "Check your email and confirm your account."
      })
    },
    onError: (error) => {
      toast.error("Couldn't create the account", {
        description: error.message
      })
    }
  })

  const {data: user} = useMe()
  const router = useRouter()
  
  useEffect(() => {
    if(user)
      {
        router.replace("/skin-analysis")
        return
      }
    
  }, [router, user])

  const passwordRules = [
  { label: "12–256 characters", met: password.length >= 12 && password.length <= 256 },
  { label: "One uppercase letter", met: /[A-Z]/.test(password) },
  { label: "One lowercase letter", met: /[a-z]/.test(password) },
  { label: "One number", met: /[0-9]/.test(password) },
  {
    label: "One special character",
    met: /[^A-Za-z0-9\s]/.test(password),
  },
  ];
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-champagne">
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

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-28 pb-12 lg:justify-end lg:px-16 xl:px-24">
        <div
          className="w-full max-w-[480px] rounded-2xl
          bg-offwhite p-8 shadow-2xl shadow-charcoal/10
          sm:p-12"
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-start gap-1">
              <h1 className="text-3xl font-medium">Create an account</h1>
              <p className="text-center text-sm text-secondary">
                Your skin journey starts here.
              </p>
            </div>

            <form
              id="register-form"
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault()
                if (register.isPending) return

                if(retypedPassword !== password){
                  toast.error("Coulnd't finalize registration", {
                    description: "Passwords must match!"
                  })
                  return
                }
                
                register.mutate({displayName, email, password})
              }}
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="display-name"
                  className="text-sm tracking-wider text-secondary"
                >
                  How would you like to be called?
                </label>
                <input
                  id="display-name"
                  name="displayName"
                  type="text"
                  autoComplete="nickname"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  minLength={3}
                  maxLength={120}
                  placeholder="Your name or nickname"
                  className="w-full min-w-0 rounded-md border
                  border-charcoal/30 bg-transparent px-4 py-3
                  text-sm outline-none transition-colors
                  placeholder:text-secondary/60
                  focus:border-charcoal"
                />
              </div>

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
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  aria-describedby="password-requirements"
                  required
                  minLength={12}
                  maxLength={256}
                  placeholder="Enter your password"
                  className="w-full min-w-0 rounded-md border
                  border-charcoal/30 bg-transparent px-4 py-3
                  text-sm outline-none transition-colors
                  placeholder:text-secondary/60
                  focus:border-charcoal"
                />
                <div id="password-requirements" className="mt-1 rounded-xl border border-tertiary/25 bg-cold-surface/40 px-4 py-3">
                  <p className="mb-3 text-xs text-secondary">
                    Your password needs:
                  </p>
                  <ul className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
                    {passwordRules.map((rule) => {
                      const Icon = rule.met ? Check : Circle;

                      return (
                        <li
                          key={rule.label}
                          className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                            rule.met ? "text-olive" : "text-secondary"
                          }`}
                        >
                          <Icon
                            aria-hidden="true"
                            className="size-3.5 shrink-0"
                            strokeWidth={rule.met ? 1.75 : 1}
                          />
                          <span>
                            <span className="sr-only">
                              {rule.met ? "Met: " : "Not met: "}
                            </span>
                            {rule.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="repeat-password"
                  className="text-sm tracking-wider text-secondary"
                >
                  Repeat Password
                </label>
                <input
                  id="repeat-password"
                  name="repeatPassword"
                  type="password"
                  autoComplete="new-password"
                  onChange={(e) => setRetypedPassword(e.target.value)}
                  required
                  minLength={12}
                  maxLength={256}
                  placeholder="Repeat your password"
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
                <p className="text-sm tracking-widest">Create account</p>
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
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-charcoal underline
                underline-offset-4 transition-opacity
                hover:opacity-60"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
