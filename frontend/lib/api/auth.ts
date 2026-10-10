import { api } from "./client";

type ApiResponse = {
  success: boolean;
  message: string;
};

export function confirmEmail(token: string) {
  return api.post<ApiResponse>("auth/confirm-email", { token });
}
