import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";


const montserrat = Montserrat({
  subsets:["latin"],

})

export const metadata: Metadata = {
  title: "Aurelia",
  description: "Skincare Optimized for you",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className= {`h-full antialiased scroll-smooth`}
    >
      <body className={`${montserrat.className} min-h-full flex flex-col bg-offwhite`}>{children}</body>
    </html>
  );
}
