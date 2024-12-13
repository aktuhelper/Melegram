import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  // Return null if no suggested users are available
  if (!Array.isArray(suggestedUsers) || suggestedUsers.length === 0) {
    return null;
  }

  return (
    <div className="my-10 px-4">
      <h1 className="text-sm font-semibold text-gray-600 mb-2">Suggested for you</h1>
      {/* Apply scrolling container with responsive scrollbar behavior */}
      <div className="flex overflow-x-auto space-x-4 lg:overflow-x-scroll scrollbar-hidden lg:scrollbar lg:scrollbar-thumb-transparent lg:scrollbar-track-transparent">
        {suggestedUsers.map((user) => (
          <Link
            to={`/profile/${user?._id}`}
            key={user?._id}
            className="flex flex-col items-center flex-shrink-0 w-20"
          >
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={user?.profilePicture}
                alt="profile_img"
                className="w-full h-full object-cover rounded-full"
              />
              <AvatarFallback className="flex items-center justify-center text-sm text-white bg-gray-500 rounded-full">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <h1 className="mt-2 text-xs font-medium text-white truncate w-full text-center">
              {user?.username}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
