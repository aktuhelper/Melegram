import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [],
    messages: [],
  },
  reducers: {
    // Action to set the list of online users (could be from a socket event)
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    // Action to update the list of messages
    setMessages: (state, action) => {
      // If you want to append new messages rather than replace all:
      state.messages = [...state.messages, ...action.payload];
    },

    // Action to add a new message (if you only want to add one message at a time)
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    // Action to update a user's online status (optional for finer control)
    updateOnlineUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      const userIndex = state.onlineUsers.findIndex(
        (user) => user.id === userId
      );

      if (userIndex !== -1) {
        state.onlineUsers[userIndex].status = status;
      }
    },
  },
});

export const { setOnlineUsers, setMessages, addMessage, updateOnlineUserStatus } = chatSlice.actions;

export default chatSlice.reducer;
