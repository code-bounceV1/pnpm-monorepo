import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, DefaultValues } from "react-hook-form";
import type { ZodType } from "zod";

export interface UseAppFormOptions<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues?: DefaultValues<T>;
}

export function useAppForm<T extends FieldValues>({
  schema,
  defaultValues,
}: UseAppFormOptions<T>) {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onTouched",
  });
}
