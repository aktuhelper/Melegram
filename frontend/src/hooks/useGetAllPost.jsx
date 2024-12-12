import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const useGetAllPost = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get('https://melegram.onrender.com/api/v1/post/all', {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.error('Error fetching posts:', error); // Updated log message
            }
        };

        fetchAllPost();
    }, [dispatch]); // Added `dispatch` as a dependency
};

export default useGetAllPost;
