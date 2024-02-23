import { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_CHAT_API_URL } from '@/config/config';
import axios from 'axios';

export const instance = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'skip-browser-warning',
  },  
});

export const chatInstance = axios.create({
  baseURL: NEXT_PUBLIC_CHAT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
