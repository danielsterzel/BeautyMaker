"use client"
import { motion } from "motion/react"
import Link from "next/link"
import { Aurelia } from "./Aurelia"
import { Statement } from "./Statement"
export function Navbar()
{
 return(
    <div className="w-full flex items-center justify-between"> 
    <div className="flex-1">
        <Aurelia />
    </div>
    <nav className="">
    <ul className="px-8 h-20 flex gap-8 items-center justify-between font-medium">
        <UnderlineLink><Link href={""}>Join Us</Link></UnderlineLink>
        <UnderlineLink><Link href={""}>Getting started</Link></UnderlineLink>
        <UnderlineLink><Link href={""}>Our Purpose</Link></UnderlineLink>
        <UnderlineLink><Link href={""}>The Science behind</Link></UnderlineLink>
    </ul>
    </nav>
    <div className="flex flex-1 justify-end">
        <Statement />
    </div>
    </div>
    )
}


function UnderlineLink({children, key}: Readonly<{children: React.ReactNode, key?: number}>)
{
    return <motion.li 
    initial="rest"
    whileHover="hover"
    animate="rest"

    className="relative">
        {children}
        <motion.div 
        variants={{
            rest: {scaleX: 0},
            hover: {scaleX: 1}
        }}
        transition={{duration: 0.3, ease: "easeOut"}}
        className="w-full absolute left-0 bottom-0 h-px bg-black origin-left"/>
    </motion.li>
}