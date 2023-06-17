import { z } from "zod";

export type UserDTO = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  created_at: string;
  updated_at: string;
};

export const userProfileDTOSchema = z
  .object({
    name: z.string({ required_error: "Name is required." }).nonempty(),
    email: z
      .string({ required_error: "Email is required." })
      .nonempty("Email is required.")
      .email({ message: "Email is invalid." }),
    old_password: z
      .string()
      .optional()
      .nullable()
      .transform((value) => {
        if (value === null || value === undefined) return undefined;
        return value.trim() === "" ? undefined : value;
      }),
    new_password: z
      .string()

      .optional()

      .nullable()
      .transform((value) => {
        if (value === null || value === undefined) return undefined;
        return value.trim() === "" ? undefined : value;
      })
      .refine(
        (data) =>
          data === undefined ||
          data === null ||
          data.trim() === "" ||
          data.length >= 6,
        {
          message: "Password must have at least 6 characters.",
          path: ["new_password"],
        }
      ),

    password_confirm: z
      .string()
      .optional()
      .nullable()
      .transform((value) => {
        if (value === null || value === undefined) return undefined;
        return value.trim() === "" ? undefined : value;
      }),
  })
  .refine(
    (data) =>
      !(data.old_password || data.new_password || data.password_confirm) ||
      (data.old_password &&
        data.new_password &&
        data.password_confirm &&
        data.old_password.trim() !== "" &&
        data.new_password.trim() !== "" &&
        data.password_confirm.trim() !== ""),
    {
      message: "All password fields must be filled if one is filled.",
      path: ["password_confirm"],
    }
  )
  .refine(
    (data) =>
      data.new_password === undefined ||
      data.old_password === undefined ||
      data.new_password.trim() === "" ||
      data.old_password.trim() === "" ||
      data.new_password !== data.old_password,
    {
      message: "New password must be different from old password.",
      path: ["new_password"],
    }
  )
  .refine(
    (data) =>
      data.new_password === undefined ||
      data.password_confirm === undefined ||
      data.new_password.trim() === "" ||
      data.password_confirm.trim() === "" ||
      data.new_password === data.password_confirm,
    {
      message: "Passwords must match.",
      path: ["password_confirm"],
    }
  )
  .refine(
    (data) =>
      data.new_password === undefined ||
      data.new_password.trim() === "" ||
      data.new_password.length >= 6,
    {
      message: "Password must have at least 6 characters.",
      path: ["new_password"],
    }
  );

export type UserProfileDTO = z.infer<typeof userProfileDTOSchema>;
