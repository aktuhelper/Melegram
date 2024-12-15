import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '@/redux/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useNavigate } from 'react-router-dom';

const SuggestedUsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Check for empty or null suggestedUsers
  const { suggestedUsers = [] } = useSelector((store) => store.auth);

  const handleUserClick = (user) => {
    if (user && user.id) {
      dispatch(setSelectedUser(user));
      navigate(`/chat/${user.id}`);
    } else {
      console.warn('User ID is missing or invalid:', user);
    }
  };

  return (
    <div className="p-4 bg-[#0F0F0F] text-gray-200 h-screen">
      <h1 className="font-bold text-xl mb-4 text-white">Suggested Users</h1>
      <div className="overflow-y-auto h-[80vh]"> {/* Adjust height for scrollable list */}
        {suggestedUsers.length === 0 ? (
          <p className="text-center text-gray-400">No suggested users available</p>
        ) : (
          suggestedUsers.map((user) => (
            <div
              key={user.id || user.username} // Fallback to username if id is missing
              onClick={() => handleUserClick(user)}
              className="flex gap-3 items-center p-3 hover:bg-gray-800 cursor-pointer rounded-md"
            >
              <Avatar className="w-14 h-14">
                <AvatarImage
                  src={user.profilePicture}
                  className="w-full h-full object-cover rounded-full"
                />
                <AvatarFallback className="bg-gray-500 text-white">
                  {user.username ? user.username.slice(0, 2).toUpperCase() : "CN"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-white">{user.username}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SuggestedUsersPage;
