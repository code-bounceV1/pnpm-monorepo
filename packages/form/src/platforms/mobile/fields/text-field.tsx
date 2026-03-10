import React from "react";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import { Input, Label } from "@pnpm-monorepo/ui-mobile";
import { FieldError } from "./field-error";
import type { FieldValues, Control, Path } from "react-hook-form";

export interface TextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
}

export function TextField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  disabled,
  autoCapitalize = "sentences",
  autoCorrect = true,
}: TextFieldProps<T>) {
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
          <Input
            value={value as string}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            editable={!disabled}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
          />
          <FieldError error={error} />
        </View>
      )}
    />
  );
}
