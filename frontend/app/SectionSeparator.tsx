import { Plus } from "lucide-react"

export function SectionSeparator({text}: {text: string})
{
    return (<div className=" px-6 flex flex-col gap-2"> 
      <div className="flex justify-between items-center">
        <p className="text-secondary tracking-widest uppercase text-sm">
          {text}
        </p>
        <Plus className="w-6 h-6" />
        
      </div>
      <div className="h-px w-full bg-secondary/30" />
      </div>)
}