"use client"

import { CircleAlertIcon, CircleCheck, Info } from "lucide-react"
import { Toaster } from "sonner"

export function AppToaster()
{
    return (
        <Toaster
        position="bottom-right"
        closeButton
        icons={{
            success: (
                <CircleCheck 
                className="size-5 text-lime-700"
                strokeWidth={1.5}/>
            ),
            error: (
                <CircleAlertIcon 
                className="size-5 text-red-800"
                strokeWidth={1.5}/>
            ),
            info: (
                <Info className="size-5 text-secondary"/>
            )
        }}
        toastOptions={{
            duration: 4000,
            classNames: {
                toast: "rounded-2xl! bg-offwhite! border! p-5! shadow-lg!",
                title: "text-sm! font-medium! tracking-wider!",
                description: "text-xs! text-secondary!",
                closeButton: "text-tertiary! border-tertiary!",
            }
        }}  
        />
    )
}