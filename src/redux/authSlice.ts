import { createSlice } from "@reduxjs/toolkit";
import { register } from "../services/authServices";

interface IAuthState {
  register: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: IAuthState = {
  register: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(register.pending, (state, action) => {
      state.register = "pending";
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.register = "succeeded";
    });
    builder.addCase(register.rejected, (state, action) => {
      state.register = "failed";
    });
  },
});

export const {} = authSlice.actions;

export default authSlice.reducer;
