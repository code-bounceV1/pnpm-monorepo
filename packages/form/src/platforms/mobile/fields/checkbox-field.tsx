import React from "react";
import { Controller } from "react-hook-form";
import { View, Pressable } from "react-native";
import { Checkbox, Label, Text } from "@pnpm-monorepo/ui-mobile";
import { FieldError } from "./field-error";
import type { FieldValues, Control, Path } from "react-hook-form";

export interface CheckboxFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function CheckboxField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  disabled,
}: CheckboxFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View className="gap-1.5">
          <Pressable
            className="flex-row items-center gap-3"
            onPress={() => !disabled && onChange(!value)}
          >
            <Checkbox
              checked={value as boolean}
              onCheckedChange={onChange}
              disabled={disabled}
            />
            <View className="flex-1">
              {label && <Label>{label}</Label>}
              {description && (
                <Text className="text-muted-foreground text-sm">
                  {description}
                </Text>
              )}
            </View>
          </Pressable>
          <FieldError error={error} />
        </View>
      )}
    />
  );
}
