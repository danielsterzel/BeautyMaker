
import { Navbar } from "./Navbar";
import { Landing } from "./Landing";
import { Plus } from "lucide-react";
import "../public/mohamed-hamdi-_Yca73BgigE-unsplash.jpg"
export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col ">
      <Navbar/>

      <div className="flex-1 min-h-0 grid grid-cols-[1fr_auto] gap-6 pt-6">

      <main className="flex flex-col gap-4">
        <Landing/>
      </main>

      <aside className="relative h-full w-[550px] overflow-hidden rounded-sm">

        <img src="mohamed-hamdi-_Yca73BgigE-unsplash.jpg"
        className="
        [mask-image:linear-gradient(to_right,transparent,black_35%),linear-gradient(to_bottom,transparent,black_10%)]
     [mask-composite:intersect]
        object-[center_40%] w-full h-full object-cover rounded-lg"/>
        <p className="absolute top-10 left-20 text-xs tracking-widest text-white">
          FIG. 01 / AURELIA
        </p>
  
        <Plus className="absolute right-6 top-10 w-6 h-6 text-offwhite" strokeWidth={1.0}/>
      </aside>
      </div>
      </div>
  )
}