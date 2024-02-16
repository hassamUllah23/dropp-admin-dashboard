import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  chat: [],
  history: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChatHistory: (state, { payload }) => {
      state.history = payload;
    },
  },
});

export const { toggleChatHistory } = chatSlice.actions;

export default chatSlice.reducer;
