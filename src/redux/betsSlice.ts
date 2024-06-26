import { createSlice } from "@reduxjs/toolkit";
import { getDeposits } from "../services/betsServices";

interface IBetsState {
  getDepositsStatus: "idle" | "pending" | "succeeded" | "failed";
  deposits: any[];
}

const initialState: IBetsState = {
  getDepositsStatus: "idle",
  deposits: [],
};

const betsSlice = createSlice({
  name: "bets",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getDeposits.pending, (state, action) => {
      state.getDepositsStatus = "pending";
    });
    builder.addCase(getDeposits.fulfilled, (state, action) => {
      state.getDepositsStatus = "succeeded";
      state.deposits = action.payload;
    });
    builder.addCase(getDeposits.rejected, (state, action) => {
      state.getDepositsStatus = "failed";
    });
  },
});

export const {} = betsSlice.actions;

export default betsSlice.reducer;
