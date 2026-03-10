import type { TranslationKeys } from "./locales";

// Recursively build dot-notation keys from a nested object
type DotNotation<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? DotNotation<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

export type TKey = DotNotation<TranslationKeys>;

export interface I18nConfig {
  // fallback language if translation key is missing
  fallbackLng?: string;
  // additional resources to merge — apps pass their own translations here
  resources?: Record<string, { translation: Record<string, unknown> }>;
}
