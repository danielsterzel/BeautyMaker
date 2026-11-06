import { executeRefresh } from "./auth-service";
import { useAuth } from "./auth-storage";

const API_URL = "http://localhost:8000/api/v1"

let refreshPromise: Promise<string> | null = null;

function refreshOnce(): Promise<string> 
{
    if(!refreshPromise){
        refreshPromise = executeRefresh().finally(() => {
            refreshPromise = null
        })
    }
    return refreshPromise
}

type AuthFetchOptions = Omit<RequestInit, "body"> & {
    body?: string
}

export async function authFetch(
    path: string,
    options: AuthFetchOptions = {},
): Promise<Response> {


    function send(token: string)
    {
        const headers = new Headers(options.headers)
        headers.set("Authorization", `Bearer ${token}`)

        return fetch(`${API_URL}${path}`, {
            ...options,
            headers,
            credentials: "include"
        })
    }


    const token = useAuth.getState().accessToken ?? await refreshOnce();

    const response = await send(token)

    if(response.status != 401){
        return response
    }

    const currentToken = useAuth.getState().accessToken

    const newToken = await refreshOnce()

    return send(newToken)
}