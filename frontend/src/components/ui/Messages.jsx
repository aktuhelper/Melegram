import useGetAllMessages from '@/hooks/useGetAllMesage';
import useGetRTM from '@/hooks/useGetRtm';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from './button';

const Messages = ({ selectedUser }) => {
  useGetRTM()
  useGetAllMessages(); // Hook to fetch all messages
  const { messages } = useSelector((store) => store.chat); // Extracting messages from Redux store
  const { user } = useSelector((store) => store.auth); // Assuming the user info is also in Redux store

  return (
    <div className="overflow-y-auto flex-1 p-4 bg-[#121212] text-gray-200">
      {/* User Profile Section */}
      <div className="flex justify-center items-center mb-6">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="w-20 h-20 rounded-full shadow-lg">
            <AvatarImage
              src={selectedUser?.profilePicture}
              alt={`${selectedUser?.username}'s profile`}
              className="w-full h-full object-cover rounded-full"
            />
            <AvatarFallback className="bg-gray-500 text-white text-lg">
              {selectedUser?.username?.charAt(0).toUpperCase() || 'CN'}
            </AvatarFallback>
          </Avatar>
          <span className="text-gray-300 font-medium mt-2">{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2 rounded bg-white text-black hover:bg-slate-200">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex flex-col gap-3 mt-4">
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex p-4 rounded-full max-w-[75%] mb-2 shadow-lg transition-all ease-in-out duration-300 transform ${
                msg.senderId === user?._id
                  ? 'justify-end self-end bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'justify-start self-start bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200'
              }`}
            >
              <span className=" break-words">{msg.text || msg.message || 'Message content missing'}</span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">No messages found</div>
        )}
      </div>
    </div>
  );
};
export default Messages;
