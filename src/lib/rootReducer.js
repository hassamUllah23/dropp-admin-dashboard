/* Instruments */
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import chatReducer from "./slices/chat/chatSlice";
import JobReducer from "./slices/job/jobReducer";
import walletReducer from "./slices/wallet/reducer";
export const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  job: JobReducer,
  wallet: walletReducer,
});
