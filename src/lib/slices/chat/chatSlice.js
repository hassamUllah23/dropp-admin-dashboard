import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  chatModel: 'openai',
  chat: [],
  project: null,
  history: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChatHistory: (state, { payload }) => {
      state.history = payload;
    },
    handleChatModel: (state, { payload }) => {
      state.chatModel = payload;
    },
    handleTextToImageModel: (state, { payload }) => {
      state.textToImage = payload;
    },
    handleDigitalHUman: (state, { payload }) => {
      state.digitalHuman = payload;
    },
    handleThreeDModal: (state, { payload }) => {
      state.threeDModal = payload;
    },
    toggleProject: (state, { payload }) => {
      state.project = payload;
    },
  },
});

export const {
  toggleChatHistory,
  toggleProject,
  handleChatModel,
  handleTextToImageModel,
  handleDigitalHUman,
  handleThreeDModal,
} = chatSlice.actions;

export default chatSlice.reducer;
