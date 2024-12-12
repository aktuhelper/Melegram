import useGetAllPost from '@/hooks/useGetAllPost';
import useGetSuggestedUsers from '@/hooks/useGETSuggestedUsers';
import React from 'react';
import { Outlet } from 'react-router';
import Feed from './Feed';
import RightSidebar from './RightSidebar';
import SuggestedUsers from './SuggestedUsers'; // Import SuggestedUsers

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();

  return (
    <div className="flex flex-col">
      {/* SuggestedUsers visible only on mobile and tablet */}
      <div className="lg:hidden">
        <SuggestedUsers />
      </div>
      <div className="flex">
        <div className="flex-grow">
          <Feed />
          <Outlet />
        </div>
        {/* RightSidebar visible only on PC */}
        <div className="hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
