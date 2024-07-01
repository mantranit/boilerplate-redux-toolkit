import { createSlice } from "@reduxjs/toolkit";
import { getBets, getBetsByUser, getDeposits } from "../services/betsServices";
import { REQUEST_STATUS } from "../app/utils/enums";
import moment from "moment";

interface IBetsState {
  getDepositsStatus: REQUEST_STATUS;
  deposits: any[];
  getBetsByUserStatus: REQUEST_STATUS;
  betsByUser: any[];
  getBetsStatus: REQUEST_STATUS;
  bets: any[];
}

const initialState: IBetsState = {
  getDepositsStatus: REQUEST_STATUS.IDLE,
  deposits: [],
  getBetsByUserStatus: REQUEST_STATUS.IDLE,
  betsByUser: [],
  getBetsStatus: REQUEST_STATUS.IDLE,
  bets: [],
};

const betsSlice = createSlice({
  name: "bets",
  initialState,
  reducers: {
    updateBets: (state, action) => {
      const { match_id, user_id, bet: selected } = action.payload;
      const bets = [...state.bets];
      const exists = bets.findIndex(
        (bet) => bet.match_id === match_id && bet.user_id === user_id
      );
      if (exists >= 0) {
        bets[exists].bet = selected;
      } else {
        bets.push({
          id: moment().format(),
          match_id,
          user_id,
          bet: selected,
        });
      }
      state.bets = bets;
    },
  },
  extraReducers(builder) {
    builder.addCase(getDeposits.pending, (state, action) => {
      state.getDepositsStatus = REQUEST_STATUS.PENDING;
    });
    builder.addCase(getDeposits.fulfilled, (state, action) => {
      state.getDepositsStatus = REQUEST_STATUS.SUCCEEDED;
      state.deposits = action.payload;
    });
    builder.addCase(getDeposits.rejected, (state, action) => {
      state.getDepositsStatus = REQUEST_STATUS.FAILED;
    });

    builder.addCase(getBetsByUser.pending, (state, action) => {
      state.getBetsByUserStatus = REQUEST_STATUS.PENDING;
    });
    builder.addCase(getBetsByUser.fulfilled, (state, action) => {
      state.getBetsByUserStatus = REQUEST_STATUS.SUCCEEDED;
      state.betsByUser = action.payload;
    });
    builder.addCase(getBetsByUser.rejected, (state, action) => {
      state.getBetsByUserStatus = REQUEST_STATUS.FAILED;
    });

    builder.addCase(getBets.pending, (state, action) => {
      state.getBetsStatus = REQUEST_STATUS.PENDING;
    });
    builder.addCase(getBets.fulfilled, (state, action) => {
      state.getBetsStatus = REQUEST_STATUS.SUCCEEDED;
      state.bets = action.payload;
    });
    builder.addCase(getBets.rejected, (state, action) => {
      state.getBetsStatus = REQUEST_STATUS.FAILED;
    });
  },
});

export const { updateBets } = betsSlice.actions;

export default betsSlice.reducer;
