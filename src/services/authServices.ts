import { createAsyncThunk } from "@reduxjs/toolkit";
import http from "./http";

export type TRegisterPayload = {
  email: string;
  password: string;
  displayName: string;
};

export const register = createAsyncThunk(
  "auth/register",
  async (payload: TRegisterPayload) => {
    const response = await http.post("register", payload);
    return response.data;
  }
);
