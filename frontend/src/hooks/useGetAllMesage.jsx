import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '@/redux/chatSlice';

const useGetAllMessages = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((store) => store.auth);

    useEffect(() => {
        if (!selectedUser?._id) return; // Prevent the API call if `selectedUser` is null or undefined

        const fetchAllMessages = async () => {
            try {
                const res = await axios.get(
                    `https://melegram.onrender.com/api/v1/message/all/${selectedUser._id}`,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.error('Error fetching messages:', error); // Log detailed error
            }
        };

        fetchAllMessages();
    }, [selectedUser, dispatch]); // Include dispatch in the dependency array
};

export default useGetAllMessages;
