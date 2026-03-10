import { describe, it, expect, beforeEach, vi } from "vitest";
import alertSlice, {
  setLoading,
  setError,
  setWarning,
  setSuccess,
  addAlert,
  removeAlert,
  clearAlerts,
} from "../alert.slice";

describe("alertSlice", () => {
  const reducer = alertSlice.reducer;

  beforeEach(() => {
    // Mock crypto.randomUUID for consistent test results
    vi.stubGlobal("crypto", {
      randomUUID: () => "test-uuid",
    });
  });

  it("should return initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual({
      alerts: [],
      isLoading: false,
    });
  });

  describe("setLoading", () => {
    it("should set loading to true", () => {
      const state = reducer(undefined, setLoading(true));
      expect(state.isLoading).toBe(true);
    });

    it("should set loading to false", () => {
      const state = reducer({ alerts: [], isLoading: true }, setLoading(false));
      expect(state.isLoading).toBe(false);
    });
  });

  describe("setError", () => {
    it("should add error alert and set loading to false", () => {
      const state = reducer(
        { alerts: [], isLoading: true },
        setError("Error message"),
      );

      expect(state.alerts).toHaveLength(1);
      expect(state.alerts[0]).toEqual({
        id: "test-uuid",
        type: "error",
        message: "Error message",
      });
      expect(state.isLoading).toBe(false);
    });
  });

  describe("setWarning", () => {
    it("should add warning alert", () => {
      const state = reducer(undefined, setWarning("Warning message"));

      expect(state.alerts).toHaveLength(1);
      expect(state.alerts[0]).toEqual({
        id: "test-uuid",
        type: "warning",
        message: "Warning message",
      });
    });
  });

  describe("setSuccess", () => {
    it("should add success alert", () => {
      const state = reducer(undefined, setSuccess("Success message"));

      expect(state.alerts).toHaveLength(1);
      expect(state.alerts[0]).toEqual({
        id: "test-uuid",
        type: "success",
        message: "Success message",
      });
    });
  });

  describe("addAlert", () => {
    it("should add custom alert with generated id", () => {
      const state = reducer(
        undefined,
        addAlert({ type: "error", message: "Custom alert" }),
      );

      expect(state.alerts).toHaveLength(1);
      expect(state.alerts[0]).toEqual({
        id: "test-uuid",
        type: "error",
        message: "Custom alert",
      });
    });
  });

  describe("removeAlert", () => {
    it("should remove alert by id", () => {
      const initialState = {
        alerts: [
          { id: "alert-1", type: "error" as const, message: "Error 1" },
          { id: "alert-2", type: "warning" as const, message: "Warning 1" },
        ],
        isLoading: false,
      };

      const state = reducer(initialState, removeAlert("alert-1"));

      expect(state.alerts).toHaveLength(1);
      expect(state.alerts[0].id).toBe("alert-2");
    });

    it("should not modify state if alert id not found", () => {
      const initialState = {
        alerts: [{ id: "alert-1", type: "error" as const, message: "Error 1" }],
        isLoading: false,
      };

      const state = reducer(initialState, removeAlert("non-existent"));

      expect(state.alerts).toHaveLength(1);
    });
  });

  describe("clearAlerts", () => {
    it("should clear all alerts and set loading to false", () => {
      const initialState = {
        alerts: [
          { id: "alert-1", type: "error" as const, message: "Error 1" },
          { id: "alert-2", type: "warning" as const, message: "Warning 1" },
        ],
        isLoading: true,
      };

      const state = reducer(initialState, clearAlerts());

      expect(state.alerts).toEqual([]);
      expect(state.isLoading).toBe(false);
    });
  });
});
