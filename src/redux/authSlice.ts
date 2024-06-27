import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser, getUsers, register } from "../services/authServices";
import { REQUEST_STATUS } from "../app/utils/enums";

interface IAuthState {
  register: REQUEST_STATUS;
  userCredential: any;
  role: string;
  getCurrentUserStatus: REQUEST_STATUS;
  currentUser: any;
  getUsersStatus: REQUEST_STATUS;
  users: any[];
}

const initialState: IAuthState = {
  register: REQUEST_STATUS.IDLE,
  userCredential: null,
  role: "user",
  getCurrentUserStatus: REQUEST_STATUS.IDLE,
  currentUser: null,
  getUsersStatus: REQUEST_STATUS.IDLE,
  users: [],
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
      state.register = REQUEST_STATUS.PENDING;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.register = REQUEST_STATUS.SUCCEEDED;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.register = REQUEST_STATUS.FAILED;
    });

    builder.addCase(getCurrentUser.pending, (state, action) => {
      state.getCurrentUserStatus = REQUEST_STATUS.PENDING;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.getCurrentUserStatus = REQUEST_STATUS.SUCCEEDED;
      state.currentUser = action.payload;
    });
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.getCurrentUserStatus = REQUEST_STATUS.FAILED;
    });

    builder.addCase(getUsers.pending, (state, action) => {
      state.getUsersStatus = REQUEST_STATUS.PENDING;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.getUsersStatus = REQUEST_STATUS.SUCCEEDED;
      state.users = action.payload;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.getUsersStatus = REQUEST_STATUS.FAILED;
    });
  },
});

export const { setUserCredential, setRole } = authSlice.actions;

export default authSlice.reducer;
