import { Action, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

export type RootState = any;
export type AppThunkDispatch = ThunkDispatch<RootState, any, Action>;
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
