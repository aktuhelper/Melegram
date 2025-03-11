import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  if (!Array.isArray(suggestedUsers) || suggestedUsers.length === 0) {
    return null;
  }

  return (
    <div className="my-6 px-4">
      <h1 className="text-sm font-semibold text-gray-400 mb-3">Suggested for you</h1>
      <div className="space-y-4">
        {suggestedUsers.map((user) => (
          <div key={user?._id} className="flex items-center justify-between">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={user?.profilePicture}
                  alt={user?.username}
                  className="w-full h-full object-cover rounded-full"
                />
                <AvatarFallback className="w-12 h-12 flex items-center justify-center text-sm text-white bg-gray-500 rounded-full">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link to={`/profile/${user?._id}`} className="text-white font-medium text-sm hover:underline">
                  {user?.username}
                </Link>
                <p className="text-gray-400 text-xs">Suggested for you</p>
              </div>
            </div>

            {/* Follow Button */}
            <Button variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white">
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
