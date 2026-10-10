import type { Metadata } from "next";
import { Suspense } from "react";

import { EmailConfirmation } from "@/components/auth/email-confirmation";

export const metadata: Metadata = {
  title: "Confirm your email — BeautyMaker",
  description: "Confirm your BeautyMaker email and finish setting up your account.",
  referrer: "no-referrer",
};

function ConfirmationFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f1ed] px-6 text-[#665b5d]">
      <p className="text-sm">Preparing your confirmation…</p>
    </main>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<ConfirmationFallback />}>
      <EmailConfirmation />
    </Suspense>
  );
}
