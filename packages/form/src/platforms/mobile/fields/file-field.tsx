import React from "react";
import { Controller } from "react-hook-form";
import { View, Pressable } from "react-native";
import { Text, Label, Icon, Button } from "@pnpm-monorepo/ui-mobile";
import { Paperclip, X } from "lucide-react-native";
import { FieldError } from "./field-error";
import type { FieldValues, Control, Path } from "react-hook-form";

export interface FileFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  // Pass your file/image picker handler
  onPick: () => Promise<{ uri: string; name: string; type: string } | null>;
}

export function FileField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Choose a file",
  disabled,
  onPick,
}: FileFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View className="gap-1.5">
          {label && <Label>{label}</Label>}
          <View className="flex-row items-center gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={disabled}
              onPress={async () => {
                const file = await onPick();
                if (file) onChange(file);
              }}
            >
              <Icon as={Paperclip} className="text-muted-foreground mr-2" />
              <Text className="text-muted-foreground">
                {(value as { name: string } | null)?.name ?? placeholder}
              </Text>
            </Button>
            {value && (
              <Pressable onPress={() => onChange(null)}>
                <Icon as={X} className="text-muted-foreground" />
              </Pressable>
            )}
          </View>
          <FieldError error={error} />
        </View>
      )}
    />
  );
}
