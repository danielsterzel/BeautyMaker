import { z } from "zod";

import { api } from "./client";

const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const userSchema = z.object({
  id: z.uuid(),
  displayName: z.string().nullable(),
  email: z.email(),
  avatarUrl: z.string().nullable(),
  emailVerified: z.boolean(),
  lastLoginAt: z.string().nullable(),
  oauthAccounts: z.array(z.unknown()),
  questionnaire: z.record(z.string(), z.unknown()).nullable(),
});

const loginResponseSchema = z.object({
  tokens: z.object({
    accessToken: z.string().min(1),
  }),
  user: userSchema,
});

export const loginFormSchema = z.object({
  email: z.email("Enter a valid email address").trim(),
  password: z.string().min(1, "Enter your password"),
});

export const registerFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(3, "Your name must contain at least 3 characters")
    .max(120, "Your name is too long"),
  email: z.email("Enter a valid email address").trim(),
  password: z
    .string()
    .min(12, "Password must contain at least 12 characters")
    .max(256, "Password is too long")
    .refine((password) => password.trim().length > 0, {
      message: "Password cannot contain only spaces",
    }),
});

export const resendEmailSchema = z.object({
  email: z.email("Enter a valid email address").trim(),
});

export type LoginInput = z.infer<typeof loginFormSchema>;
export type RegisterInput = z.infer<typeof registerFormSchema>;
export type ResendEmailInput = z.infer<typeof resendEmailSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type User = z.infer<typeof userSchema>;

export async function registerUser(input: RegisterInput) {
  const payload = registerFormSchema.parse(input);
  return apiResponseSchema.parse(await api.post("auth/register", payload));
}

export async function loginUser(input: LoginInput) {
  const payload = loginFormSchema.parse(input);
  return loginResponseSchema.parse(await api.post("auth/login", payload));
}

export async function getCurrentUser() {
  return userSchema.parse(await api.get("auth/me"));
}

export async function confirmEmail(token: string) {
  const validatedToken = z.string().trim().min(32).max(256).parse(token);
  return apiResponseSchema.parse(
    await api.post("auth/confirm-email", { token: validatedToken }),
  );
}

export async function resendVerificationEmail(input: ResendEmailInput) {
  const payload = resendEmailSchema.parse(input);
  return apiResponseSchema.parse(
    await api.post("auth/resend-email", payload),
  );
}
