import React from 'react';
import Posts from './Posts';

const Feed = () => {
  return (
    <div className="flex-1 my-20 flex flex-col items-center pl-[2%] md:pl-100 sm:pl-10">
      <Posts />
    </div>
  );
}

export default Feed;
