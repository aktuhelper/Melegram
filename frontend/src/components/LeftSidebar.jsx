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
      const res = await axios.get('https://melegram.onrender.com/api/v1/user/logout', { withCredentials: true });
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
      navigate('/http://localhost:5173/login');
    }
  };

  const handleNotificationClick = () => {
    likeNotification.forEach((notification) => {
      dispatch(markNotificationAsSeen(notification.id));
    });
    dispatch(clearSeenNotifications());
  };

  const sidebarItems = [
    { icon: <Home />, text: 'Home' },
    { icon: <MessageCircle />, text: 'Messages' },
    { icon: <PlusSquare />, text: 'Create' },
    { icon: <Heart />, text: 'Notifications' },
    {
      icon: (
        <Avatar className="w-10 h-10 flex items-center justify-center">
          <AvatarImage
            src={user?.profilePicture || '/default-avatar.png'}
            alt="@shadecn"
            className="w-full h-full rounded-full object-cover"
          />
          <AvatarFallback className="w-full h-full flex items-center justify-center bg-gray-600 text-white text-sm font-bold rounded-full">
            CN
          </AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
    { icon: <LogOut />, text: 'Logout' },
  ];

  return (
    <div>
      {/* Sidebar for larger screens */}
      <div className="hidden md:block fixed top-0 left-0 z-10 w-[16%] h-screen bg-[#0F0F0F] text-white border-r border-gray-700 flex flex-col justify-between">
        <div className="flex flex-col">
          <h1
            className="my-8 pl-3 font-bold text-3xl text-[#FF6F61] tracking-wide"
            style={{ fontFamily: 'Pacifico, cursive' }}
          >
            Chattsphere
          </h1>
        </div>
        {sidebarItems.map((item, index) => (
          <div
            onClick={() => sidebarHandler(item.text)}
            key={index}
            className="flex items-center gap-3 relative hover:bg-gray-800 cursor-pointer rounded-lg p-3 my-3"
          >
            {item.icon}
            <span>{item.text}</span>
            {item.text === 'Notifications' && likeNotification.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    className="rounded-full h-5 w-5 bg-red-500 hover:bg-red-500 absolute bottom-6 left-6 text-xs text-white"
                  >
                    {likeNotification.length}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="popover-content p-2 rounded-md shadow-md bg-[#1A1A1A] text-white border-0 outline-none w-full max-w-[300px] md:max-w-[400px]">
                  <div>
                    {likeNotification.length === 0 ? (
                      <p>No new notifications</p>
                    ) : (
                      likeNotification.map((notification) => (
                        <div
                          key={notification.userId}
                          className="flex items-center gap-2 p-2 border-b border-gray-700"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              className="rounded-full"
                              src={notification.userDetails?.profilePicture || '/default-avatar.png'}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-bold">{notification.userDetails?.username}</span> liked your post
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <Button
                    onClick={handleNotificationClick}
                    className="mt-2 w-full bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    Mark as Seen
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        ))}
      </div>

      {/* Bottom navigation for smaller screens */}
      <div className="fixed bottom-0 left-0 z-10 w-full bg-[#0F0F0F] text-white md:hidden flex justify-around items-center py-3 border-t border-gray-700">
        {sidebarItems.slice(0, 6).map((item, index) => (
          <div
            key={index}
            onClick={() => sidebarHandler(item.text)}
            className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 p-2 rounded-lg"
          >
            {item.icon}
            <span className="text-xs">{item.text}</span>
          </div>
        ))}
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
