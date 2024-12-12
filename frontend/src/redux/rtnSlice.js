import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: 'realTimeNotification',
  initialState: {
    likeNotification: [], // [1,2,3]
  },
  reducers: {
    // Add or remove like notifications
    setLikeNotification: (state, action) => {
      if (action.payload.type === 'like') {
        state.likeNotification.push(action.payload);
      } else if (action.payload.type === 'dislike') {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },

    // Mark a notification (like or message) as seen
    markNotificationAsSeen: (state, action) => {
      const notificationId = action.payload; // Notification ID (e.g., 'userId-postId' or 'senderId-conversationId')

      // Check and mark like notifications as seen
      const likeNotification = state.likeNotification.find(
        (item) => item.id === notificationId
      );
      if (likeNotification) {
        likeNotification.seen = true;
      }
    },

    // Clear all seen notifications
    clearSeenNotifications: (state) => {
      // Filter out all seen notifications from like notifications
      state.likeNotification = state.likeNotification.filter((item) => !item.seen);
    },

    // Clear all notifications (both seen and unseen)
    clearAllNotifications: (state) => {
      state.likeNotification = [];
    },
  },
});

export const {
  setLikeNotification,
  markNotificationAsSeen,
  clearSeenNotifications,
  clearAllNotifications,
} = rtnSlice.actions;

export default rtnSlice.reducer;
