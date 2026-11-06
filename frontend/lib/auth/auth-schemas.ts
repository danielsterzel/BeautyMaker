import { m } from "motion/react";
import { z } from "zod";

export const loginRequestSchema = z.object({
  email: z.email("Please put a correct email address"),
  password: z.string().min(1, "Please put in the correct password"),
});
export const userSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  displayName: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  emailVerified: z.boolean(),
});

export const loginResponseSchema = z.object({
  tokens: z.object({
    accessToken: z.string().min(1),
  }),
  user: userSchema,
});

export const refreshResponseSchema = z.object({
  accessToken: z.string().min(1),
});

export const registerRequestSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(3, "Name must have at least 3 characters")
    .max(120, "Name can have up to 120 characters"),
  email: z.string().trim().min(6).max(320).pipe(z.email("Enter a valid email")),
  password: z
    .string()
    .min(12, "Password needs at least 12 characters")
    .max(256, "Password can have up to 256 characters")
    .regex(/[A-Z]/, "Password needs to contain at least one large letter")
    .regex(/[a-z]/, "Password needs to contain at least one small letter")
    .regex(/[0-9]/, "Password needs to contain at least one number")
    .regex(/[^A-Za-z0-9\s]/, "Password needs to contain at least one special character")
    .refine(
      (val) => val.trim().length > 0,
      "Password cannot have only white characters",
    ),
});

export const registerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type User = z.infer<typeof userSchema>;
