import { Navbar } from "./Navbar";
import { Landing } from "./Landing";
import { Activity, ArrowUpRight, Layers, Leaf, Plus, User } from "lucide-react";
import { How } from "./How";
import { Purpose } from "./Purpose";
import { SectionSeparator } from "./SectionSeparator";
import type { LucideIcon } from "lucide-react/types";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-[1440px]">
      <div className="w-full min-h-[min(100svh,820px)] flex flex-col">
        <Navbar />

        <div className="flex-1 grid grid-cols-1 gap-8 px-6 pt-6 pb-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,40%)] lg:gap-10 lg:pl-0 lg:pr-12 xl:gap-16">
          <main className="min-w-0 flex flex-col gap-4">
            <Landing />
          </main>

          <aside className="relative aspect-[4/5] w-full max-w-[560px] justify-self-center self-center lg:aspect-auto lg:h-[clamp(560px,calc(100svh-10rem),700px)]">
            <div
              className="
                  absolute inset-y-0 -left-12 right-0
                  overflow-hidden rounded-sm

                "
            >
              <img
                src="/landing2.jpg"
                alt="Beauty editorial portrait"
                className="h-full w-full object-cover object-center"
              />

              <div
                className="
              pointer-events-none absolute inset-x-0 bottom-0 h-[42%]
              bg-gradient-to-t from-black/85 via-charcoal/35 to-transparent
              "
              />
            </div>
            <GlossAdnotation />

            <p className="select-none absolute top-10 left-6 text-xs text-white tracking-widest">
              FIG. 01 / AURELIA
            </p>

            <Plus
              className="absolute right-6 top-10 w-6 h-6 text-white"
              strokeWidth={1.0}
            />
            <p className="text-white select-none absolute bottom-12 left-6 text-[10px] tracking-widest uppercase">
              ILLUSTRATIVE SKIN PROFILE / 001
            </p>

            <div className="absolute top-[20%] -left-20 flex flex-col gap-8">
              <SkinAnalysisCard
                icon={User}
                heading="skin profile" 
                text="Combination · Sensitive"
              />
              <SkinAnalysisCard
                icon={Activity}
                heading="concerns"
                text="Texture · Changes"
                translate={true}
              />
              <SkinAnalysisCard
                icon={Leaf}
                heading="Ingredient match"
                text="Peptides · Azaleic acid · Retinoids"
              />
              <SkinAnalysisCard
                icon={Layers}
                heading="routine balance"
                text="Cleanse · Treat · Hydrate · Protect"
                translate={true}
              />
            </div>
          </aside>
        </div>
      </div>
      <SectionSeparator text="Aurelia - the process" />
      <section id="how-it-works">
        <How />
      </section>

      <SectionSeparator text="What we strive for" />

      <section id="our-purpose">
        <Purpose />
      </section>
    </div>
  );
}

export function SkinAnalysisCard({
  icon,
  heading,
  text,
  translate = false,
}: Readonly<{
  icon: LucideIcon;
  heading: string;
  text: string;
  translate?: boolean;
}>) {
  const Icon = icon;

  return (
    <div
      className={`${translate ? "-translate-x-4" : ""} flex items-center justify-between rounded-2xl ring-1 ring-inset ring-white/30
   gap-2 text-white px-2 py-1 w-56 min-h-16
   bg-gradient-to-r from-neutral-400/15 via-stone-500/35 to-stone-800/55 backdrop-blur-2xl shadow-md`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <div className="flex flex-col gap-0">
        <h4 className="text-xs tracking-widest uppercase">{heading}</h4>
        <p className="text-[8px] text-white/70">{text}</p>
      </div>
      <ArrowUpRight className="w-3 h-3 shrink-0" />
    </div>
  );
}

function GlossAdnotation() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-6 translate-y-12 size-6 rounded-full border border-white z-10 flex items-center justify-center">
      <div className="absolute right-full h-px bottom-1/2 translate-x-3 translate-y-6.5 w-10 bg-white/80 rotate-305" />

      <div className="absolute left-0 top-1/2 -translate-x-[35px] translate-y-[41px] h-px w-4 bg-white/80" />

      <div className="absolute w-24 flex flex-col gap-0.5 left-0 top-1/2 -translate-x-[80px] translate-y-[33px] tracking-wide uppercase text-xs text-white ">
        <span className="font-medium">Gloss</span>
        <span className="text-[8px] text-stone-300">A glassy shine</span>
      </div>
      <div className="self-center size-3 border border-white rounded-full" />
    </div>
  );
}
