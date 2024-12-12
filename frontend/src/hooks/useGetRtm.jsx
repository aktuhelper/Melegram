import { setMessages } from "@/redux/chatSlice";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    const messages = useSelector(store => store.chat.messages);

    // Memoize the setMessages dispatch function to prevent unnecessary re-renders
    const setMessagesHandler = useCallback((newMessage) => {
        dispatch(setMessages([...messages, newMessage]));
    }, [dispatch, messages]);

    useEffect(() => {
        if (socket) {
            // Listen for the 'newMessage' event
            socket.on('newMessage', setMessagesHandler);

            // Clean up the event listener on component unmount
            return () => {
                socket.off('newMessage', setMessagesHandler);
            };
        }
    }, [socket, setMessagesHandler]); // Only re-run when socket or setMessagesHandler changes
};

export default useGetRTM;
