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
    updateBet: (state, action) => {
      const { match_id, bet: selected } = action.payload;
      const bets = [...state.betsByUser];
      const exists = bets.findIndex((bet) => bet.match_id === match_id);
      if (exists >= 0) {
        bets[exists].bet = selected;
      } else {
        bets.push({
          id: moment().format(),
          match_id,
          bet: selected,
        });
      }
      state.betsByUser = bets;
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

export const { updateBet } = betsSlice.actions;

export default betsSlice.reducer;
