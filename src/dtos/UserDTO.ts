import { z } from "zod";

export type UserDTO = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  created_at: string;
  updated_at: string;
};

const password = z
  .string()
  .optional()
  .refine((password) => password === undefined || password.length >= 6, {
    message: "Password must have at least 6 characters.",
    path: ["new_password", "password_confirm"],
  });

export const userProfileDTOSchema = z
  .object({
    name: z.string({ required_error: "Name is required." }).nonempty(),
    email: z
      .string({ required_error: "Email is required." })
      .nonempty("Email is required.")
      .email({ message: "Email is invalid." }),
    old_password: z.string().optional(),
    new_password: z
      .string()
      .optional()
      .refine((password) => password === undefined || password.length >= 6, {
        message: "Password must have at least 6 characters.",
      }),
    password_confirm: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.old_password || data.new_password || data.password_confirm) {
        return (
          data.old_password !== undefined &&
          data.new_password !== undefined &&
          data.password_confirm !== undefined
        );
      }
      return true;
    },
    { message: "All password fields must be filled." }
  )
  .refine(
    (data) =>
      data.new_password === undefined ||
      data.password_confirm === undefined ||
      data.new_password === data.password_confirm,
    {
      message: "Passwords must match.",
      path: ["password_confirm"],
    }
  )
  .refine(
    (data) =>
      data.old_password === undefined ||
      data.new_password === undefined ||
      data.old_password !== data.new_password,
    {
      message: "New password must be different from old password.",
      path: ["new_password"],
    }
  );

export type UserProfileDTO = z.infer<typeof userProfileDTOSchema>;
