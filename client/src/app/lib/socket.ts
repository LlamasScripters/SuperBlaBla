import { io } from "socket.io-client";

const socket = io("http://localhost:3000/", {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  timeout: 20000,
});

export default socket;