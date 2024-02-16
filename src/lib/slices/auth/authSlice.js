import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  userInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleLogin: (state, { payload }) => {
      state.isLogin = payload?.isLogin;
      state.userInfo = payload?.userInfo;
    },
    updateUserToken: (state, { payload }) => {
      state.userInfo.accessToken = payload?.accessToken;
      state.userInfo.refreshTokenn = payload?.refreshTokenn;
    },
    updateUser: (state, { payload }) => {
      state.userInfo.user = payload;
    },
  },
});

export const { toggleLogin, updateUser, updateUserToken } = authSlice.actions;

export default authSlice.reducer;
