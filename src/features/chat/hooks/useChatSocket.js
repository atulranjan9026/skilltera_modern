import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { getCurrentUser, getUserType } from '../../../utils/auth';

const useChatSocket = (conversationId, onMessageReceived) => {
    const socketRef = useRef();

    useEffect(() => {
        // Get user authentication info
        const user = getCurrentUser();
        const role = getUserType();
        const token = localStorage.getItem('token') || 
                     localStorage.getItem(role === 'company' ? 'companyToken' : 'candidateToken');

        // Temporarily disable WebSocket until backend Socket.IO is properly configured
        console.log('WebSocket temporarily disabled - backend Socket.IO not configured');
        return;

        if (!token || !user) {
            console.warn('No authentication token found for WebSocket connection');
            return;
        }

        // Connect to your backend socket endpoint with authentication
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        socketRef.current = io(API_URL, {
            auth: {
                token: token,
                userId: user._id,
                role: role
            },
            query: {
                token: token
            }
        });

        // Connection established
        socketRef.current.on('connect', () => {
            console.log('WebSocket connected successfully');
            
            if (conversationId) {
                socketRef.current.emit('join_conversation', {
                    conversationId,
                    userId: user._id,
                    role: role
                });
            }
        });

        // Handle connection errors
        socketRef.current.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });

        // Handle disconnection
        socketRef.current.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
        });

        if (conversationId) {
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
        // Temporarily disable sending messages via WebSocket
        console.log('WebSocket temporarily disabled - message not sent:', messageData);
        
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('send_message', messageData);
        } else {
            console.warn('WebSocket not connected, cannot send message');
        }
    };

    return { sendMessage };
};

export default useChatSocket;
