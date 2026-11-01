
import {create} from "zustand";
import { User } from "./auth-schemas";

type AuthData = {
    accessToken: string | null
    user: User | null

    setSession: (token: string, user: User) => void
    setAccessToken: (token: string) => void
    clearSession: () => void
}


export const useAuth = create<AuthData>((set) => ({
    accessToken: null,
    user: null,

    setSession: (token, user) => set({accessToken: token, user: user}),
    setAccessToken: (token) => set({accessToken: token}),
    clearSession: () => set({accessToken: null, user: null})
}))
