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
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Button } from './ui/button';
import { clearSeenNotifications, markNotificationAsSeen } from '@/redux/rtnSlice';

const LeftSidebar = () => {
  const { likeNotification } = useSelector((store) => store.realTimeNotification);
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

  const handleNotificationClick = () => {
    likeNotification.forEach((notification) => {
      dispatch(markNotificationAsSeen(notification.id));
    });
    dispatch(clearSeenNotifications());
  };

  const sidebarItems = [
    { icon: <Home size={22} />, text: 'Home' },
    { icon: <MessageCircle size={22} />, text: 'Messages' },
    { icon: <PlusSquare size={22} />, text: 'Create' },
    { icon: <Heart size={22} />, text: 'Notifications' },
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
  <div className="hidden md:flex fixed top-4 left-0 z-10 w-16 h-[90vh] bg-white/10 backdrop-blur-md border border-white/20 rounded-t-2xl rounded-b-2xl flex-col justify-between items-center py-6 shadow-lg">

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
        <div className="flex flex-col gap-6 items-center">
          {sidebarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="relative flex items-center justify-center hover:bg-white/20 transition-colors duration-200 cursor-pointer rounded-lg w-12 h-12"
            >
              {item.icon}
              {item.text === 'Notifications' && likeNotification.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 hover:bg-red-500 text-xs text-white rounded-full z-20"
                    >
                      {likeNotification.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-2 rounded-md shadow-md bg-white/10 backdrop-blur-md text-white border border-white/10 w-72">
                    <div>
                      {likeNotification.length === 0 ? (
                        <p>No new notifications</p>
                      ) : (
                        likeNotification.map((notification) => (
                          <div
                            key={notification.userId}
                            className="flex items-center gap-2 p-2 border-b border-white/10"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                className="rounded-full"
                                src={notification.userDetails?.profilePicture || '/default-avatar.png'}
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">
                              <span className="font-bold">{notification.userDetails?.username}</span>{' '}
                              liked your post
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <Button
                      onClick={handleNotificationClick}
                      className="mt-2 w-full bg-white/20 hover:bg-white/30 text-white"
                    >
                      Mark as Seen
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>

        <div />
      </div>

      {/* Bottom navigation for smaller screens */}
      <div className="fixed bottom-0 left-0 z-10 w-full bg-white/10 backdrop-blur-md text-white md:hidden flex justify-around items-center py-3 border-t border-white/20">
        {sidebarItems.slice(0, 6).map((item, index) => (
          <div
            key={index}
            onClick={() => sidebarHandler(item.text)}
            className="flex items-center justify-center cursor-pointer hover:bg-white/20 p-2 rounded-lg"
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
