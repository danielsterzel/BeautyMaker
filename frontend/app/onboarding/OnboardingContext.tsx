"use client"

const STEPS = 10
import { createContext, useContext, useState, type ReactNode } from "react"


type OnboardingContextType = {
    currentStep: number
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>
    totalSteps: number
}

const OnboardingContext = createContext<OnboardingContextType | null>(null)

export function OnboardingProvider({children}: Readonly<{children: ReactNode}>)
{
    const [currentStep, setCurrentStep] = useState(1)

    return (
        <OnboardingContext.Provider 
        value={{currentStep, setCurrentStep, totalSteps: STEPS}}>
            {children}
        </OnboardingContext.Provider>
    )
}

export function useOnboarding()
{
    const context = useContext(OnboardingContext)
    if(!context){throw new Error("useOnboarding used outside of OnboardingProvider")}

    return context
}