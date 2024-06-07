// lib/socket.js
import { io } from 'socket.io-client';

const socket = io('https://solutionsloftmail.com', {
  transports: ['websocket'],
});

export default socket;
