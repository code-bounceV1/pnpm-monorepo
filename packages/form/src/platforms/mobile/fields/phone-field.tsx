import React from "react";
import { TextField } from "./text-field";
import type { FieldValues, Control, Path } from "react-hook-form";

export interface PhoneFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function PhoneField<T extends FieldValues>(props: PhoneFieldProps<T>) {
  return (
    <TextField
      {...props}
      placeholder={props.placeholder ?? "+1 234 567 8900"}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}
