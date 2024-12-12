import { Avatar } from '@radix-ui/react-avatar';
import { Dialog } from '@radix-ui/react-dialog';
import axios from 'axios';
import { MoreHorizontal } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { toast } from 'sonner';
import Comment from './Comment';
import { AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { DialogContent, DialogTrigger } from './ui/dialog';
import "../commentDialog.css";  // Importing the updated CSS

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [comment, setComment] = useState([]);

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : " ");
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `https://melegram.onrender.com/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="comment-dialog flex flex-col bg-[#0F0F0F] text-white rounded-lg"
      >
        <div className="flex flex-1">
          {/* Image Section */}
          <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full object-cover rounded-lg"  // Ensures the image has rounded corners
            />
          </div>

          {/* Content Section */}
          <div className="w-1/2 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              {/* Avatar and Username */}
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar
                    className="relative avatar overflow-hidden rounded-full border border-gray-600"
                    style={{
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AvatarImage
                      src={selectedPost?.author?.profilePicture}
                      alt="Profile Picture"
                      className="w-full h-full rounded-full object-cover"
                    />
                    <AvatarFallback
                      className="absolute inset-0 flex items-center justify-center bg-gray-500 text-white text-sm font-medium rounded-full"
                    >
                      CN
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-sm text-[#3BADF8]">
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>

              {/* Options Dropdown */}
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer text-white hover:text-[#FF6F61] transition-colors duration-200 rounded-md" />
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A1A] flex flex-col items-center text-sm text-center text-white p-4 rounded-lg"> {/* Ensure dropdown is rounded */}
                  <div className="cursor-pointer hover:text-[#FF6F61] transition-colors duration-200 rounded-md">
                    Unfollow
                  </div>
                  <div className="cursor-pointer hover:text-[#FF6F61] transition-colors duration-200 rounded-md">
                    Add to Favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />

            {/* Comments Section */}
            <div className="comments-section flex-1 overflow-y-auto max-h-96 p-4 custom-scrollbar">
              {
                comment.map((comment) => <Comment key={comment._id} comment={comment} />)
              }
            </div>

            {/* Add Comment Section */}
            <div className="input-wrapper p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment..."
                  className="w-full outline-none bg-[#0F0F0F] text-white placeholder-gray-500 border border-gray-600 p-2 rounded-md" // Rounded input box
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                  className="text-white bg-[#0F0F0F] border-gray-600 hover:border-[#3BADF8] rounded-md" // Rounded button
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
