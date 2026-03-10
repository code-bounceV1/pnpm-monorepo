import { describe, it, expect } from "vitest";
import en from "../en";
import ar from "../ar";

describe("i18n locales", () => {
  describe("English translations", () => {
    it("should have common translations", () => {
      expect(en.common.save).toBe("Save");
      expect(en.common.cancel).toBe("Cancel");
      expect(en.common.loading).toBe("Loading...");
    });

    it("should have auth translations", () => {
      expect(en.auth.login).toBe("Login");
      expect(en.auth.logout).toBe("Logout");
      expect(en.auth.email).toBe("Email address");
    });

    it("should have error translations", () => {
      expect(en.errors.required).toBe("This field is required");
      expect(en.errors.invalidEmail).toBe("Invalid email address");
    });
  });

  describe("Arabic translations", () => {
    it("should have common translations in Arabic", () => {
      expect(ar.common.save).toBe("حفظ");
      expect(ar.common.cancel).toBe("إلغاء");
      expect(typeof ar.common.loading).toBe("string");
    });

    it("should have auth translations in Arabic", () => {
      expect(typeof ar.auth.login).toBe("string");
      expect(typeof ar.auth.logout).toBe("string");
      expect(typeof ar.auth.email).toBe("string");
    });

    it("should have error translations in Arabic", () => {
      expect(typeof ar.errors.required).toBe("string");
      expect(typeof ar.errors.invalidEmail).toBe("string");
    });
  });

  describe("Translation structure consistency", () => {
    it("should have the same keys in both locales", () => {
      const enKeys = Object.keys(en).sort();
      const arKeys = Object.keys(ar).sort();

      expect(enKeys).toEqual(arKeys);
    });

    it("should have the same nested keys in common section", () => {
      const enCommonKeys = Object.keys(en.common).sort();
      const arCommonKeys = Object.keys(ar.common).sort();

      expect(enCommonKeys).toEqual(arCommonKeys);
    });
  });
});
