import { createSlice } from "@reduxjs/toolkit";

const followSlice = createSlice({
  name: 'follow',
  initialState: {
    following: [],  // List of users the current user is following
    followers: [],  // List of followers of the current user
    isFollowing: false,  // Follow status for the current user (if logged-in user follows another user)
  },
  reducers: {
    setFollowing: (state, action) => {
      state.following = action.payload || [];  // Ensure following is always an array
    },
    setFollowers: (state, action) => {
      state.followers = action.payload || [];  // Ensure followers is always an array
    },
    setIsFollowing: (state, action) => {
      state.isFollowing = action.payload;  // Set follow status (true/false)
    },
    followOrUnfollow: (state, action) => {
      const { userId, isFollowed } = action.payload;

      // Ensure following and followers are arrays
      if (!Array.isArray(state.following)) {
        state.following = [];
      }
      if (!Array.isArray(state.followers)) {
        state.followers = [];
      }

      // Follow logic: if not already following, add to following list
      if (isFollowed) {
        if (!state.following.includes(userId)) {
          state.following.push(userId);  // Add user to following list if not already following
        }
        // Remove from followers list (if the user is being unfollowed)
        state.followers = state.followers.filter(id => id !== userId);
      } else {
        // Unfollow logic: if not already a follower, add to followers list
        if (!state.followers.includes(userId)) {
          state.followers.push(userId);  // Add user to followers list if not already a follower
        }
        // Remove from following list (if the user is being followed)
        state.following = state.following.filter(id => id !== userId);
      }
    }
  }
});

// Export the actions to be used in components
export const { setFollowing, setFollowers, setIsFollowing, followOrUnfollow } = followSlice.actions;

// Export the reducer to be added to the store
export default followSlice.reducer;
