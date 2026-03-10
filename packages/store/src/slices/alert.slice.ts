import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AlertType = "error" | "warning" | "success";

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
}

export interface AlertState {
  alerts: Alert[];
  isLoading: boolean;
}

const initialState: AlertState = {
  alerts: [],
  isLoading: false,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.alerts.push({
        id: Date.now().toString(),
        type: "error",
        message: action.payload,
      });
      state.isLoading = false;
    },
    setWarning(state, action: PayloadAction<string>) {
      state.alerts.push({
        id: Date.now().toString(),
        type: "warning",
        message: action.payload,
      });
    },
    setSuccess(state, action: PayloadAction<string>) {
      state.alerts.push({
        id: Date.now().toString(),
        type: "success",
        message: action.payload,
      });
    },
    addAlert(state, action: PayloadAction<Omit<Alert, "id">>) {
      state.alerts.push({ id: Date.now().toString(), ...action.payload });
    },
    removeAlert(state, action: PayloadAction<string>) {
      state.alerts = state.alerts.filter((a) => a.id !== action.payload);
    },
    clearAlerts(state) {
      state.alerts = [];
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  setWarning,
  setSuccess,
  addAlert,
  removeAlert,
  clearAlerts,
} = alertSlice.actions;

export default alertSlice;
