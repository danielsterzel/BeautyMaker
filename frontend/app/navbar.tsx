"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { Aurelia } from "./Aurelia";
import { Statement } from "./Statement";
export function Navbar() {
  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-x-4 px-4 sm:px-8 xl:flex-nowrap">
      <div className="shrink-0 xl:flex-1">
        <Aurelia />
      </div>
      <nav aria-label="Main navigation" className="order-last w-full min-w-0 xl:order-none xl:w-auto">
        <ul
          className="py-4 flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-8 xl:px-8 xl:h-20 xl:flex-nowrap xl:py-0
    text-secondary
    items-center justify-between font-medium"
        >
          <UnderlineLink href="/register">Join Us</UnderlineLink>
          <UnderlineLink href="#how-it-works">Getting started</UnderlineLink>
          <UnderlineLink href="/">Our Purpose</UnderlineLink>
          <UnderlineLink href="/">The Science behind</UnderlineLink>
        </ul>
      </nav>
      <div className="hidden shrink-0 justify-end sm:flex xl:flex-1">
        <Statement />
      </div>
    </div>
  );
}

function UnderlineLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <motion.li
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative whitespace-nowrap"
    >
      <Link href={href} className="block">
        <motion.span
          variants={{
            rest: { color: "var(--color-secondary)" },
            hover: { color: "var(--color-charcoal)" },
          }}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          {children}
        </motion.span>
      </Link>

      <motion.div
        variants={{
          rest: { scaleX: 0 },
          hover: { scaleX: 1 },
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="pointer-events-none absolute left-0 bottom-0 h-px w-full bg-current origin-left"
      />
    </motion.li>
  );
}
