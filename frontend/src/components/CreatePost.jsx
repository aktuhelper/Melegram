;
import { readFileAsDataURL } from '@/dataurl';
import { setPosts } from '@/redux/postSlice';
import { Dialog } from '@radix-ui/react-dialog';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { DialogContent, DialogHeader } from './ui/dialog';
import { Textarea } from './ui/textarea';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState('')
  const [caption, setCaption] = useState(" ");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false)
  const {user}= useSelector(store=>store.auth)
  const {posts}=useSelector(store=>store.post)
  const dispatch= useDispatch()
  const filechangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file)
      const dataURL = await readFileAsDataURL(file);
      setImagePreview(dataURL)
    }
  }
  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true)
      // Add logic here
      const res = await axios.post('http://localhost:8512/api/v1/post/addPost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post,...posts]))
        toast.success(res.data.message)
        setOpen(false)
      }
    } catch (error) {
      // Handle error
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="bg-[#1E1E1E] text-white rounded-lg p-6 shadow-lg max-w-md mx-auto border-none"
        style={{ borderRadius: '12px' }} // Ensures proper rounding if className doesn't work
      >
        <DialogHeader className="text-center font-semibold text-lg">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center mb-4">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="Profile image" />
            <AvatarFallback className="bg-gray-700 text-white">CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm text-white">{user?.username}</h1>
            <span className="text-gray-400 text-xs">Bio here...</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none bg-[#2E2E2E] outline-none text-white rounded-md p-3"
          style={{ borderRadius: '12px' }}
          placeholder="Write a caption..."
        />
        {
          imagePreview && (
            <div className='w-full h-64 flex items-center justify-center'>
              <img src={imagePreview} alt='preview_img' className='object-cover h-full w-full rounded-lg' style={{ borderRadius: '12px' }} />
            </div>
          )
        }
        <input ref={imageRef} type="file" className="hidden" onChange={filechangeHandler} />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095f6] hover:bg-[#007ACC] text-white rounded-full py-2 px-4 outline-none mt-4"

        >
          Select Image
        </Button>
        {
          imagePreview && (
            loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait..
              </Button>
            ) : (
              <Button
                onClick={createPostHandler}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700"
              >
                Post
              </Button>
            ))
        }
      </DialogContent>
    </Dialog>
  );
};
export default CreatePost;
