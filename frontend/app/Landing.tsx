"use client";

import Link from "next/link";
import { ArrowUpRight, Droplets, FlaskConical, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function Landing() {
  return (
    <div className="@container flex w-full min-w-0 flex-col justify-center gap-8 lg:min-h-full lg:gap-12">
      <div className="pointer-events-none flex flex-wrap items-center gap-4 lg:ml-8">
        <img src="/olive-branch.png" alt="" className="block w-36 h-auto shrink-0" />

        <div className="min-w-0 flex flex-col gap-1">
          <span className="text-[10px] tracking-[0.2em] uppercase text-secondary">
            Botanical Study
          </span>
          <span className="text-[9px] tracking-widest text-tertiary">
            FIG. 02 / AURELIA
          </span>
        </div>
      </div>
      <div className="w-full">
        <Title />
      </div>
      <div className="py-12">
      <QuickStory />

      </div>
    </div>
  );
}
function QuickStory() {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={QuickStoryList}
      className="w-full min-w-0 text-secondary grid grid-cols-1 gap-6 lg:px-10 @3xl:grid-cols-3 @3xl:gap-4"
    >
      <motion.li
        variants={QuickStoryLi}
        className="min-w-0 cursor-default select-none flex items-center gap-3"
      >
        <div className="w-8 shrink-0 tracking-widest">01</div>
        <div className=" h-20 w-px shrink-0 bg-black" />
        <div
          className="min-w-0 flex-1 text-left gap-4
      flex items-center text-xs "
        >
          <FlaskConical
            strokeWidth={1.0}
            className="w-6 h-6 shrink-0
          text-muted-blue"
          />
          <div className="min-w-0 flex flex-col items-start gap-2">
            <p className="uppercase tracking-widest text-charcoal">
              Scientifically guided
            </p>
            <p className="text-xs">Research-informed skincare decisions</p>
          </div>
        </div>
      </motion.li>

      <motion.li
        variants={QuickStoryLi}
        className="min-w-0 cursor-default select-none flex items-center gap-3"
      >
        <div className="w-8 shrink-0 tracking-widest">02</div>
        <div className=" h-20 w-px shrink-0 bg-black" />
        <div
          className="min-w-0 flex-1 text-left gap-4
      flex items-center text-xs "
        >
          <Droplets
            strokeWidth={1.0}
            className="
          text-olive
          w-6 h-6 shrink-0"
          />
          <div className="min-w-0 flex flex-col items-start gap-2">
            <p className="uppercase tracking-widest text-charcoal">
              Made for your skin
            </p>
            <p className="text-xs">Ingredients selected specifically for you</p>
          </div>
        </div>
      </motion.li>

      <motion.li
        variants={QuickStoryLi}
        className="min-w-0 cursor-default select-none flex items-center gap-3"
      >
        <div className="w-8 shrink-0 tracking-widest">03</div>
        <div className=" h-20 w-px shrink-0 bg-black" />
        <div
          className="min-w-0 flex-1 text-left gap-4
      flex items-center text-xs "
        >
          <Sparkles
            strokeWidth={1}
            className="w-6 h-6 shrink-0
          text-blush"
          />

          <div className="min-w-0 flex flex-col items-start gap-2">
            <p className="uppercase tracking-widest text-charcoal">
              Your radiance
            </p>
            <p className="text-xs">A way to help you achieve your dream skin</p>
          </div>
        </div>
      </motion.li>
    </motion.ul>
  );
}

function Title() {
  return (
    <div className="select-none flex min-w-0 flex-col gap-2 lg:px-8 xl:px-16 justify-start">
      <div className="flex flex-col gap-2 max-w-lg">
        <EyebrowHeading />
      </div>
      <div className="w-fit max-w-full flex flex-col gap-2">
        <h1 className="text-[clamp(2.5rem,9vw,4.5rem)] lg:text-[clamp(2.5rem,5.5vw,4.5rem)] tracking-[0.3rem] uppercase">aurelia</h1>
        <CoolSeparator />
      </div>

      <p className="text-secondary max-w-lg text-right text-xs">
        A more personal approach to radiant skin. Guided by science, designed
        around you.
      </p>
      <div className="flex flex-wrap items-center gap-3 mt-2 sm:gap-6">
        <DiscoverAurelia />
        <Methodology/>
      </div>
    </div>
  );
}

function EyebrowHeading() {
  return (
    <p className="font-light tracking-widest uppercase
    text-honey
     text-xs ">
      routine meets science
    </p>
  );
}
function CoolSeparator() {
  return (
    <div className="w-full gap-2 flex items-center">
      <div className="flex-1 h-px bg-secondary" />
      <div className="w-1 h-1 bg-secondary rounded-full" />
      <div className="flex-1 h-px bg-secondary" />
    </div>
  );
}

function Methodology()
{
  return (
    <Link
      href="/methodology"
      className="
        group inline-flex w-fit items-center gap-2 whitespace-nowrap
        rounded-lg border border-tertiary
        px-4 py-2
        text-sm font-light text-charcoal
        transition-all duration-300
        hover:border-charcoal
      "
    >
      Our Methodology
      <ArrowUpRight
        className="h-3.5 w-3.5 shrink-0 transition-transform duration-300
          group-hover:translate-x-0.5
          group-hover:-translate-y-0.5"
        strokeWidth={1.5}
      />
    </Link>
  );
}

function DiscoverAurelia() {
  return (
    <Link
      href="/register"
      className="
    group w-fit whitespace-nowrap
    rounded-xl px-4 py-2 font-light

    text-white bg-charcoal
    text-md  flex items-center gap-1"
    >
      Discover Aurelia
      <ArrowUpRight
        className="
      transition-transform duration-300
      group-hover:translate-x-0.5 group-hover:-translate-y-0.5
      w-3.5 h-3.5 shrink-0"
        strokeWidth={1.5}
      />
    </Link>
  );
}

const QuickStoryList = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.25,
    },
  },
};

const QuickStoryLi = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};
