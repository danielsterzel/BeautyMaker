"use client"

import Link from "next/link";
import { ArrowUpRight, Droplets, FlaskConical, Sparkles } from "lucide-react";
import {motion} from "motion/react"

export function Landing() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">

      {/* QuickStory */}
      <div className="relative z-10 shrink-0">
        <QuickStory />
      </div>

      <div className="flex-1" />

      {/* Title */}
      <div className="relative z-10 shrink-0">
        <Title />
      </div>



  <img
    src="/aurelia-skin-graph.svg"
    alt=""
    className="h-full w-full object-contain"
  />
    </div>
  );
}

function QuickStory() {
  return (
  <motion.ul 
  
  initial="hidden"
  animate="visible"
  variants={QuickStoryList}
  className="w-full opacity-30 ml-8 mt-8 flex flex-col gap-4">

    <motion.li
    variants={QuickStoryLi}
    
    className="flex items-center gap-4">
      <div className="w-8 shrink-0 tracking-widest">01</div>
      <div className=" h-20 w-px bg-black"/>
      <div className="max-w-64 text-left gap-4
      flex items-center text-xs ">
        <FlaskConical strokeWidth={1.0} className="w-6 h-6 shrink-0"/>
        <p>Aurelia uses complex graph structures and newest information to
          provide you with the best routine
        </p>
      </div>
    </motion.li>

    <motion.li
    variants={QuickStoryLi}
    className="flex items-center gap-4">
      <div className="w-8 shrink-0 tracking-widest">02</div>
      <div className=" h-20 w-px bg-black"/>
      <div className="max-w-64 text-left gap-4
      flex items-center text-xs ">
        <Droplets strokeWidth={1.0} className="w-6 h-6 shrink-0"/>
        <p>Each cosmetic is choosen based on ingredients made for your skin </p>
      </div>
    </motion.li>

        <motion.li
    variants={QuickStoryLi}
    className="flex items-center gap-4">
      <div className="w-8 shrink-0 tracking-widest">03</div>
      <div className=" h-20 w-px bg-black"/>
      <div className="max-w-64 text-left gap-4
      flex items-center text-xs ">
        <Sparkles strokeWidth={1} className="w-6 h-6 shrink-0" />
        <p>Enjoy a more refreshed, glossier and healthier skin!</p>
      </div>
    </motion.li>
  </motion.ul>);
}

function Title() {
  return (
    <div className="flex flex-col gap-2 h-full items-end justify-end -translate-y-12">
      <div className="flex flex-col gap-2 max-w-lg">
        <EyebrowHeading />
      </div>
      <div className="w-fit flex flex-col gap-6">
        <h1 className="text-7xl tracking-widest uppercase">aurelia</h1>
        <CoolSeparator />
      </div>

      <p className="text-secondary max-w-lg text-right text-xs">
        A better way to create, organise and improve your skincare routine
        rooted in science and most recent research
      </p>

      <DiscoverAurelia />
    </div>
  );
}


function EyebrowHeading() {
  return (
    <p className="font-light tracking-widest uppercase text-xs text-secondary">
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

function DiscoverAurelia() {
  return (
    <Link
      href="/register"
      className="
    group
    hover:text-black transition-colors duration-300
    text-md font-medium flex items-center gap-1"
    >
      Discover Aurelia
      <ArrowUpRight
        className="
      transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5
      w-3 h-3"
        strokeWidth={1.75}
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
    x:-30
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {duration: 0.6}
  }
}