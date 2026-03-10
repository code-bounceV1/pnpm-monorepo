import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export interface FormatDateOptions extends Intl.DateTimeFormatOptions {}
export interface FormatNumberOptions extends Intl.NumberFormatOptions {}
export interface FormatCurrencyOptions extends Omit<
  Intl.NumberFormatOptions,
  "style" | "currency"
> {
  currency: string;
}

export function useFormatting() {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  const formatDate = useCallback(
    (date: Date | number | string, options?: FormatDateOptions): string => {
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...options,
      }).format(new Date(date));
    },
    [locale],
  );

  const formatTime = useCallback(
    (date: Date | number | string, options?: FormatDateOptions): string => {
      return new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        ...options,
      }).format(new Date(date));
    },
    [locale],
  );

  const formatDateTime = useCallback(
    (date: Date | number | string, options?: FormatDateOptions): string => {
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        ...options,
      }).format(new Date(date));
    },
    [locale],
  );

  const formatNumber = useCallback(
    (value: number, options?: FormatNumberOptions): string => {
      return new Intl.NumberFormat(locale, options).format(value);
    },
    [locale],
  );

  const formatCurrency = useCallback(
    (
      value: number,
      { currency, ...options }: FormatCurrencyOptions,
    ): string => {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        ...options,
      }).format(value);
    },
    [locale],
  );

  const formatRelativeTime = useCallback(
    (date: Date | number | string): string => {
      const now = Date.now();
      const then = new Date(date).getTime();
      const diff = then - now;
      const seconds = Math.round(diff / 1000);
      const minutes = Math.round(seconds / 60);
      const hours = Math.round(minutes / 60);
      const days = Math.round(hours / 24);

      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

      if (Math.abs(seconds) < 60) return rtf.format(seconds, "second");
      if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
      if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
      return rtf.format(days, "day");
    },
    [locale],
  );

  return {
    formatDate,
    formatTime,
    formatDateTime,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
  };
}
