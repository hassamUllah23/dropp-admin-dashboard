// lib/socket.js
import { io } from 'socket.io-client';
import { NEXT_PUBLIC_SOCKET_URL } from '@/config/config';
const socket = io(NEXT_PUBLIC_SOCKET_URL, {
  transports: ['websocket'],
});

export default socket;
