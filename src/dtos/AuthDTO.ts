import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string({ required_error: "Name is required." }).nonempty(),
    email: z
      .string({ required_error: "Email is required." })
      .nonempty("Email is required.")
      .email({ message: "Email is invalid." }),
    password: z
      .string({ required_error: "Password is required." })
      .nonempty("Password is required.")
      .min(6, { message: "Password must have at least 6 characters." }),
    password_confirm: z
      .string({ required_error: "Please, confirm your password." })
      .nonempty("Please, confirm your password.")
      .min(6),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords must match.",
    path: ["password_confirm"],
  });

export const LoginSchema = z.object({
  email: z.string({ required_error: "Email is required." }).nonempty(),
  password: z.string({ required_error: "Password is required." }).nonempty(),
});

export type SignInDTO = z.infer<typeof LoginSchema>;
export type SignUpDTO = z.infer<typeof signUpSchema>;
