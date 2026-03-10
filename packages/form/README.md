# @pnpm-monorepo/form

One package for all form needs. Platform-agnostic core with platform-specific field components via subpath exports.

```
@pnpm-monorepo/form          → core (schemas, useAppForm, generateSchema)
@pnpm-monorepo/form/mobile   → React Native fields (ui-mobile)
@pnpm-monorepo/form/web      → React web fields — coming soon (shadcn/ui)
```

---

## Installation

```json
{
  "dependencies": {
    "@pnpm-monorepo/form": "workspace:*"
  }
}
```

```bash
pnpm install
```

---

## The Pattern

Every form follows the same 3 steps regardless of platform:

```
1. Define schema   →   z.object({ ... }) or generateSchema({ ... })
2. Create form     →   useAppForm({ schema, defaultValues })
3. Render fields   →   <EmailField control={control} name="email" />
```

Schema and hook always come from `@pnpm-monorepo/form`.
Field components come from `@pnpm-monorepo/form/mobile` or `@pnpm-monorepo/form/web`.

---

## Quick Start — Login Form (Mobile)

```tsx
import { z } from "zod";
import { View } from "react-native";
import { Button } from "@pnpm-monorepo/ui-mobile";
import { s, useAppForm } from "@pnpm-monorepo/form";
import { EmailField, PasswordField } from "@pnpm-monorepo/form/mobile";

const schema = z.object({
  email: s.email(),
  password: s.password(),
});

type LoginForm = z.infer<typeof schema>;

export function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useAppForm<LoginForm>({
    schema,
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    await signIn(data.email, data.password);
  };

  return (
    <View className="gap-4 p-6">
      <EmailField control={control} name="email" label="Email" />
      <PasswordField control={control} name="password" label="Password" />
      <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </View>
  );
}
```

---

## Defining Schemas

### Option A — `s.*` helpers with `z.object`

Use when you need full zod flexibility (cross-field validation, transforms, conditionals).

```ts
import { z } from "zod";
import { s } from "@pnpm-monorepo/form";

const schema = z.object({
  name: s.text({ label: "Name", min: 2, max: 50 }),
  email: s.email(),
  password: s.password({ min: 8 }),
  phone: s.phone(),
  role: s.select(["admin", "user", "guest"]),
  birthday: s.date(),
  avatar: s.file(),
  terms: s.requiredCheckbox("You must accept the terms"),
  bio: s.optional(s.text({ label: "Bio" })),
});
```

**Confirm password** — use `.superRefine`:

```ts
const schema = z
  .object({
    password: s.password(),
    confirmPassword: s.password(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
```

### Option B — `generateSchema`

Use when you want minimal code and don't need zod-specific features. No zod imports needed.

```ts
import { generateSchema } from "@pnpm-monorepo/form";

const schema = generateSchema({
  name: { type: "text", label: "Name", min: 2 },
  email: { type: "email" },
  password: { type: "password", min: 8 },
  confirmPassword: {
    type: "password",
    matchField: "password",
    matchMessage: "Passwords do not match",
  },
  role: { type: "select", options: ["admin", "user", "guest"] },
  terms: { type: "requiredCheckbox", message: "You must accept the terms" },
  bio: { type: "text", optional: true },
} as const);

type FormValues = z.infer<typeof schema>;
```

---

## `s.*` Schema Helpers

| Helper                     | Output type      | Options                  |
| -------------------------- | ---------------- | ------------------------ |
| `s.text(opts?)`            | `string`         | `label`, `min`, `max`    |
| `s.email()`                | `string`         | —                        |
| `s.password(opts?)`        | `string`         | `min` (default `8`)      |
| `s.phone()`                | `string`         | E.164-ish regex          |
| `s.checkbox()`             | `boolean`        | —                        |
| `s.requiredCheckbox(msg?)` | `boolean`        | must be `true`           |
| `s.date()`                 | `Date`           | —                        |
| `s.select(values)`         | `string`         | tuple of string literals |
| `s.file()`                 | `File`           | —                        |
| `s.optional(schema)`       | `T \| undefined` | wraps any schema         |

---

## `generateSchema` Field Options

| Key            | Type                    | Description                                                                                    |
| -------------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `type`         | `FieldType`             | `text \| email \| password \| phone \| checkbox \| requiredCheckbox \| date \| file \| select` |
| `label`        | `string`                | Used in error messages                                                                         |
| `optional`     | `boolean`               | Makes field optional                                                                           |
| `min` / `max`  | `number`                | Length constraints (text, password)                                                            |
| `options`      | `[string, ...string[]]` | Required for `select`                                                                          |
| `matchField`   | `string`                | Key of field this must equal                                                                   |
| `matchMessage` | `string`                | Error shown when match fails                                                                   |
| `message`      | `string`                | Custom error message                                                                           |

---

## `useAppForm`

Thin wrapper around `react-hook-form`'s `useForm` with `zodResolver` pre-wired and `mode: 'onTouched'` (validates on blur, revalidates on change after the first error).

```ts
const {
  control, // pass to field components
  handleSubmit, // wrap your onSubmit
  formState: {
    isSubmitting, // true while onSubmit is running
    errors, // all field errors
    isValid, // true when no errors
    isDirty, // true when any field changed
  },
  reset, // reset to defaultValues
  setValue, // set a field value programmatically
  watch, // watch a field value
} = useAppForm<MyForm>({ schema, defaultValues });
```

---

## Mobile Field Components (`form/mobile`)

All fields share these base props:

| Prop          | Type         | Description                   |
| ------------- | ------------ | ----------------------------- |
| `name`        | `Path<T>`    | Field key — must match schema |
| `control`     | `Control<T>` | From `useAppForm`             |
| `label`       | `string?`    | Label above the field         |
| `placeholder` | `string?`    | Placeholder text              |
| `disabled`    | `boolean?`   | Disables the field            |

### `TextField`

```tsx
<TextField
  control={control}
  name="firstName"
  label="First Name"
  placeholder="John"
  autoCapitalize="words"
/>
```

### `EmailField`

Defaults: `autoCapitalize="none"`, `autoCorrect={false}`, placeholder `you@example.com`.

```tsx
<EmailField control={control} name="email" label="Email" />
```

### `PasswordField`

Includes a show/hide toggle button built in.

```tsx
<PasswordField control={control} name="password" label="Password" />
```

### `PhoneField`

Defaults: `autoCapitalize="none"`, `autoCorrect={false}`, placeholder `+1 234 567 8900`.

```tsx
<PhoneField control={control} name="phone" label="Phone Number" />
```

### `CheckboxField`

```tsx
<CheckboxField
  control={control}
  name="terms"
  label="I accept the terms and conditions"
  description="By checking this you agree to our Terms of Service."
/>
```

### `SelectField`

```tsx
<SelectField
  control={control}
  name="role"
  label="Role"
  placeholder="Select a role"
  options={[
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
    { label: "Guest", value: "guest" },
  ]}
/>
```

### `DateField`

Picker-agnostic — pass any date picker via `renderPicker`.

```tsx
import DateTimePicker from "@react-native-community/datetimepicker";

<DateField
  control={control}
  name="birthday"
  label="Birthday"
  renderPicker={({ value, onChange, isOpen, onClose }) =>
    isOpen ? (
      <DateTimePicker
        value={value ?? new Date()}
        mode="date"
        onChange={(_, date) => date && onChange(date)}
      />
    ) : null
  }
/>;
```

### `FileField`

Picker-agnostic — pass any file/image picker via `onPick`.

```tsx
import * as ImagePicker from "expo-image-picker";

<FileField
  control={control}
  name="avatar"
  label="Profile Photo"
  onPick={async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      return {
        uri: result.assets[0].uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      };
    }
    return null;
  }}
/>;
```

### `FormField` — custom fields

Use when none of the built-in fields fit. Handles the `Controller` wrapper, label, and error display for you.

```tsx
import { FormField } from "@pnpm-monorepo/form/mobile";
import { Slider } from "@pnpm-monorepo/ui-mobile";

<FormField
  control={control}
  name="volume"
  label="Volume"
  render={({ value, onChange }) => (
    <Slider
      value={value as number}
      onValueChange={onChange}
      minimumValue={0}
      maximumValue={100}
    />
  )}
/>;
```

---

## Full Example — Register Screen

```tsx
import { z } from "zod";
import { View, ScrollView } from "react-native";
import { Button } from "@pnpm-monorepo/ui-mobile";
import { s, useAppForm } from "@pnpm-monorepo/form";
import {
  TextField,
  EmailField,
  PasswordField,
  PhoneField,
  SelectField,
  CheckboxField,
} from "@pnpm-monorepo/form/mobile";

const schema = z
  .object({
    name: s.text({ label: "Name", min: 2 }),
    email: s.email(),
    phone: s.phone(),
    role: s.select(["admin", "user", "guest"]),
    password: s.password({ min: 8 }),
    confirmPassword: s.password({ min: 8 }),
    terms: s.requiredCheckbox("You must accept the terms"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type RegisterForm = z.infer<typeof schema>;

export function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useAppForm<RegisterForm>({
    schema,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: undefined,
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    await register(data);
  };

  return (
    <ScrollView>
      <View className="gap-4 p-6">
        <TextField
          control={control}
          name="name"
          label="Full Name"
          placeholder="John Doe"
        />
        <EmailField control={control} name="email" label="Email" />
        <PhoneField control={control} name="phone" label="Phone" />
        <SelectField
          control={control}
          name="role"
          label="Role"
          options={[
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" },
            { label: "Guest", value: "guest" },
          ]}
        />
        <PasswordField control={control} name="password" label="Password" />
        <PasswordField
          control={control}
          name="confirmPassword"
          label="Confirm Password"
        />
        <CheckboxField
          control={control}
          name="terms"
          label="I accept the terms and conditions"
        />
        <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create Account"}
        </Button>
      </View>
    </ScrollView>
  );
}
```
