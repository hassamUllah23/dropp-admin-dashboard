// lib/socket.js
import { io } from 'socket.io-client';

const socket = io('https://slgo.online', {
  transports: ['websocket'],
});

export default socket;
