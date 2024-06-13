import { createSlice } from "@reduxjs/toolkit";
import { register } from "../services/authServices";

interface IAuthState {
  register: "idle" | "pending" | "succeeded" | "failed";
  userCredential: any;
  role: string;
}

const initialState: IAuthState = {
  register: "idle",
  userCredential: null,
  role: "user",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserCredential: (state, action) => {
      state.userCredential = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
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

export const { setUserCredential, setRole } = authSlice.actions;

export default authSlice.reducer;
