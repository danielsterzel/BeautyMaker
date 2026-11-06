import { useQuery } from "@tanstack/react-query"
import { getMe } from "../auth/auth-api"

export function useMe() {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: getMe,
        retry: false,
        staleTime: 60_000
    })
}