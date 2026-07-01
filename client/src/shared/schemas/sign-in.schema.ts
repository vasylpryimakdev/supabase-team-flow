import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInForm = z.infer<typeof signInSchema>;
