import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    addSocketNotification: (state, action) => {
      state.notifications = action.payload;
    },
    clearSocketNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  addNotification,
  clearNotifications,
  addSocketNotification,
  clearSocketNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;
