import type { Metadata } from "next";

import { AuthPage } from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Create your account — BeautyMaker",
  description: "Create an account and give your skin story a gentle home.",
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}
