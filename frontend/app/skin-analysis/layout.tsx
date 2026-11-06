import { SkinAnalysisProvider } from "./SkinAnalysisContext";
import { SkinProfileProgress } from "./SkinProgileProgress";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function SkinAnalysisLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SkinAnalysisProvider>
      <div className="flex min-h-screen flex-col px-8 py-8">
        <header className="grid grid-cols-[auto_1fr] items-center gap-8">
          <Link
            href="/"
            className="
            hover:bg-charcoal hover:text-white
              flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium 
              tracking-wider text-charcoal transition-all duration-300 hover:-translate-x-1"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
            Back to home
          </Link>
          <SkinProfileProgress />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </SkinAnalysisProvider>
  );
}
