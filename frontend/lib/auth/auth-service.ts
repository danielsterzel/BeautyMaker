import { loginRequest, refreshRequest, registerRequest } from "./auth-api";
import { useAuth } from "./auth-storage";
import { LoginRequest, RegisterRequest, registerRequestSchema } from "./auth-schemas";

export async function executeRegister(registerData: RegisterRequest)
{
    const validatedData = registerRequestSchema.parse(registerData)

    return registerRequest(validatedData)
}


export async function executeLogin(loginData: LoginRequest)
{

    const result = await loginRequest(loginData)

    const token = result.tokens.accessToken
    const user = result.user

    useAuth.getState().setSession(token, user)

}

export async function executeRefresh()
{
    const result = await refreshRequest();

    const token = result.accessToken
    useAuth.getState().setAccessToken(token)
    return token
}