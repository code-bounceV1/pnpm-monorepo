import { z } from "zod";
import { s } from "./index";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "phone"
  | "checkbox"
  | "requiredCheckbox"
  | "date"
  | "file"
  | "select";

export interface FieldDefinition {
  type: FieldType;
  label?: string;
  optional?: boolean;
  // text
  min?: number;
  max?: number;
  // select
  options?: [string, ...string[]];
  // password
  matchField?: string;
  matchMessage?: string;
  // custom message
  message?: string;
}

export type SchemaDefinition = Record<string, FieldDefinition>;

type InferFieldType<F extends FieldDefinition> = F["type"] extends "text"
  ? string
  : F["type"] extends "email"
    ? string
    : F["type"] extends "password"
      ? string
      : F["type"] extends "phone"
        ? string
        : F["type"] extends "checkbox"
          ? boolean
          : F["type"] extends "requiredCheckbox"
            ? boolean
            : F["type"] extends "date"
              ? Date
              : F["type"] extends "file"
                ? File
                : F["type"] extends "select"
                  ? string
                  : never;

export type InferSchemaType<T extends SchemaDefinition> = {
  [K in keyof T]: T[K]["optional"] extends true
    ? InferFieldType<T[K]> | undefined
    : InferFieldType<T[K]>;
};

function buildFieldSchema(key: string, field: FieldDefinition): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case "text":
      schema = s.text({
        label: field.label ?? key,
        min: field.min,
        max: field.max,
      });
      break;
    case "email":
      schema = s.email();
      break;
    case "password":
      schema = s.password({ min: field.min });
      break;
    case "phone":
      schema = s.phone();
      break;
    case "checkbox":
      schema = s.checkbox();
      break;
    case "requiredCheckbox":
      schema = s.requiredCheckbox(field.message);
      break;
    case "date":
      schema = s.date();
      break;
    case "file":
      schema = s.file();
      break;
    case "select":
      if (!field.options?.length) {
        throw new Error(
          `[generateSchema] Field "${key}" of type "select" requires options`,
        );
      }
      schema = s.select(field.options);
      break;
    default:
      throw new Error(
        `[generateSchema] Unknown field type: ${(field as FieldDefinition).type}`,
      );
  }

  return field.optional ? schema.optional() : schema;
}

export function generateSchema<T extends SchemaDefinition>(definition: T) {
  const shape = Object.entries(definition).reduce(
    (acc, [key, field]) => {
      acc[key] = buildFieldSchema(key, field);
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>,
  );

  // collect match field refinements
  const matchRefinements = Object.entries(definition).filter(
    ([, field]) => field.matchField,
  );

  const baseSchema = z.object(shape);

  if (matchRefinements.length === 0) return baseSchema;

  return baseSchema.superRefine((data, ctx) => {
    for (const [key, field] of matchRefinements) {
      const obj = data as Record<string, unknown>;
      if (obj[key] !== obj[field.matchField!]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: field.matchMessage ?? `${field.label ?? key} does not match`,
          path: [key],
        });
      }
    }
  });
}
