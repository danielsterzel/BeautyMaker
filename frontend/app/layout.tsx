import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const montserrat = localFont({
  src: [
    { path: "./fonts/montserrat-300.ttf", weight: "300", style: "normal" },
    { path: "./fonts/montserrat-300-italic.ttf", weight: "300", style: "italic" },
    { path: "./fonts/montserrat-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/montserrat-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/montserrat-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/montserrat-700.ttf", weight: "700", style: "normal" },
    { path: "./fonts/montserrat-800.ttf", weight: "800", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BeautyMaker — skincare that learns with you",
  description:
    "Thoughtful skincare experiments and honest progress tracking, built around how your skin actually responds.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
