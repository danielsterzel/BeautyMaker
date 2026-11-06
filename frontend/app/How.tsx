import {
  ArrowUpRight,
  Beaker,
  BookOpen,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { GraphViewport } from "./GraphViewport";

export function How() {
  return (
    <div className="min-w-0 px-6 pt-16 pb-12 flex flex-col gap-12 items-center sm:px-10 sm:pt-20 sm:pb-16 lg:px-16 lg:gap-16 lg:pt-28 lg:pb-20 xl:px-20">
      <div className="py-0">
        <Header />
      </div>
      <AureliaProcess />
      {/* <AureliaGraph /> */}
    </div>
  );
}

function AureliaProcess() {
  return (
    <ul className="mx-auto grid w-full max-w-[1000px] grid-cols-1 gap-8 items-left md:grid-cols-3 md:gap-6 xl:gap-12">
      <ProcessListItem
        indicator="01"
        header="Understand your skin"
        paragraph="Tell us about your skin, concerns and your preferences"
        link="/skin-analysis"
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
        className="flex justify-between items-center gap-4"
      >
        <div className="flex gap-3 items-center">
          <p
            className={`tracking-widest
            text-xs 
            shrink-0 aspect-square
            flex items-center justify-center
            rounded-full bg-champagne w-8 h-8 `}
          >
            {indicator}
          </p>
          <div className="flex flex-col gap-2 items-left">
            <h2
              className="
            text-base "
            >
              {header}
            </h2>
            <p className="text-xs text-secondary">{paragraph}</p>
          </div>
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
      <div className="flex flex-col gap-4">
        <p className="text-sm font-light text-honey uppercase tracking-widest sm:text-base">
          Our methodology
        </p>

        <h1 className="text-3xl sm:text-4xl">How it works</h1>

        <p className="text-secondary text-xs max-w-lg">
          Here we show you how Aurelia finds and picks the right cosmetics
          specifically for your skin
        </p>
      </div>
    </div>
  );
}

// function AureliaGraph() {
//   return (
//     <div className="@container mx-auto min-w-0 w-full max-w-[1000px] rounded-[2rem] border border-charcoal/20 bg-offwhite px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
//       <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
//         <p className="text-sm uppercase tracking-[0.2em] text-secondary">
//           Fig. 04 / Aurelia Intelligence
//         </p>
//         <p className="text-3xl text-secondary">+</p>
//       </div>

//       <GraphViewport>
//         {/* lines */}
//         <svg
//           className="pointer-events-none absolute inset-0 h-full w-full"
//           viewBox="0 0 1100 520"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           {/* skin profile -> ingredients */}
//           <path
//             d="M550 90 C 460 120, 380 150, 280 220"
//             stroke="currentColor"
//             strokeWidth="1.2"
//             className="text-charcoal/25"
//           />
//           {/* skin profile -> evidence */}
//           <path
//             d="M550 90 C 550 130, 550 160, 550 220"
//             stroke="currentColor"
//             strokeWidth="1.2"
//             className="text-charcoal/25"
//           />
//           {/* skin profile -> preferences */}
//           <path
//             d="M550 90 C 640 120, 720 150, 820 220"
//             stroke="currentColor"
//             strokeWidth="1.2"
//             className="text-charcoal/25"
//           />

//           {/* lower merge */}
//           <path
//             d="M280 280 C 360 310, 430 330, 520 365"
//             stroke="currentColor"
//             strokeWidth="1.2"
//             className="text-charcoal/20"
//           />
//           <path
//             d="M550 280 C 550 315, 550 335, 550 365"
//             stroke="currentColor"
//             strokeWidth="1.2"
//             className="text-charcoal/20"
//           />
//           <path
//             d="M820 280 C 740 310, 670 330, 580 365"
//             stroke="currentColor"
//             strokeWidth="1.2"
//             className="text-charcoal/20"
//           />

//           {/* routine -> serum */}
//           <path
//             d="M550 410 C 550 430, 550 445, 550 460"
//             stroke="currentColor"
//             strokeWidth="1.2"
//             className="text-charcoal/20"
//           />
//         </svg>

//         <Node
//           className="left-1/2 top-6 -translate-x-1/2 bg-peach"
//           title="Skin Profile"
//           large
//         />

//         <Node
//           className="left-[9%] top-[180px] bg-[color-mix(in_srgb,white_70%,var(--offwhite))]"
//           icon={<Beaker className="h-4 w-4" strokeWidth={1.5} />}
//           title="Ingredients"
//         />

//         <Node
//           className="left-1/2 top-[180px] -translate-x-1/2 bg-[color-mix(in_srgb,white_70%,var(--offwhite))]"
//           icon={<BookOpen className="h-4 w-4" strokeWidth={1.5} />}
//           title="Evidence"
//         />

//         <Node
//           className="right-[9%] top-[180px] bg-[color-mix(in_srgb,white_70%,var(--offwhite))]"
//           icon={<SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />}
//           title="Preferences"
//         />

//         <Node
//           className="left-1/2 top-[340px] -translate-x-1/2 bg-charcoal text-offwhite"
//           title="Personalized Routine"
//           large
//         />

//         <div className="absolute left-1/2 top-[435px] -translate-x-1/2 rounded-full border border-charcoal/20 bg-white px-6 py-3 text-center">
//           <p className="text-[11px] uppercase tracking-[0.18em] text-secondary">
//             Proposed Serum
//           </p>
//           <p className="pt-1 text-lg text-charcoal">Vitamin C serum</p>
//         </div>

//         <GraphCaption className="absolute bottom-0 left-0 @max-[760px]:hidden" />
//       </GraphViewport>
//       <GraphCaption className="mt-4 @min-[760px]:hidden" />
//     </div>
//   );
// }

// function GraphCaption({ className }: { className: string }) {
//   return (
//     <div className={`flex items-center gap-2 ${className}`}>
//       <Sparkles className="h-4 w-4 shrink-0 text-secondary" strokeWidth={1.5} />
//       <p className="text-[10px] uppercase tracking-[0.18em] text-secondary sm:text-sm">
//         Diagram depicting the process
//       </p>
//     </div>
//   );
// }

// function Node({
//   title,
//   icon,
//   className = "",
//   large = false,
// }: {
//   title: string;
//   icon?: React.ReactNode;
//   className?: string;
//   large?: boolean;
// }) {
//   return (
//     <div
//       className={`absolute rounded-full border border-charcoal/15 px-6 py-4 shadow-sm ${className}`}
//     >
//       <div className="flex min-w-[180px] flex-col items-center justify-center gap-2 text-center">
//         {icon && <div className="text-secondary">{icon}</div>}
//         <p
//           className={
//             large
//               ? "text-[1.1rem] uppercase tracking-[0.08em]"
//               : "text-sm uppercase tracking-[0.18em]"
//           }
//         >
//           {title}
//         </p>
//       </div>
//     </div>
//   );
// }
