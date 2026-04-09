import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { getCurrentUser, getUserType } from '../../../utils/auth';

const decodeJWT = (token) => {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
};

// ✅ FIX 10: mirrors COMPANY_ROLES from backend — hiring_manager etc. are all valid
const COMPANY_ROLES = ['interviewer', 'hiring_manager', 'backup_hiring_manager'];

const useChatSocket = (conversationId, onMessageReceived) => {
    const socketRef = useRef(null);

    useEffect(() => {
        const user  = getCurrentUser();
        const token = localStorage.getItem('token')          ||
                      localStorage.getItem('candidateToken') ||
                      localStorage.getItem('companyToken');

        if (!token) {
            console.warn('[useChatSocket] Skipped: No token found');
            return;
        }

        const decoded = decodeJWT(token);
        // ✅ FIX 11: role must come from the JWT, not the client-side getUserType()
        //            (getUserType() can return 'company' which the backend rejects)
        const role = decoded?.role || getUserType();

        if (!user?._id) {
            console.warn('[useChatSocket] Skipped: No user ID');
            return;
        }

        const API_URL   = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const socketUrl = API_URL.endsWith('/api/v1/') ? API_URL.slice(0, -8) : API_URL;

        // console.log('[useChatSocket] Connecting to:', socketUrl, '| role:', role);

        socketRef.current = io(socketUrl, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            auth:  { token, userId: user._id, role },
            query: { token },
        });

        socketRef.current.on('connect', () => {
            console.log('[useChatSocket] ✓ Connected - ID:', socketRef.current.id);

            if (conversationId) {
                // console.log('[useChatSocket] Joining conversation:', conversationId);
                socketRef.current.emit('join_conversation', {
                    conversationId,
                    userId: user._id,
                    role,
                });
            }
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('[useChatSocket] ✗ Connection error:', err?.message || err);
        });

        socketRef.current.on('disconnect', (reason) => {
            // console.log('[useChatSocket] Disconnected:', reason);
        });

        socketRef.current.on('error', (err) => {
            console.error('[useChatSocket] Server error:', err);
        });

        if (conversationId) {
            socketRef.current.on('receive_message', (msg) => {
                // console.log('[useChatSocket] Message received:', msg?._id);
                onMessageReceived(msg);
            });
        }

        return () => {
            socketRef.current?.disconnect();
        };
        // onMessageReceived intentionally omitted — wrap in useCallback at call site
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationId]);

    const sendMessage = (messageData) => {
        if (socketRef.current?.connected) {
            // console.log('[useChatSocket] Sending:', messageData.conversationId);
            socketRef.current.emit('send_message', messageData);
        } else {
            console.error('[useChatSocket] ✗ Not connected — cannot send');
        }
    };

    return { sendMessage };
};

export default useChatSocket;