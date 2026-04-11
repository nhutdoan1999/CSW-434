import { io } from "socket.io-client";

const SOCKET_URL = "http://10.0.2.2:3000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("Connected to server:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Connection error:", error.message);
});

export default socket;