import { LoginResponse, loginResponseSchema, registerResponseSchema } from "./auth-schemas";
import { LoginData } from "./auth-types";
import { 
  registerRequestSchema, type RegisterRequest, type RegisterResponse,
  refreshResponseSchema, type RefreshResponse, 
  userSchema, type User
} from "./auth-schemas";
import { authFetch } from "./auth-fetch";


export async function registerRequest(data: RegisterRequest): Promise<RegisterResponse>
{
  const response = await fetch("http://localhost:8000/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  if(!response.ok){
    throw new Error("Coulnd't create account")
  }

  const json: unknown = await response.json()
  return registerResponseSchema.parse(json);
}

export async function loginRequest(data: LoginData): Promise<LoginResponse> {
  const response = await fetch(`http://localhost:8000/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Couldn't log in");
  }

  const json: unknown = await response.json();
  return loginResponseSchema.parse(json);
}

export async function refreshRequest(): Promise<RefreshResponse>
{
    const response = await fetch("http://localhost:8000/api/v1/auth/refresh", 
        {
            method: "POST",
            credentials: "include"
        })

    if(!response.ok){
        throw new Error(`Couldn't refresh session (${response.status})`)
    }
    const json: unknown = await response.json()

    return refreshResponseSchema.parse(json)
}

export async function getMe(): Promise<User> {
  const response = await authFetch("/auth/me")

  if(!response.ok){
    throw new Error(`Coulnd't load user (${response.status})`)
  }

  const json: unknown = await response.json()
  return userSchema.parse(json)
}
