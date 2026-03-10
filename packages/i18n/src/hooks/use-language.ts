import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { locales, type Locale } from "../locales";

export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as Locale;
  const availableLanguages = Object.keys(locales) as Locale[];

  const changeLanguage = useCallback(
    async (lang: Locale) => {
      await i18n.changeLanguage(lang);
    },
    [i18n],
  );

  const isRTL = ["ar", "he", "fa", "ur"].includes(currentLanguage);

  return {
    currentLanguage,
    availableLanguages,
    changeLanguage,
    isRTL,
  };
}
