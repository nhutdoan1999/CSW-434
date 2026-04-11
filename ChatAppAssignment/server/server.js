const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
    res.send("Socket.IO Chat Server is running");
});

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_user", (userName) => {
        io.emit("user_joined", {
            id: `join-${Date.now()}`,
            type: "system",
            text: `${userName} joined the group`,
            createdAt: new Date().toISOString(),
        });
    });

    socket.on("send_message", (messageData) => {
        const newMessage = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            type: "message",
            userName: messageData.userName,
            text: messageData.text,
            createdAt: new Date().toISOString(),
        };

        io.emit("receive_message", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});