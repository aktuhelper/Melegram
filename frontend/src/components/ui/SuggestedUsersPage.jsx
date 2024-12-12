import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '@/redux/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useNavigate } from 'react-router-dom';

const SuggestedUsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { suggestedUsers } = useSelector((store) => store.auth);

  const handleUserClick = (user) => {
    dispatch(setSelectedUser(user));
    navigate(`/chat/${user.id}`);
  };

  return (
    <div className="p-4 bg-[#0F0F0F] text-gray-200 h-screen">
      <h1 className="font-bold text-xl mb-4 text-white">Suggested Users</h1>
      <div className="overflow-y-auto">
        {suggestedUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => handleUserClick(user)}
            className="flex gap-3 items-center p-3 hover:bg-gray-800 cursor-pointer"
          >
            <Avatar className="w-14 h-14">
              <AvatarImage
                src={user.profilePicture}
                className="w-full h-full object-cover rounded-full"
              />
              <AvatarFallback className="bg-gray-500 text-white">CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-white">{user.username}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsersPage;
