import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { getCurrentUser, getUserType } from '../../../utils/auth';

const useChatSocket = (conversationId, onMessageReceived) => {
    const socketRef = useRef();

    useEffect(() => {
        // Get user authentication info
        const user = getCurrentUser();
        const role = getUserType();
        console.log('useChatSocket - Initializing socket with user:', user, 'role:', role);
        
        // Extract token from localStorage (standardized with ChatPage)
        const token = localStorage.getItem('token') || 
                     localStorage.getItem('candidateToken') ||
                     localStorage.getItem('companyToken') ||
                     localStorage.getItem(role === 'company' ? 'companyToken' : 'candidateToken');

        // console.log('useChatSocket - User:', user, 'Role:', role, 'Token exists:', !!token, 'Token value:', token ? 'present' : 'null');

        if (!token || !user?._id) {
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
            // Connection established
            
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
            // Handle disconnection
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
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('send_message', messageData);
        } else {
            console.warn('WebSocket not connected, cannot send message');
        }
    };

    return { sendMessage };
};

export default useChatSocket;
