import React from 'react';
import { useSelector } from 'react-redux';
import Post from './Post';

const Posts = () => {
    const { posts } = useSelector((store) => store.post);

    return (
        <div className="flex flex-col items-center justify-center gap-8 px-4 md:px-0">
            {/* Map through posts and display each Post component */}
            {posts.map((post) => (
                <Post key={post._id} post={post} />
            ))}
        </div>
    );
};

export default Posts;
