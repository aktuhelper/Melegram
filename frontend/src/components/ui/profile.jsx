import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Heart, MessageCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'; // Use navigate for routing
import { Button } from './button';
import axios from 'axios'; // Ensure axios is imported
import { toast } from 'sonner';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId); // Hook to fetch user profile data

  const { userProfile, user,selectedUser } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState('posts');
  const [showMessage, setShowMessage] = useState(true); // State to show message box
  const [isFollowing, setIsFollowing] = useState(false); // State to track follow status
  const isLoggedinUserProfile = user?._id === userProfile?._id;

  // Check if the logged-in user is following the userProfile
  useEffect(() => {
    if (userProfile && user) {
      setIsFollowing(userProfile.followers.includes(user._id));
    }
  }, [userProfile, user]);

  // Function to follow or unfollow a user
  const followOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `https://melegram.onrender.com/api/v1/user/followorunfollow/${userProfile?._id}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update follow status after successful API call
        setIsFollowing((prev) => !prev); // Toggle follow status
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    }
  };

  // Hide message after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmark;

  // Use navigate for redirection
  const navigate = useNavigate();

  return (
    <div className="flex flex-col max-w-5xl my-10 mx-auto bg-[#0F0F0F] text-white px-4 sm:px-20">
      <div className="flex flex-col gap-12 sm:gap-20 p-8 w-full">
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
          {/* Avatar Section */}
          <section className="flex justify-center sm:justify-start">
            <Avatar className="h-32 w-32 rounded-full border-4 border-gray-300 overflow-hidden">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="Profile Photo"
                className="h-full w-full object-cover"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>

          {/* User Info Section */}
          <section className="flex-1">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold">{userProfile?.username}</span>

                {isLoggedinUserProfile ? (
                  <Link to="/account/edit">
                    <Button
                      variant="secondary"
                      className="bg-black border border-gray-600 text-white hover:bg-[#333] py-2 px-6 rounded-full"
                    >
                      Edit Profile
                    </Button>
                  </Link>
                ) : isFollowing ? (
                  <>
                    <Button
                      onClick={followOrUnfollow}
                      variant="secondary"
                      className="bg-black border border-gray-600 text-white hover:bg-[#333] py-2 px-6 rounded-full"
                    >
                      Unfollow
                    </Button>
                    <Button
  onClick={() => {
    // Pass the selectedUser as state to the ChatPage
    navigate('/chat'); 
  }} 
  variant="secondary" 
  className="bg-[#0095F6] hover:bg-[#0073E6] text-white py-2 px-6 rounded-full"
>
  Message
</Button>
                  </>
                ) : (
                  <Button
                    onClick={followOrUnfollow}
                    variant="secondary"
                    className="bg-[#0095F6] hover:bg-[#0073E6] text-white py-2 px-6 rounded-full"
                  >
                    Follow
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <p className="font-semibold">{userProfile?.posts.length} posts</p>
                <p className="font-semibold">{userProfile?.followers.length} followers</p>
                <p className="font-semibold">{userProfile?.following.length} following</p>
              </div>

              <div className="flex flex-col gap-2">
                <span>{userProfile?.bio || 'bio here..'}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Message Box - Displayed for 3 seconds and only on mobile */}
        {showMessage && (
          <div className="fixed top-0 left-0 w-full p-4 bg-black bg-opacity-70 text-white text-center z-50 sm:hidden">
            <span>Open in PC For Better View!</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="">
          <div className="flex justify-center gap-6 sm:gap-10 text-sm w-full">
            <span
              className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold border-b-2 border-red-600' : ''}`}
              onClick={() => handleTabChange('posts')}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold border-b-2 border-red-600' : ''}`}
              onClick={() => handleTabChange('saved')}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGS</span>
          </div>

          {/* Post Grid - Full width on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-6 mt-6 w-full">
            {displayedPost?.map((post) => (
              <div key={post?._id} className="relative group cursor-pointer w-full">
                <img
                  src={post.image}
                  alt="postimage"
                  className="rounded-lg shadow-lg w-full object-cover transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl 
                    sm:h-[200px] sm:w-full md:h-[350px] lg:h-[400px]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
