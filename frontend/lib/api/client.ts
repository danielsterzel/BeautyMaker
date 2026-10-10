
import { env } from "../env";
import { useAuthStore } from "../storage";


const API_BASE_URL = `${env.NEXT_PUBLIC_API_URL}/api/v1`

type HttpMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT"
type RequestOptions = {
    method?: HttpMethod,
    body?: unknown
    headers?: HeadersInit
}

export class ApiError extends Error {
    constructor(public readonly status: number, statusText: string) {
        super(`API ERROR: ${status} ${statusText}`)
        this.name = "ApiError"
    }
}


async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T>
{
    const {method = "GET", body, headers} = options

    const token = useAuthStore.getState().accessToken

    const requestHeaders = new Headers(headers);

    let requestBody: string | undefined

    if(body !== undefined)
    {
        requestHeaders.set("Content-Type", "application/json")
        requestBody = JSON.stringify(body)
    }

    if(token)
    {
        requestHeaders.set("Authorization", `Bearer ${token}`)
    }

    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method,
        headers: requestHeaders,
        body: requestBody
    })
    
    // add more checks on pydantic validation errors and other stuff

    if(!response.ok)
    {
        throw new ApiError(response.status, response.statusText)
    }
    if(response.status === 204) // safe guard success without answer -> prevent .json on empty
    {
        return undefined as T
    }
    return await response.json()
}

export const api = {
    get: <T>(endpoint: string) => 
        request<T>(endpoint, {method: "GET"}),
    
    post: <T>(endpoint: string, body: unknown) => 
        request<T>(endpoint, {method: "POST", body}),

    put: <T>(endpoint: string, body: unknown) => 
        request<T>(endpoint, {method: "PUT", body}),
    patch: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, {method: "PATCH", body}),
    delete: <T>(endpoint: string) =>
        request<T>(endpoint, {method: "DELETE"})
}
