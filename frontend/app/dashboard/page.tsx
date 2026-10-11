import type { Metadata } from "next";

import { Dashboard } from "@/components/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Your dashboard — BeautyMaker",
  description: "Your personal BeautyMaker space.",
};

export default function DashboardPage() {
  return <Dashboard />;
}
