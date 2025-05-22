import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Heart, Home, LogOut, MessageCircle, PlusSquare } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { setPosts } from '@/redux/postSlice';
import { Button } from './ui/button';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get('https://melegram.onrender.com/api/v1/user/logout', {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPosts([]));
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === 'Logout') {
      logoutHandler();
    } else if (textType === 'Create') {
      setOpen(true);
    } else if (textType === 'Profile') {
      navigate(`/profile/${user?._id}`);
    } else if (textType === 'Home') {
      navigate('/');
    } else if (textType === 'Messages') {
      window.location.href = 'https://chattsphere.vercel.app/chat';
    }
  };

  const sidebarItems = [
    { icon: <Home size={22} />, text: 'Home' },
    { icon: <MessageCircle size={22} />, text: 'Messages' },
    { icon: <PlusSquare size={22} />, text: 'Create' },
    {
      icon: (
        <Avatar className="w-8 h-8">
          <AvatarImage
            src={user?.profilePicture || '/default-avatar.png'}
            alt="@profile"
            className="rounded-full object-cover"
          />
          <AvatarFallback className="bg-gray-600 text-white text-sm font-bold rounded-full flex items-center justify-center w-full h-full">
            CN
          </AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
    { icon: <LogOut size={22} />, text: 'Logout' },
  ];

  return (
    <div>
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex fixed top-4 left-0 z-10 w-16 h-[90vh] bg-[#141414] border border-[#1F1F1F] rounded-t-2xl rounded-b-2xl flex-col justify-between items-center py-6 shadow-lg">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <h1
            className="mb-8 font-bold text-2xl text-[#FF6F61]"
            style={{ fontFamily: 'Pacifico, cursive' }}
          >
            C
          </h1>
        </div>

        {/* Icons */}
        <div className="flex flex-col gap-6 items-center text-white">
          {sidebarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center justify-center hover:bg-[#1F1F1F] transition-colors duration-200 cursor-pointer rounded-lg w-12 h-12"
            >
              {item.icon}
            </div>
          ))}
        </div>

        <div />
      </div>

      {/* Bottom navigation for smaller screens */}
      <div className="fixed bottom-0 left-0 z-10 w-full bg-[#141414] text-white md:hidden flex justify-around items-center py-3 border-t border-[#1F1F1F]">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => sidebarHandler(item.text)}
            className="flex items-center justify-center cursor-pointer hover:bg-[#1F1F1F] p-2 rounded-lg"
          >
            {item.icon}
          </div>
        ))}
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
