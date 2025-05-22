import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import "../Post.css"
import { Navigate, useNavigate } from 'react-router-dom';
const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const { posts } = useSelector((store) => store.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const [likeAnimation, setLikeAnimation] = useState(false);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        setText(inputText.trim() ? inputText : "");
    };

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`https://melegram.onrender.com/api/v1/post/delete/${post?._id}`, { withCredentials: true });
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };
        const bookmarkHandler= async()=>{
            try {
                const res= await axios.get(`https://melegram.onrender.com/api/v1/post/${post?._id}/bookmark`, { withCredentials: true })
                if(res.data.success){
                    toast.success(res.data.message)
                }
            } catch (error) {
                 console.log(error)
            }
        }
    const commentHandler = async () => {
        try {
            const res = await axios.post(`https://melegram.onrender.com/api/v1/post/${post?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const likeorDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`https://melegram.onrender.com/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                if (!liked) setLikeAnimation(true);
                setTimeout(() => setLikeAnimation(false), 500);

                const updatedPostData = posts.map((p) =>
                    p._id === post._id
                        ? { ...p, likes: liked ? p.likes.filter((id) => id !== user._id) : [...p.likes, user._id] }
                        : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const navigate = useNavigate();
return (
  <div className="w-full max-w-[600px] mx-auto bg-[#1A1A1A] text-gray-300 p-6 rounded-xl shadow-md mb-6">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Avatar className="w-12 h-12 rounded-full overflow-hidden">
          <AvatarImage src={post.author?.profilePicture} alt="post_image" />
          <AvatarFallback className="text-gray-300 bg-gray-600">CN</AvatarFallback>
        </Avatar>
        <div className='flex items-center gap-2'>
          <h1 className="text-gray-200 font-medium">{post.author?.username}</h1>
          {user?._id === post.author._id && <Badge variant="Secondary">Author</Badge>}
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <MoreHorizontal className="cursor-pointer text-gray-400 hover:text-gray-200" />
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center text-sm text-gray-300 bg-[#1A1A1A] p-4 rounded-lg">
          {post?.author?._id !== user?._id && (
            <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold hover:bg-[#1F1F1F] hover:text-[#FF6666]">
              Unfollow
            </Button>
          )}
          {user && user?._id === post?.author._id && (
            <Button
              onClick={deletePostHandler}
              variant="ghost"
              className="cursor-pointer w-fit text-gray-300 hover:bg-[#1F1F1F] hover:text-white"
            >
              Delete Post
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>

    {/* Post Image */}
    <img
      className="rounded-[12px] my-2 w-full object-cover"
      src={post.image}
      alt="post_img"
    />

    {/* Post Actions */}
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-4">
        {liked ? (
          <FaHeart
            onClick={likeorDislikeHandler}
            size={'24'}
            className={`cursor-pointer text-red-600 ${likeAnimation ? 'like-animation' : ''}`}
          />
        ) : (
          <FaRegHeart
            onClick={likeorDislikeHandler}
            size="22px"
            className="cursor-pointer text-gray-400 hover:text-[#FF6666]"
          />
        )}
        <MessageCircle onClick={() => {
          dispatch(setSelectedPost(post))
          setOpen(true)
        }} className="cursor-pointer text-gray-400 hover:text-gray-200" />
        <Send onClick={() => navigate('/chat')} className="cursor-pointer text-gray-400 hover:text-gray-200" />
      </div>
      <Bookmark onClick={bookmarkHandler} className="cursor-pointer text-gray-400 hover:text-gray-200" />
    </div>

    {/* Post Info */}
    <div className="text-sm text-gray-300 mb-2">
      <span className="font-medium text-gray-200 mr-2">{postLike} likes</span>
      <p className="line-clamp-2">{post.caption}</p>
    </div>

    {comment.length > 0 && (
      <span onClick={() => {
        dispatch(setSelectedPost(post))
        setOpen(true)
      }} className="text-gray-400 hover:text-gray-200 cursor-pointer text-sm">
        {comment.length} comments
      </span>
    )}

    {/* Comment Section */}
    <CommentDialog open={open} setOpen={setOpen} />
    <div className="mt-4 flex items-center justify-between">
      <input
        type="text"
        placeholder="Add a comment..."
        value={text}
        onChange={changeEventHandler}
        className="outline-none text-sm w-full bg-[#262626] text-gray-300 p-2 rounded-md placeholder-gray-500"
      />
      {text && (
        <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer hover:text-[#5BC2FF] ml-2">
          Post
        </span>
      )}
    </div>
  </div>
);

};

export default Post;
