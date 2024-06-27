import { Action, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./authSlice";
import betsReducer from "./betsSlice";
import matchsReducer from "./matchsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    bets: betsReducer,
    matchs: matchsReducer,
  },
});

export default store;

export type RootState = any;
export type AppThunkDispatch = ThunkDispatch<RootState, any, Action>;
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
