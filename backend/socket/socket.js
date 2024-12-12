import { Server } from "socket.io";
import express from "express";
import http from "http";

// Create the Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
    cors: {
        origin: process.env.URL,// Allow requests from the frontend
        methods: ['GET', 'POST'], // Allow these HTTP methods
    },
});

// Store user and socket mapping
const userSocketMap = {};
export const getReceiverSocketId= (receiverId)=> userSocketMap[receiverId]
// Handle new socket connections
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; // Get userId from query parameters
    if (userId) {
        userSocketMap[userId] = socket.id; // Map userId to the socket ID
        console.log(`User connected: UserId=${userId}, SocketId=${socket.id}`);
    }

    // Notify all clients about the updated online users
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Handle socket disconnection
    socket.on('disconnect', () => {
        if (userId) {
            console.log(`User disconnected: UserId=${userId}, SocketId=${socket.id}`);
            delete userSocketMap[userId]; // Remove user from the mapping
        }
        // Notify all clients about the updated online users
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

// Export the app, server, and io instance
export { app, server, io };
