"use client"

const STEPS = 10
import { createContext, useContext, useState, type ReactNode } from "react"


type SkinAnalysisContextType = {
    currentStep: number
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>
    totalSteps: number
}

const SkinAnalysisContext = createContext<SkinAnalysisContextType | null>(null)

export function SkinAnalysisProvider({children}: Readonly<{children: ReactNode}>)
{
    const [currentStep, setCurrentStep] = useState(1)

    return (
        <SkinAnalysisContext.Provider 
        value={{currentStep, setCurrentStep, totalSteps: STEPS}}>
            {children}
        </SkinAnalysisContext.Provider>
    )
}

export function useSkinAnalysis()
{
    const context = useContext(SkinAnalysisContext)
    if(!context){throw new Error("useSkinAnalysis used outside of SkinAnalysisProvider")}

    return context
}