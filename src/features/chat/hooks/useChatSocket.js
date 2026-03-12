import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useChatSocket = (conversationId, onMessageReceived) => {
    const socketRef = useRef();

    useEffect(() => {
        // Connect to your backend socket endpoint
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        socketRef.current = io(API_URL);

        if (conversationId) {
            socketRef.current.emit('join_conversation', conversationId);
            
            socketRef.current.on('receive_message', (newMessage) => {
                onMessageReceived(newMessage);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [conversationId, onMessageReceived]);

    const sendMessage = (messageData) => {
        if (socketRef.current) {
            socketRef.current.emit('send_message', messageData);
        }
    };

    return { sendMessage };
};

export default useChatSocket;
