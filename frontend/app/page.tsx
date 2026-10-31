import { Navbar } from "./Navbar";
import { Landing } from "./Landing";
import { Plus } from "lucide-react";
import "../public/mohamed-hamdi-_Yca73BgigE-unsplash.jpg";
import { How } from "./How";

export default function Home() {
  return (
    <div>
      <div className="w-full min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 grid grid-cols-1 gap-8 px-6 pt-6 pb-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,34%)] lg:gap-10 lg:pl-0 lg:pr-12 xl:gap-16 2xl:gap-24">
          <main className="min-w-0 flex flex-col gap-4">
            <Landing />
          </main>

          <aside className="relative aspect-[4/5] w-full max-w-[480px] justify-self-center self-center overflow-hidden rounded-sm lg:aspect-auto lg:h-[calc(100svh-10rem)] lg:min-h-[560px] lg:max-h-[900px]">
            <img
              src="/valeria-lendel-0b_7r_dNjFs-unsplash.jpg"
              alt="Beauty editorial portrait"
              className="h-full w-full object-cover object-center"
            />
            <div
              className="
              pointer-events-none absolute inset-x-0 bottom-0 h-[42%]
              bg-gradient-to-t from-black/85 via-charcoal/35 to-transparent
              "
            />
            {/* <SkinGlossary /> */}
            <p className="select-none absolute top-10 left-6 text-xs tracking-widest">
              FIG. 01 / AURELIA
            </p>

            <Plus
              className="absolute right-6 top-10 w-6 h-6 text-charcoal"
              strokeWidth={1.0}
            />
            <p className="text-white select-none absolute bottom-12 left-6 text-[10px] tracking-widest uppercase">
              portrait / study / 001
            </p>
          </aside>
        </div>
      </div>
      <How />
    </div>
  );
}

function SkinGlossary() {
  return (
    <div className="absolute bottom-8 left-6 right-6 z-10 flex gap-3">
      <div
        className="
      flex-1 rounded-xl
      border border-white/35
      bg-white/10 backdrop-blur-sm
      px-4 py-3 text-white
    "
      >
        <p className="text-[9px] uppercase tracking-[0.16em] text-white/80">
          Visible radiance
        </p>

        <p className="mt-2 text-3xl font-light">+34%</p>
      </div>

      <div
        className="
      flex-1 rounded-xl
      border border-white/35
      bg-white/10 backdrop-blur-sm
      px-4 py-3 text-white
    "
      >
        <p className="text-[9px] uppercase tracking-[0.16em] text-white/80">
          Texture
        </p>

        <p className="mt-2 text-sm font-light leading-relaxed">
          Smoother & more even
        </p>
      </div>
    </div>
  );
}
