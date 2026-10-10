import type { Metadata } from "next";

import { AuthPage } from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Sign in — BeautyMaker",
  description: "Continue your personal BeautyMaker skin story.",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
