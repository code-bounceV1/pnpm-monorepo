import React from "react";
import { Text } from "@pnpm-monorepo/ui-mobile";
import type { FieldError as RHFFieldError } from "react-hook-form";

interface FieldErrorProps {
  error?: RHFFieldError;
}

export function FieldError({ error }: FieldErrorProps) {
  if (!error?.message) return null;
  return <Text className="text-destructive text-xs mt-1">{error.message}</Text>;
}
