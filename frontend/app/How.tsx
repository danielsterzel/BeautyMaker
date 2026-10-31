import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";

export function How() {
  return (
    <div className="px-6 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-secondary tracking-widest uppercase text-sm">
          Aurelia - the process
        </p>
        <Plus className="w-6 h-6" />
      </div>
      <div className="bg-secondary h-px w-full" />
        <div className="min-h-[65vh] grid grid-cols-[auto_auto] justify-center items-center gap-24">
        <Header />
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
}: Readonly<{ indicator: string; header: string; paragraph: string, link:string }>) {
  return (
    <li className="
    group
    hover:scale-[1.02]
    tranistion-transform duration-300
    cursor-pointer
    ">
    <Link href={`${link}`}
    className="grid grid-cols-[1fr_auto] gap-8 items-center">
      <div className="flex flex-col gap-1 items-left">
      <p
        className="tracking-widest
            text-sm 
            flex items-center justify-center
            rounded-full bg-charcoal text-white w-7 p-1"
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
      <ArrowUpRight className="
      tranistion-transform
      group-hover:text-charcoal
      group-hover:-translate-y-1
      group-hover:translate-x-1
      duration-300
      w-8 h-8 text-secondary"/>
      </Link>
    </li>
  );
}

function Header() {
  return (
    <div className="flex flex-col gap-2 items-left">
      <p
        className="text-xs 
        text-tertiary
        uppercase tracking-widest"
      >
        Our methodology
      </p>
      <h1 className="text-5xl">How it works</h1>
      <p className="text-secondary text-sm max-w-lg">
        Here we show you how Aurelia finds and picks the right cosmetics
        specifically for your skin
      </p>
    </div>
  );
}
