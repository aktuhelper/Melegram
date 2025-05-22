import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className='w-72 my-20 pr-12 space-y-6'> {/* Increased width to w-72 (18rem) */}
      
      {/* User Card */}
      <div className="bg-[#1A1A1A] p-5 rounded-lg shadow-md">
        <Link to={`/profile/${user?._id}`} className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage 
              src={user?.profilePicture} 
              alt="profile_img" 
              className="w-full h-full object-cover rounded-full" 
            />
            <AvatarFallback className="flex items-center justify-center text-sm text-white bg-gray-500 rounded-full">
              CN
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col overflow-hidden">
            <h1 className="font-semibold text-lg text-white truncate">{user?.username}</h1>
            <span className="text-sm text-gray-400 truncate">{user?.bio || 'Bio here...'}</span>
          </div>
        </Link>
      </div>

      {/* Suggested Users Card */}
      <div className="bg-[#1A1A1A] p-5 rounded-lg shadow-md">
        <SuggestedUsers />
      </div>
    </div>
  );
};

export default RightSidebar;
