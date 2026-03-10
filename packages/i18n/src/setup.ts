import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import { locales } from "./locales";
import type { I18nConfig } from "./types";

export function initI18n(config: I18nConfig = {}) {
  const deviceLocale = getLocales()[0]?.languageCode ?? "en";
  const supportedLocale = deviceLocale in locales ? deviceLocale : "en";

  const resources: Record<string, { translation: Record<string, unknown> }> = {
    en: { translation: locales.en as unknown as Record<string, unknown> },
    ...config.resources,
  };

  i18next.use(initReactI18next).init({
    lng: supportedLocale,
    fallbackLng: config.fallbackLng ?? "en",
    resources,
    interpolation: {
      escapeValue: false, // React handles escaping
    },
    compatibilityJSON: "v4", // required for React Native
  });

  return i18next;
}

export { i18next };
