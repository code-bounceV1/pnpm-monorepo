import React from "react";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
} from "@pnpm-monorepo/ui-mobile";
import { FieldError } from "./field-error";
import type { FieldValues, Control, Path } from "react-hook-form";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
}

export function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select an option",
  options,
  disabled,
}: SelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View className="gap-1.5">
          {label && <Label>{label}</Label>}
          <Select
            value={{
              value: value as string,
              label: options.find((o) => o.value === value)?.label ?? "",
            }}
            onValueChange={(option) => onChange(option?.value)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  label={option.label}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError error={error} />
        </View>
      )}
    />
  );
}
