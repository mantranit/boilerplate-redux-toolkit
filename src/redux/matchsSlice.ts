import { createSlice } from "@reduxjs/toolkit";
import { REQUEST_STATUS } from "../app/utils/enums";
import { getMatchs } from "../services/matchsServices";

interface IMatchsState {
  getMatchsStatus: REQUEST_STATUS;
  matchs: any[];
}

const initialState: IMatchsState = {
  getMatchsStatus: REQUEST_STATUS.IDLE,
  matchs: [],
};

const matchsSlice = createSlice({
  name: "bets",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getMatchs.pending, (state, action) => {
      state.getMatchsStatus = REQUEST_STATUS.PENDING;
    });
    builder.addCase(getMatchs.fulfilled, (state, action) => {
      state.getMatchsStatus = REQUEST_STATUS.SUCCEEDED;
      state.matchs = action.payload;
    });
    builder.addCase(getMatchs.rejected, (state, action) => {
      state.getMatchsStatus = REQUEST_STATUS.FAILED;
    });
  },
});

export const {} = matchsSlice.actions;

export default matchsSlice.reducer;
