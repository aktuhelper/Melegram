import { Server } from "socket.io";
import express from "express";
import http from "http";

// Create the Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
    cors: {
        origin: process.env.URL, // Allow requests from the frontend
        methods: ['GET', 'POST'], // Allow these HTTP methods
    },
});

// Store user and socket mapping
const userSocketMap = {};

// Function to retrieve receiver socket ID
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

// Handle new socket connections
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; // Get userId from query parameters

    // If userId is provided, map it to the socket ID
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User connected: UserId=${userId}, SocketId=${socket.id}`);
    }

    // Notify all clients about the updated online users
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Handle incoming messages from clients
    socket.on('message', (data) => {
        // You can broadcast or emit messages to specific users here
        console.log('Received message:', data);
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
        if (userId) {
            console.log(`User disconnected: UserId=${userId}, SocketId=${socket.id}`);
            delete userSocketMap[userId]; // Remove user from the mapping
        }

        // Notify all clients about the updated online users
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });

    // Handle socket reconnect events (optional)
    socket.on('reconnect', () => {
        if (userId) {
            userSocketMap[userId] = socket.id; // Re-map the socket on reconnect
            console.log(`User reconnected: UserId=${userId}, SocketId=${socket.id}`);
        }
    });
});

// Export the app, server, and io instance
export { app, server, io };
