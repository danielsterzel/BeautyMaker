
import "../public/clean-white-cosmetics.jpg" 
import "../public/serum-light-blue.jpg"
import "../public/blue-cream.jpg"

export function Statement()
{
    return (<div className="
        flex gap-4 items-center 
        rounded-2xl p-4">
    
        <p className="tracking-wider text-sm"> Developed for everyday use</p>
        <div className="relative w-32 h-12 ">
        <img className="absolute object-cover inset-0 rounded-full w-12 h-12"
         src={"clean-white-cosmetics.jpg"} alt="White cosmetics"/>
        <img className="absolute object-cover left-10 rounded-full w-12 h-12"
         src={"serum-light-blue.jpg"} alt="Blue serum"/>
        <img className="absolute object-cover left-20 rounded-full w-12 h-12"
         src={"blue-cream.jpg"} alt="Blue serum"/>
        </div>
    </div>)
}