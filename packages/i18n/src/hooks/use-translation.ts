import { useTranslation as useI18nextTranslation } from "react-i18next";
import type { TKey } from "../types";

export function useTranslation() {
  const { t: rawT, i18n } = useI18nextTranslation();

  // Typed t() — only accepts valid dot-notation keys
  const t = (key: TKey, options?: Record<string, unknown>): string => {
    return options ? (rawT(key, options) as string) : (rawT(key) as string);
  };

  return { t, i18n };
}
