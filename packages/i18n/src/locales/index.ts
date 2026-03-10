import en from "./en";
import ar from "./ar";

export const locales = { en, ar } as const;

export type Locale = keyof typeof locales;
export type TranslationKeys = typeof en;

export { en, ar };
