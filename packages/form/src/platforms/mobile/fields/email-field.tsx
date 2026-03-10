import React from "react";
import { TextField } from "./text-field";
import type { FieldValues, Control, Path } from "react-hook-form";

export interface EmailFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function EmailField<T extends FieldValues>(props: EmailFieldProps<T>) {
  return (
    <TextField
      {...props}
      placeholder={props.placeholder ?? "you@example.com"}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}
