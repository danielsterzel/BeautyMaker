import { CircleStar } from "lucide-react"

export function Purpose()
{
    return (
    <div className="px-8 h-[65vh] w-full">

        <div className="
        select-none
        flex justify-between items-center">
        <Header/>
        <div className="bg-charcoal rounded-2xl
        text-white w-fit px-4 py-2
        flex items-center gap-2
        ">
        <CircleStar 
        strokeWidth={0.5}

        className="w-6 h-6"/>
        <p className="text-[8px] font-light
        tracking-widest uppercase">
            Our core principles</p></div>
        </div>
 

    </div>)
}

function Header()
{
    return(       <div className="py-14 flex flex-col gap-2 items-left">
            <div className="text-sm tracking-widest uppercase
            text-tertiary
            flex gap-2 items-center
            ">Our purpouse </div>
            <h1 className="text-5xl max-w-xl">Long term Skincare
            </h1>
            <p className="text-secondary text-lg max-w-xl">
                Aurelia helps you understand your skin, 
                build an effective routine and refine it over time
                - through real feedback, not guesswork
            </p>

        </div>)
}