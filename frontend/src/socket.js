import { io } from "socket.io-client";

const socket = io(
  "https://socialsync-backend-fwwc.onrender.com",
  {
    autoConnect:false,
    transports:["websocket"],
    withCredentials:true
  }
);

export default socket;