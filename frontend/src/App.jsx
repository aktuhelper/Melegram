import Signup from './components/ui/signup';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Login from './components/ui/login';
import './App.css'
import Profile from './components/ui/profile';
import EditProfile from './components/ui/EditProfile';
import ChatPage from './components/ui/ChatPage';
import { io } from 'socket.io-client'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/rtnSlice';
import ProtectedRoutes from './components/ProtectedRoutes';
const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:<ProtectedRoutes><MainLayout /></ProtectedRoutes> ,//parent element
    children: [
      {
        path: "/",
    element: <ProtectedRoutes><Home /></ProtectedRoutes>,
      },
      {
        path: "/profile/:id",
        element: <ProtectedRoutes><Profile /></ProtectedRoutes>,
      },
      {
        path: "/account/edit",
        element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>,
      },
      {
        path: "/chat",
        element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  }
]);

function App() {
  const { user } = useSelector(store => store.auth)
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socketUrl = 'https://melegram.onrender.com' || 'http://localhost:8512'; // Default to localhost for development
      const socketio = io(socketUrl, {
        query: {
          userId: user?._id
        },
        transports: ['websocket'] // Prevent calling unnecessary APIs
      });
  
      dispatch(setSocket(socketio));
  
      // Listening to events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
  
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });
  
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch, socket]);
  
  return (
    <div className="custom-scrollbar">
      <>
        <RouterProvider router={browserRouter} />
      </>
    </div>
  );
}

export default App;
