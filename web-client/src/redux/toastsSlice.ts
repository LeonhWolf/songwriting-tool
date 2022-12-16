import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import { IToastProps } from "../components/Toast";

export type Toasts = IToastProps[];

const initialState: Toasts = [];
export const toastsSlice = createSlice({
  name: "toasts",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<IToastProps, "id">>) => {
      const newToast: IToastProps = {
        id: uuidv4(),
        bodyText: action.payload.bodyText,
        severity: action.payload.severity,
      };
      state.push(newToast);
    },

    removeToast: (state, action: PayloadAction<IToastProps["id"]>) => {
      const toastIndex = state.findIndex(
        (toastState) => toastState.id === action.payload
      );
      if (toastIndex === -1)
        return console.error(
          `Toast with id: '${action.payload}' could not be deleted. It could not be found in the store state array.`
        );

      const filteredState = state.filter(
        (toast) => toast.id !== action.payload
      );

      return filteredState;
    },
  },
});

export const { addToast, removeToast } = toastsSlice.actions;
export default toastsSlice.reducer;
