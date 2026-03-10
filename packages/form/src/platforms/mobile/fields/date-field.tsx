import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { View, Pressable } from "react-native";
import { Text, Label, Icon } from "@pnpm-monorepo/ui-mobile";
import { CalendarDays } from "lucide-react-native";
import { FieldError } from "./field-error";
import type { FieldValues, Control, Path } from "react-hook-form";

export interface DateFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  // Pass your preferred date picker component (e.g. @react-native-community/datetimepicker)
  renderPicker?: (props: {
    value: Date | undefined;
    onChange: (date: Date) => void;
    isOpen: boolean;
    onClose: () => void;
  }) => React.ReactNode;
}

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export function DateField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select a date",
  disabled,
  renderPicker,
}: DateFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View className="gap-1.5">
          {label && <Label>{label}</Label>}
          <Pressable
            onPress={() => !disabled && setIsOpen(true)}
            className="flex-row items-center justify-between border border-input rounded-md px-3 h-10 bg-background"
          >
            <Text
              className={value ? "text-foreground" : "text-muted-foreground"}
            >
              {value ? formatDate(value as Date) : placeholder}
            </Text>
            <Icon as={CalendarDays} className="text-muted-foreground" />
          </Pressable>
          {renderPicker?.({
            value: value as Date | undefined,
            onChange: (date: Date) => {
              onChange(date);
              setIsOpen(false);
            },
            isOpen,
            onClose: () => setIsOpen(false),
          })}
          <FieldError error={error} />
        </View>
      )}
    />
  );
}
