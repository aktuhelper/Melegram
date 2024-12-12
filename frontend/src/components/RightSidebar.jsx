import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers';

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className='w-64 my-20 pr-16'> {/* Adjusted width to 16rem (64px) */}
    <Link to={`/profile/${user?._id}`}>
      <div className='flex items-center gap-4'>
        <Avatar className="w-12 h-12"> {/* Adjust avatar size */}
          <AvatarImage 
            src={user?.profilePicture} 
            alt="profile_img" 
            className="w-full h-full object-cover rounded-full" 
          />
          <AvatarFallback className="flex items-center justify-center text-sm text-white bg-gray-500 rounded-full">
            CN
          </AvatarFallback>
        </Avatar>

        <div className='flex flex-col'>
          <h1 className='font-semibold text-lg'>{user?.username}</h1>
          <span className='text-sm text-gray-400'>{user?.bio || 'Bio here...'}</span>
        </div>
      </div>
      </Link>
      <SuggestedUsers/>
    </div>
  );
};

export default RightSidebar;
