import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Plus } from "lucide-react";

export function How() {
  return (
    <div className="px-6 flex flex-col gap-2">
      <div className="min-h-[65vh] grid grid-cols-[auto_auto] justify-center items-center gap-24  py-16">
        <div className="py-4">
          <Header />
        </div>
        <AureliaProcess />
      </div>
    </div>
  );
}

function AureliaProcess() {
  return (
    <ul className="flex flex-col gap-4 items-left">
      <ProcessListItem
        indicator="01"
        header="Understand your skin"
        paragraph="Tell us about your skin, concerns and your preferences"
        link="/skin-analysys"
      />

      {/* tutaj zrobie taki duzy ogolny graf
      skladnikow najczestszych i jak na siebie odzdialuja
      very interactive stuff */}
      <ProcessListItem
        indicator="02"
        header="Explore the science"
        paragraph="We examine ingredients, evidence and their interactions"
        link="/ingredients-graph"
      />

      <ProcessListItem
        indicator="03"
        header="Discover your routine"
        paragraph="A personalized routine designed around your skin"
        link="create-routine"
      />
    </ul>
  );
}

function ProcessListItem({
  indicator,
  header,
  paragraph,
  link,
}: Readonly<{
  indicator: string;
  header: string;
  paragraph: string;
  link: string;
}>) {
  return (
    <li
      className="
    group
    hover:scale-[1.02]
    tranistion-transform duration-300
    cursor-pointer
    "
    >
      <Link
        href={`${link}`}
        className="grid grid-cols-[1fr_auto] gap-8 items-center"
      >
        <div className="flex flex-col gap-1 items-left">
          <p
            className={`tracking-widest
            text-sm 
            flex items-center justify-center
            rounded-full bg-champagne w-7 p-1`}
          >
            {indicator}
          </p>
          <h2
            className="
            text-xl font-light"
          >
            {header}
          </h2>
          <p className="text-sm text-secondary">{paragraph}</p>
        </div>
        <ArrowUpRight
          className="
      tranistion-transform
      group-hover:text-charcoal
      group-hover:-translate-y-1
      group-hover:translate-x-1
      duration-300
      w-8 h-8 text-secondary"
        />
      </Link>
    </li>
  );
}

function Header() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2">
        <p className="text-xs text-honey uppercase tracking-widest">
          Our methodology
        </p>

        <h1 className="text-5xl">How it works</h1>

        <p className="text-secondary text-sm max-w-lg">
          Here we show you how Aurelia finds and picks the right cosmetics
          specifically for your skin
        </p>
      </div>
      <div className="mt-12 flex flex-col items-center justify-center bg-peach/80 rounded-lg p-2">
        <div className="flex w-full justify-between text-[#A77C53] ">
          <p className="text-[8px] tracking-widest uppercase">
            FIG. 03/ Aurelia
          </p>
          <Plus className="w-3 h-3" />
        </div>

        <img
          src="how-it.jpg"
          className="rounded-lg object-cover w-[400px]  h-auto"
        />
        <div className="py-2 flex w-full justify-between text-[#A77C53]  text-[8px]">
          <p className="tracking-widest uppercase ">Ingredient interaction</p>
          <p className="tracking-widest">02-03</p>
        </div>
      </div>
    </div>
  );
}
