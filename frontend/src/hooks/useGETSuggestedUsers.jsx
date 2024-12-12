import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setSuggestedUsers } from '@/redux/authSlice';

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get('http://localhost:8512/api/v1/user/suggested', {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.error('Error fetching posts:', error); // Updated log message
            }
        };

        fetchSuggestedUsers();
    }, [dispatch]); // Added `dispatch` as a dependency
};

export default useGetSuggestedUsers;
