"use client"

import { getMe } from "@/lib/auth-api"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function ProtectedRoute({children}: Readonly<{children: React.ReactNode}>)
{
    const router = useRouter()
    const session = useQuery({
        queryKey: ["auth", "me"],
        queryFn: getMe,
        retry: false,
        refetchOnMount: "always"
    })
    useEffect(() => {
    if (session.isError && !session.isFetching){
        router.replace("/login")
    }    
        
    if (session.isError){
        router.replace("/login")
        }
        
    }, [session.isError, session.isFetching, router])

    if (session.isPending || session.isFetching)
        {
            return <p>Checking session...</p>
        }
    if(session.isError){return null}

    return <>{children}</>
}
