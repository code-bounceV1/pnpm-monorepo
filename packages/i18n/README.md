# @pnpm-monorepo/i18n

Internationalisation package for the monorepo. Built on `i18next`, `react-i18next`, and `expo-localization`. Fully typed translation keys with dot-notation autocomplete.

---

## Folder Structure

```
packages/i18n/
├── index.ts
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts
    ├── types.ts          # TKey dot-notation type, I18nConfig
    ├── setup.ts          # initI18n
    ├── locales/
    │   ├── index.ts
    │   └── en.ts         # English translations
    └── hooks/
        ├── index.ts
        ├── useTranslation.ts   # typed t()
        ├── useLanguage.ts      # language switcher
        └── useFormatting.ts    # date, number, currency formatting
```

---

## Installation

```json
{
  "dependencies": {
    "@pnpm-monorepo/i18n": "workspace:*"
  }
}
```

```bash
pnpm install
```

---

## Setup

### 1. Initialise i18n at app startup

Call `initI18n()` once before rendering — it auto-detects the device language via `expo-localization` and falls back to English if unsupported.

```ts
// apps/my-app/app/_layout.tsx
import { initI18n } from '@pnpm-monorepo/i18n';

// initialise before app renders
initI18n();

export default function RootLayout() {
  return <Slot />;
}
```

### 2. Add app-specific translations

Pass your own translations to `initI18n` — they are merged with the shared keys.

```ts
// apps/my-app/locales/en.ts
export default {
  booking: {
    title: "My Bookings",
    empty: "No bookings yet",
    create: "New Booking",
  },
  profile: {
    title: "Profile",
    edit: "Edit Profile",
  },
} as const;
```

```ts
// apps/my-app/app/_layout.tsx
import { initI18n } from "@pnpm-monorepo/i18n";
import appEn from "@/locales/en";

initI18n({
  resources: {
    en: { translation: appEn },
  },
});
```

---

## Hooks

### `useTranslation` — typed t()

Returns a fully typed `t()` function. Autocompletes all dot-notation keys from the translation files.

```tsx
import { useTranslation } from "@pnpm-monorepo/i18n";

export function SaveButton() {
  const { t } = useTranslation();

  return <Button title={t("common.save")} />; // ✅ autocompletes
  return <Button title={t("auth.login")} />; // ✅ autocompletes
  return <Button title={t("common.typo")} />; // ❌ TypeScript error
}
```

With interpolation:

```tsx
// en.ts
welcome: "Welcome, {{name}}!";

// component
t("common.welcome", { name: "John" }); // → "Welcome, John!"
```

---

### `useLanguage` — language switcher

```tsx
import { useLanguage } from "@pnpm-monorepo/i18n";

export function LanguageSwitcher() {
  const { currentLanguage, availableLanguages, changeLanguage, isRTL } =
    useLanguage();

  return (
    <>
      <Text>Current: {currentLanguage}</Text>
      {availableLanguages.map((lang) => (
        <Button key={lang} title={lang} onPress={() => changeLanguage(lang)} />
      ))}
    </>
  );
}
```

| Property               | Type                              | Description                            |
| ---------------------- | --------------------------------- | -------------------------------------- |
| `currentLanguage`      | `Locale`                          | Active language code e.g. `'en'`       |
| `availableLanguages`   | `Locale[]`                        | All supported languages                |
| `changeLanguage(lang)` | `(lang: Locale) => Promise<void>` | Switch language                        |
| `isRTL`                | `boolean`                         | `true` for Arabic, Hebrew, Farsi, Urdu |

---

### `useFormatting` — date, number, currency

All formatters respect the active locale automatically.

```tsx
import { useFormatting } from "@pnpm-monorepo/i18n";

export function PostCard({ post }) {
  const { formatDate, formatRelativeTime, formatCurrency, formatNumber } =
    useFormatting();

  return (
    <>
      {/* Date */}
      <Text>{formatDate(post.createdAt)}</Text>
      // → "Jan 15, 2025"
      {/* Time only */}
      <Text>{formatTime(post.createdAt)}</Text>
      // → "02:30 PM"
      {/* Date + time */}
      <Text>{formatDateTime(post.createdAt)}</Text>
      // → "Jan 15, 2025, 02:30 PM"
      {/* Relative time */}
      <Text>{formatRelativeTime(post.createdAt)}</Text>
      // → "2 hours ago" / "yesterday" / "in 3 days"
      {/* Number */}
      <Text>{formatNumber(1234567.89)}</Text>
      // → "1,234,567.89"
      {/* Currency */}
      <Text>{formatCurrency(99.99, { currency: "USD" })}</Text>
      // → "$99.99"
      {/* Custom date format */}
      <Text>
        {formatDate(post.createdAt, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </Text>
      // → "Wednesday, January 15"
    </>
  );
}
```

---

## Adding a new language

**1. Add translation file:**

```ts
// src/locales/ar.ts
export default {
  common: {
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    ...
  },
  auth: {
    login: 'تسجيل الدخول',
    ...
  },
} as const;
```

**2. Register it in the locales index:**

```ts
// src/locales/index.ts
import en from "./en";
import ar from "./ar";

export const locales = { en, ar } as const;
```

`useLanguage` will now include `'ar'` in `availableLanguages` and `isRTL` will return `true` when Arabic is active.

---

## Type safety

Translation keys are fully typed using dot-notation inference. TypeScript will error on invalid keys:

```ts
t("common.save"); // ✅
t("auth.login"); // ✅
t("common.unknown"); // ❌ TypeScript error — key does not exist
t("auth"); // ❌ TypeScript error — not a leaf key
```
