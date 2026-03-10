import type { FieldValues, Control, Path } from "react-hook-form";

export type { FieldValues, Control, Path };

export interface BaseFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}
