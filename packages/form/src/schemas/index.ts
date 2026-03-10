export * from "./generate-schema";

import { z } from "zod";

export const s = {
  text: (opts?: { min?: number; max?: number; label?: string }) =>
    z
      .string({ required_error: `${opts?.label ?? "This field"} is required` })
      .min(
        opts?.min ?? 1,
        `${opts?.label ?? "This field"} must be at least ${opts?.min ?? 1} characters`,
      )
      .max(
        opts?.max ?? 255,
        `${opts?.label ?? "This field"} must be at most ${opts?.max ?? 255} characters`,
      ),

  email: () =>
    z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),

  password: (opts?: { min?: number }) =>
    z
      .string({ required_error: "Password is required" })
      .min(
        opts?.min ?? 8,
        `Password must be at least ${opts?.min ?? 8} characters`,
      ),

  phone: () =>
    z
      .string({ required_error: "Phone number is required" })
      .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number"),

  checkbox: () => z.boolean({ required_error: "This field is required" }),

  requiredCheckbox: (message = "You must accept this") =>
    z.boolean().refine((val) => val === true, { message }),

  date: () => z.date({ required_error: "Date is required" }),

  select: <T extends string>(values: [T, ...T[]]) =>
    z.enum(values, { required_error: "Please select an option" }),

  file: () => z.instanceof(File, { message: "Please select a file" }),

  optional: <T extends z.ZodTypeAny>(schema: T) => schema.optional(),
};
