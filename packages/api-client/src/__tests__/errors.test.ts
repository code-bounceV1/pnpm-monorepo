import { describe, it, expect } from "vitest";
import {
  ApiError,
  NetworkError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
} from "../errors";

describe("API Error Classes", () => {
  describe("ApiError", () => {
    it("should create ApiError with message and status code", () => {
      const error = new ApiError("Something went wrong", 500);

      expect(error.message).toBe("Something went wrong");
      expect(error.statusCode).toBe(500);
      expect(error.name).toBe("ApiError");
      expect(error instanceof Error).toBe(true);
      expect(error instanceof ApiError).toBe(true);
    });

    it("should include response data when provided", () => {
      const responseData = { error: "Server error" };
      const error = new ApiError("Server error", 500, responseData);

      expect(error.response).toEqual(responseData);
    });

    it("should include original error when provided", () => {
      const originalError = new Error("Original error");
      const error = new ApiError(
        "Wrapped error",
        500,
        undefined,
        originalError,
      );

      expect(error.originalError).toBe(originalError);
    });
  });

  describe("NetworkError", () => {
    it("should create NetworkError with default message", () => {
      const error = new NetworkError();

      expect(error.message).toBe("Network error occurred");
      expect(error.name).toBe("NetworkError");
      expect(error instanceof Error).toBe(true);
      expect(error instanceof NetworkError).toBe(true);
    });

    it("should create NetworkError with custom message", () => {
      const error = new NetworkError("Connection timeout");

      expect(error.message).toBe("Connection timeout");
    });

    it("should include original error when provided", () => {
      const originalError = new Error("Connection refused");
      const error = new NetworkError("Network failed", originalError);

      expect(error.originalError).toBe(originalError);
    });
  });

  describe("ValidationError", () => {
    it("should create ValidationError with message", () => {
      const error = new ValidationError("Validation failed");

      expect(error.message).toBe("Validation failed");
      expect(error.name).toBe("ValidationError");
      expect(error instanceof Error).toBe(true);
      expect(error instanceof ValidationError).toBe(true);
    });

    it("should include field errors when provided", () => {
      const errors = {
        email: ["Email is required", "Email must be valid"],
        password: ["Password is too short"],
      };
      const error = new ValidationError("Validation failed", errors);

      expect(error.errors).toEqual(errors);
      expect(error.errors?.email).toHaveLength(2);
      expect(error.errors?.password).toHaveLength(1);
    });
  });

  describe("UnauthorizedError", () => {
    it("should create UnauthorizedError with default message", () => {
      const error = new UnauthorizedError();

      expect(error.message).toBe("Unauthorized");
      expect(error.name).toBe("UnauthorizedError");
      expect(error instanceof Error).toBe(true);
      expect(error instanceof UnauthorizedError).toBe(true);
    });

    it("should create UnauthorizedError with custom message", () => {
      const error = new UnauthorizedError("Invalid token");

      expect(error.message).toBe("Invalid token");
    });
  });

  describe("ForbiddenError", () => {
    it("should create ForbiddenError with default message", () => {
      const error = new ForbiddenError();

      expect(error.message).toBe("Forbidden");
      expect(error.name).toBe("ForbiddenError");
      expect(error instanceof Error).toBe(true);
      expect(error instanceof ForbiddenError).toBe(true);
    });

    it("should create ForbiddenError with custom message", () => {
      const error = new ForbiddenError("Access denied");

      expect(error.message).toBe("Access denied");
    });
  });
});
