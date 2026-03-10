import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { View, Pressable } from "react-native";
import { Input, Label, Icon } from "@pnpm-monorepo/ui-mobile";
import { Eye, EyeOff } from "lucide-react-native";
import { FieldError } from "./field-error";
import type { FieldValues, Control, Path } from "react-hook-form";

export interface PasswordFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function PasswordField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Enter password",
  disabled,
}: PasswordFieldProps<T>) {
  const [visible, setVisible] = useState(false);

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
          <View className="relative">
            <Input
              value={value as string}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={placeholder}
              secureTextEntry={!visible}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!disabled}
            />
            <Pressable
              onPress={() => setVisible((v) => !v)}
              className="absolute right-3 top-0 bottom-0 justify-center"
            >
              <Icon
                as={visible ? EyeOff : Eye}
                className="text-muted-foreground"
              />
            </Pressable>
          </View>
          <FieldError error={error} />
        </View>
      )}
    />
  );
}
