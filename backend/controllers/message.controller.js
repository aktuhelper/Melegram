import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user_model.js";
import { getReceiverSocketId } from "../socket/socket.js"; // Get socket ID of the receiver
import { io } from "../socket/socket.js"; // Importing socket instance

// API for sending messages
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id; // The sender's ID from the request
        const receiverId = req.params.id; // The receiver's ID from the request params
        const { textMessage: message } = req.body; // Extract message from request body
        
        // Get previous conversation if it exists
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        // If conversation doesn't exist, create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Create new message
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        
        // Get user details for sender
        const senderUser = await User.findById(senderId).select('username profilePicture');

        // Only send notifications if sender is not the receiver
        if (senderId !== receiverId) {
            const notification = {
                type: 'newMessage',
                userId: senderId,
                userDetails: senderUser, // Send the sender's details for the notification
            };

            // Get the receiver's socket ID
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                // Emit notification to the receiver
                io.to(receiverSocketId).emit('notification', notification);
            }
        }

        // Push the new message into the conversation's messages array
        if (newMessage) conversation.messages.push(newMessage._id);

        // Save the updated conversation and message
        await Promise.all([conversation.save(), newMessage.save()]);

        // Implement socket.io for real-time messaging
        const receiverSocketId = getReceiverSocketId(receiverId); // Get the receiver's socket ID
        
        // Emit message to receiver via socket if receiver is online
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        // Send the new message in the response
        return res.status(201).json({
            success: true,
            newMessage
        });

    } catch (error) {
        console.log('Error sending message:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};
