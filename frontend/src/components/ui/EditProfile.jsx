import { setAuthUser } from '@/redux/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from './button';
import { Textarea } from './textarea';

const EditProfile = () => {
  const { user } = useSelector(store => store.auth);
  const imgRef = useRef();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({                                            
    profilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender || '', // Default to empty string if gender is undefined
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePicture: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    console.log(input); // Debugging line
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender); // Fixed typo here
    if (input.profilePicture) {
      formData.append("profilePicture", input.profilePicture);
    }
   try {
     setLoading(true)
     const res= await axios.post('https://melegram.onrender.com/api/v1/user/profile/edit',formData,{
      headers:{
        'Content-Type':'multipart/form-data'
      },
      withCredentials:true
     });
     if(res.data.success){
      const updatedUserData= {
        ...user,
        bio:res.data.user?.bio,
        profilePicture:res.data.user?.profilePicture,
        gender:res.data.user.gender
      };
      dispatch(setAuthUser(updatedUserData))
      navigate(`/profile/${user?._id}`)
      toast.success(res.data.message)
     }
   } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
   } finally{
    setLoading(false)
   }
  };

  return (
    <div className='flex max-w-2xl my-20 mx-auto px-6'>
      <section className='flex flex-col gap-6 w-full my-8'>
        <h1 className='font-bold text-xl text-white'>Edit Profile</h1>

        {/* Profile Details Container with Dark Background */}
        <div className='flex items-center justify-between bg-[#1d1c1c] rounded-xl p-6'>
          <div className='flex items-center gap-3'>
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={user?.profilePicture}
                alt="profile_img"
                className="w-full h-full object-cover rounded-full"
              />
              <AvatarFallback className="flex items-center justify-center text-sm text-white bg-gray-500 rounded-full">
                CN
              </AvatarFallback>
            </Avatar>

            <div className='flex flex-col'>
              <h1 className='font-bold text-lg text-white'>{user?.username}</h1>
              <span className='text-sm text-gray-400'>{user?.bio || 'Bio here...'}</span>
            </div>
          </div>

          {/* Change Photo Button Section */}
          <div className='flex items-center'>
            <input ref={imgRef} onChange={fileChangeHandler} type='file' className='hidden' />
            <Button
              onClick={() => imgRef?.current.click()}
              className="bg-[#0095F6] h-8 px-4 rounded hover:bg-[#116eab] text-white"
            >
              Change Photo
            </Button>
          </div>
        </div>

        {/* Bio Section */}
        <div>
          <h1 className='font-bold text-xl mb-2 text-white'>Bio</h1>
          <Textarea
            name="bio"
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            className="bg-[#1d1c1c] rounded-xl border-none focus:outline-none focus:ring-0 focus:border-[#0095F6] text-white"
            placeholder="Write something about yourself"
          />
        </div>

        {/* Gender Section */}
        <div>
          <h1 className='font-bold mb-2 text-white'>Gender</h1>
          <Select value={input.gender} onValueChange={selectChangeHandler}>
  <SelectTrigger className="w-full bg-[#1d1c1c] text-white border-none rounded-xl px-4 py-2 flex items-center justify-between focus:ring-0 focus:outline-none hover:bg-[#2a2a2a]">
    {/* Dynamically display the selected gender or placeholder */}
    <SelectValue placeholder="Select gender">{input.gender || 'Select gender'}</SelectValue>
    <ChevronDown className="text-gray-400" />
  </SelectTrigger>

  <SelectContent className="bg-[#1d1c1c] text-white rounded-xl mt-2 w-full">
    <SelectGroup>
      <SelectItem value="male" className="px-4 py-2 hover:bg-[#0095F6] hover:text-white cursor-pointer">
        Male
      </SelectItem>
      <SelectItem value="female" className="px-4 py-2 hover:bg-[#0095F6] hover:text-white cursor-pointer">
        Female
      </SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

        </div>

        {/* Submit Button Section */}
        <div className='flex justify-end'>
          {loading ? (
            <Button className='w-fit bg-[#0095F6] hover:bg-[#116eab] rounded'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait..
            </Button>
          ) : (
            <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] hover:bg-[#116eab] rounded'>
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
