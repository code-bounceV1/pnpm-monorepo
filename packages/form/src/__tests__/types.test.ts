import { describe, it, expect } from "vitest";
import type { BaseFieldProps, FieldValues } from "../types";

describe("Form Types", () => {
  describe("BaseFieldProps", () => {
    it("should define base field props with required fields", () => {
      interface TestForm extends FieldValues {
        email: string;
        password: string;
      }

      const props: BaseFieldProps<TestForm> = {
        name: "email",
        control: {} as any, // Mocked control
      };

      expect(props.name).toBe("email");
      expect(props.control).toBeDefined();
    });

    it("should support optional label and placeholder", () => {
      interface TestForm extends FieldValues {
        username: string;
      }

      const props: BaseFieldProps<TestForm> = {
        name: "username",
        control: {} as any,
        label: "Username",
        placeholder: "Enter username",
      };

      expect(props.label).toBe("Username");
      expect(props.placeholder).toBe("Enter username");
    });

    it("should support disabled state", () => {
      interface TestForm extends FieldValues {
        field: string;
      }

      const props: BaseFieldProps<TestForm> = {
        name: "field",
        control: {} as any,
        disabled: true,
      };

      expect(props.disabled).toBe(true);
    });

    it("should be type-safe with field names", () => {
      interface TestForm extends FieldValues {
        email: string;
        age: number;
      }

      // These should compile without errors
      const emailProps: BaseFieldProps<TestForm> = {
        name: "email",
        control: {} as any,
      };

      const ageProps: BaseFieldProps<TestForm> = {
        name: "age",
        control: {} as any,
      };

      expect(emailProps.name).toBe("email");
      expect(ageProps.name).toBe("age");
    });
  });
});
