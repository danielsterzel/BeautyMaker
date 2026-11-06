"use client";
import { useMe } from "@/lib/hooks/useMe";
import { FlaskConical, Moon, Settings, Sun, User } from "lucide-react";
import { useEffect } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function SkinSpace() {
  return (
    <ProtectedRoute>
      <div className="w-full  px-6 py-6">
        <SkinSpaceMenu />
        <div className="grid grid-cols-[1fr_auto] items-center">
          <CurrentRoutine />
          <div>Some other stuff</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function CurrentRoutine() {
  return (
    <div>
      <div
        className="flex text-taupe-800 
        p-4
        flex-col gap-4 rounded-2xl max-w-[500px]"
      >
        <div className="flex flex-col">
          <p
            className="text-[10px] tracking-widest
        text-secondary
        uppercase"
          >
            daily ritual
          </p>
          <h1 className="text-2xl ">Our current Routine</h1>
        </div>

        <div className="max-w-md gap-4 flex justify-between">
          <button
            className="rounded-2xl w-full px-4 py-1
          flex gap-1 items-center justify-center cursor-pointer
          border border-tertiary
          transition-colors duration-300
          hover:border-charcoal"
          >
            <Sun className="w-4 h-4 text-yellow-400" />
            Morning
          </button>
          <button
            className="
            w-full
            justify-center
          flex gap-1 items-center
          bg-taupe-700 text-white
          transition-colors duration-300
          hover:bg-charcoal
          cursor-pointer    
          rounded-2xl px-4 py-1"
          >
            <Moon className="w-4 h-4 text-white" />
            Evening
          </button>
        </div>
        <ul className="flex flex-col gap-2 ">
            <RoutineItem key={1}/>
            <RoutineItem key={2}/>
            <RoutineItem key={3}/>

        </ul>
      </div>
    </div>
  );
}

function RoutineItem({key}: Readonly<{key: number}>) {
  return (
    <li
      className="max-w-md flex gap-2 items-center 
            bg-offwhite rounded-2xl px-4 py-2
            shadow-lg
            "
    >
      <FlaskConical className="w-6 h-6 text-taupe-600" strokeWidth={1.2} />
      <div className="flex flex-col gap-1 text-secondary items-left">
        <div className="flex items-center gap-2">
          <div
            className="rounded-full  border
                border-yellow-500 p-1"
          >
            <Sun className="w-3 h-3 text-yellow-500" />
          </div>
          <p className="text-[10px]   tracking-widest">SPF</p>
          <div className="w-full h-px bg-tertiary" />
        </div>

        <h4 className="text-sm text-taupe-700">
          LA roche posay Anthelios UVMUNE
        </h4>
        <p className="text-[10px]">
          Choosen for it's immense protection and because of your sensitive skin
        </p>
      </div>
    </li>
  );
}

function SkinSpaceMenu() {
  const { data: user } = useMe();
  useEffect(() => {}, [user]);

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <Settings className="w-6 h-6" />
      </div>
      <div className="flex gap-2 items-center">
        <p>Hi {user?.displayName}</p>
        <User className="w-6 h-6" />
      </div>
    </div>
  );
}
