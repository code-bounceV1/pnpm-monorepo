import React from "react";
import { View } from "react-native";
import { Controller } from "react-hook-form";
import { Label } from "@pnpm-monorepo/ui-mobile";
import { FieldError } from "./field-error";
import type { FieldValues, Control, Path } from "react-hook-form";

export interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  render: (props: {
    value: unknown;
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
    error?: import("react-hook-form").FieldError;
  }) => React.ReactNode;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  render,
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View className="gap-1.5">
          {label && <Label>{label}</Label>}
          {render({ value, onChange, onBlur, error })}
          <FieldError error={error} />
        </View>
      )}
    />
  );
}
