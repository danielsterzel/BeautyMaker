
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Statement() {
  return (
    <Link
    href="/register"
      className="
      group transition-colors duration-300
      hover:bg-charcoal hover:text-white
        flex gap-8 items-center 
        rounded-2xl p-4"
    >
      <div className="flex flex-col  items-start">
        <p className="uppercase tracking-wider text-[10px] font-medium">
          The Art of Radiance
        </p>
        <p className="tracking-widest text-[8px] font-light uppercase">
          Aurelia - For your skin
        </p>
      </div>
      < >
        <div className="p-2 rounded-full border border-charcoal">
        <ArrowUpRight className="
        group-hover:translate-x-0.5
        group-hover:-translate-y-0.5
        tranistion-transform duration-300
        w-3 h-3"/>
        </div>
      </>
    </Link>
  );
}
