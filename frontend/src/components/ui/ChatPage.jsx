import { setSelectedUser } from '@/redux/authSlice';
import { setMessages } from '@/redux/chatSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import axios from 'axios';
import { MessageCircleCode } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './button';
import Messages from './Messages';

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef(null); // Ref for the input box
  const bottomRef = useRef(null); // Ref for scrolling to the bottom
  const dispatch = useDispatch();

  const { user = {}, suggestedUsers = [], selectedUser = null } = useSelector(store => store.auth);
  const { onlineUsers = [], messages = [] } = useSelector(store => store.chat);

  const sendMessageHandler = async (receiverId) => {
    if (!receiverId || !textMessage.trim()) {
      console.warn('Cannot send an empty message or invalid receiver.');
      return;
    }

    try {
      const res = await axios.post(
        `https://melegram.onrender.com/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage('');
      } else {
        console.warn('Message not sent, server response:', res.data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Scroll to the bottom every time messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // This effect will run every time the messages array changes

  useEffect(() => {
    return () => {
      if (selectedUser) dispatch(setSelectedUser(null)); // Clear selected user on unmount
    };
  }, [dispatch, selectedUser]);

  const addEmoji = (emojiObject) => {
    const emoji = emojiObject.emoji;

    if (inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart || textMessage.length;
      const beforeCursor = textMessage.slice(0, cursorPosition);
      const afterCursor = textMessage.slice(cursorPosition);
      const updatedMessage = `${beforeCursor}${emoji}${afterCursor}`;
      setTextMessage(updatedMessage);

      // Move cursor to the correct position
      setTimeout(() => {
        inputRef.current.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
      }, 0);
    }
  };

  return (
    <div className="flex ml-[16%] h-screen bg-[#0F0F0F] text-gray-200">
      {/* Left sidebar with suggested users */}
      <section className="w-full md:w-1/4 my-8 px-4 py-2">
        <h1 className="font-bold mb-4 text-xl text-white">{user?.username}</h1>
        <hr className="mb-6 border-gray-700" />
        <div className="overflow-y-auto h-[80vh] space-y-3">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);

            return (
              <div
                key={suggestedUser?._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex gap-3 items-center p-4 hover:bg-gray-800 cursor-pointer rounded-lg transition-all duration-200"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    className="w-full h-full object-cover rounded-full"
                  />
                  <AvatarFallback className="bg-gray-500 text-white">CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-white">{suggestedUser?.username}</span>
                  <span
                    className={`text-sm font-bold ${isOnline ? 'text-green-400' : 'text-red-500'}`}
                  >
                    {isOnline ? 'online' : 'offline'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Right section for chatting */}
      {selectedUser ? (
        <section className="flex-1 border-l border-gray-700 flex flex-col h-full">
          <div className="flex gap-3 items-center px-4 py-3 border-b border-gray-700 sticky top-0 bg-[#121212] z-10 shadow-md">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={selectedUser?.profilePicture}
                alt="profile"
                className="w-full h-full object-cover rounded-full"
              />
              <AvatarFallback className="bg-gray-500 text-white">CN</AvatarFallback>
            </Avatar>
            <span className="text-white font-medium text-lg">{selectedUser?.username}</span>
          </div>

          <Messages selectedUser={selectedUser} />

          {/* Message Input Section with Emoji Picker on Left */}
          <div className="flex items-center p-4 border-t border-gray-700 bg-[#121212] relative">
            <div className="relative flex flex-1 items-center">
              {/* Emoji Button */}
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="absolute left-3 text-gray-400 hover:text-gray-200 transition duration-200"
              >
                😊
              </button>
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 left-4 z-50">
                  <EmojiPicker
                    onEmojiClick={addEmoji}
                    theme="dark"
                    style={{
                      fontSize: '1.5em',
                      width: '350px',  // Adjust the width of the emoji picker
                      height: '300px', // Adjust the height of the emoji picker
                    }}
                  />
                </div>
              )}
              {/* Input Field */}
              <input
                ref={inputRef}
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                className="flex-1 bg-[#1E1E1E] text-gray-200 focus:ring-0 focus:outline-none p-3 rounded-lg pl-12"
                placeholder="Message..."
              />
            </div>
            {/* Send Button */}
            <Button
              onClick={() => sendMessageHandler(selectedUser?._id)}
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg ml-4 transition-all duration-200"
            >
              Send
            </Button>
          </div>

          {/* This is where we attach the scroll target */}
          <div ref={bottomRef} />
        </section>
      ) : (
        // If no user selected, display the welcome screen
        <div className="flex flex-col items-center justify-center mx-auto text-gray-400">
          <MessageCircleCode className="w-32 h-32 my-4 text-gray-500" />
          <h1 className="font-medium text-2xl text-gray-200">Your Messages</h1>
          <span className="text-lg">Send a message to start a chat</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
