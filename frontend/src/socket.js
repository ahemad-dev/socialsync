// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://socialsync-backend-fwwc.onrender.com";

// use autoConnect false so we control when to connect (after login / when page needs)
const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export default socket;
