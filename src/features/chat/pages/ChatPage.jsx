import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getCurrentUser, getUserType, getCompanyId } from '../../../utils/auth';
import useChatSocket from '../hooks/useChatSocket';
import { ChatItem, MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { chatService } from '../../../services/chatService';


export default function ChatPage({ initialConversationId }) {
    const [conversations, setConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const messageEndRef = useRef(null);

    const currentUser = getCurrentUser();
    const role = getUserType();
    const token =
        localStorage.getItem('token') ||
        localStorage.getItem('candidateToken') ||
        localStorage.getItem('companyToken') ||
        (role === 'company' ? localStorage.getItem('companyToken') : localStorage.getItem('candidateToken'));

    useEffect(() => {
    }, [currentUser, role, token]);

    // Fetch conversation list on load (use shared service and normalized token)
    useEffect(() => {
        const fetchConversations = async () => {
            // console.log("Fetching conversations for user:", currentUser, "with token:", token);
            if (!currentUser || (!currentUser._id && !currentUser.id)) {
                console.warn('User not authenticated, skipping conversation fetch');
                return;
            }

            if (!token) {
                console.warn('No authentication token found, skipping conversation fetch');
                return;
            }

            // Ensure app-wide Axios instance has auth token (also supports candidateToken/companyToken fallback)
            if (!localStorage.getItem('token')) {
                localStorage.setItem('token', token);
            }

            try {
                const res = await chatService.getUserConversations();

                if (res?.success) {
                    setConversations(res.conversations);
                    setFilteredConversations(res.conversations);
                } else {
                    console.warn('Failed to fetch conversations:', res?.message);
                }
            } catch (err) {
                console.error('Error fetching conversations:', err);
                // Set empty conversations on error
                setConversations([]);
                setFilteredConversations([]);
            }
        };

        if (token) {
            fetchConversations();
        }
    }, [token, currentUser]);

    // Filter conversations based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredConversations(conversations);
            setIsSearching(false);
        } else {
            setIsSearching(true);
            const lower = searchTerm.toLowerCase();
            const filtered = conversations.filter(conv => {
                const name = role === 'company'
                    ? (conv.candidateId?.name ||
                        `${conv.candidateId?.firstName || ''} ${conv.candidateId?.lastName || ''}`.trim())
                    : conv.companyId?.companyName || '';
                return (
                    name.toLowerCase().includes(lower) ||
                    conv.jobSubject?.toLowerCase().includes(lower)
                );
            });
            setFilteredConversations(filtered);
            setIsSearching(false);
        }
    }, [searchTerm, conversations, role]);

    // Auto-select conversation if initialConversationId is provided
    useEffect(() => {
        if (conversations.length > 0 && initialConversationId) {
            const found = conversations.find(c => c._id === initialConversationId);
            if (found && activeConv?._id !== initialConversationId) {
                openConversation(found);
            }
        }
    }, [conversations, initialConversationId]);

    // Setup real-time Socket.io listener
    const handleNewMessage = (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);

        // Update unread count for the conversation if it's not the active one
        if (activeConv && newMessage.conversationId === activeConv._id) {
            // If this is the active conversation, mark as read
            const isCompanySide = ['company', 'hiring_manager', 'backup_hiring_manager', 'interviewer'].includes(role);
            setConversations(prev => prev.map(c =>
                c._id === newMessage.conversationId
                    ? { ...c, [isCompanySide ? 'companyUnread' : 'candidateUnread']: 0 }
                    : c
            ));
        } else {
            // Increment unread for other conversations
            const isCompanySide = ['company', 'hiring_manager', 'backup_hiring_manager', 'interviewer'].includes(role);
            setConversations(prev => prev.map(c =>
                c._id === newMessage.conversationId
                    ? { ...c, [isCompanySide ? 'candidateUnread' : 'companyUnread']: (c[isCompanySide ? 'candidateUnread' : 'companyUnread'] || 0) + 1 }
                    : c
            ));
        }
    };

    const { sendMessage } = useChatSocket(activeConv?._id, handleNewMessage);

    // Auto scroll to bottom
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const openConversation = async (conv) => {
        setActiveConv(conv);
        try {
            const res = await chatService.getMessages(conv._id);
            if (res?.success) {
                setMessages(res.messages);

                const isCompanySide = ['company', 'hiring_manager', 'backup_hiring_manager', 'interviewer'].includes(role);
                setConversations(prev => prev.map(c =>
                    c._id === conv._id
                        ? { ...c, [isCompanySide ? 'companyUnread' : 'candidateUnread']: 0 }
                        : c
                ));
            }
        } catch (err) {
            console.error('Error fetching messages', err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        const userId = currentUser?._id || currentUser?.id;
        const text = inputText.trim();
        if (!text || !activeConv || !userId) return;

        setInputText("");

        // Send via Socket.io
        const receiverRole = role === 'candidate' ? 'company' : 'candidate';
        sendMessage({
            conversationId: activeConv._id,
            senderId: userId,
            text,
            receiverRole
        });
    };

    const userId = currentUser?._id || currentUser?.id;
    const isAuthenticated = !!currentUser && !!userId;
    console.log("Rendering ChatPage with conversations:", conversations, "activeConv:", activeConv, "messages:", messages);
    // console.log("Current user:", currentUser, "Role:", role, "Token exists:", !!token);

    return (
        <div className="flex h-[calc(100vh-80px)] w-full max-w-6xl mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md my-4">

            {/* Sidebar */}
            <div className="w-80 border-r border-gray-200 overflow-y-auto bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Messages</h3>

                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search conversations..."
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        />
                        {isSearching && (
                            <div className="absolute right-2 top-2.5">
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                        )}
                        {searchTerm && !isSearching && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2 top-2.5 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            {conversations.length === 0 ? 'No conversations yet' : 'No conversations found'}
                        </div>
                    ) : (
                        filteredConversations.map(conv => {
                            const isCompanySide = ['company', 'hiring_manager', 'backup_hiring_manager', 'interviewer'].includes(role);
                            const otherPartyName = isCompanySide
                                ? (conv.candidateId?.name ||
                                    `${conv.candidateId?.firstName || ''} ${conv.candidateId?.lastName || ''}`.trim() ||
                                    'Candidate')
                                : conv.companyId?.companyName || 'Company';

                            const unread = isCompanySide
                                ? conv.candidateUnread
                                : conv.companyUnread;

                            return (
                                <div key={conv._id} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                                    <ChatItem
                                        avatar={
                                            isCompanySide
                                                ? (conv.candidateId?.imageLink || conv.candidateId?.avatar?.url)
                                                : (conv.companyId?.logoUrl || conv.companyId?.imageLink)
                                        }
                                        alt={otherPartyName}
                                        title={otherPartyName}
                                        subtitle={conv.jobId?.jobTitle || conv.jobSubject}
                                        unread={unread}
                                        onClick={() => openConversation(conv)}
                                        className={activeConv?._id === conv._id ? "bg-blue-50" : ""}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Window */}
            {isAuthenticated && activeConv ? (
                <div className="flex-1 flex flex-col bg-white">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center shadow-sm z-10">
                        <div>
                            <h4 className="font-semibold text-gray-800 m-0">{activeConv.jobSubject}</h4>
                            <p className="text-sm text-gray-500 m-0">
                                {role === 'company'
                                    ? (activeConv.candidateId?.name ||
                                        `${activeConv.candidateId?.firstName || ''} ${activeConv.candidateId?.lastName || ''}`.trim())
                                    : activeConv.companyId?.companyName}
                            </p>
                        </div>
                    </div>

                    {/* Message List */}
                    <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
                        <div className="flex flex-col gap-2 min-h-full justify-end">
                            {messages.map((m) => {
                                const isMine = m.senderId === userId;
                                return (
                                    <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} w-full my-1`}>
                                        <MessageBox
                                            position={isMine ? "right" : "left"}
                                            type="text"
                                            text={m.text}
                                            date={new Date(m.createdAt)}
                                            styles={{
                                                backgroundColor: isMine ? '#eff6ff' : '#ffffff',
                                                color: '#1f2937',
                                                borderRadius: '8px',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}
                                        />
                                    </div>
                                );
                            })}
                            <div ref={messageEndRef} />
                        </div>
                    </div>

                    {/* Input Form */}
                    <form className="flex p-4 border-t border-gray-200 bg-white" onSubmit={handleSend}>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="ml-3 px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow"
                        >
                            Send
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    {!isAuthenticated ? (
                        <>
                            <p className="text-lg">Please log in to access chat</p>
                            <p className="text-sm text-gray-500 mt-2">You need to be authenticated to use the chat feature</p>
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="text-sm font-semibold text-blue-800 mb-2">Authentication Required</h4>
                                <p className="text-xs text-blue-600">
                                    Please log in as a company or candidate to access messaging features
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-lg">Select a conversation</p>
                            <p className="text-sm text-gray-500 mt-2">Choose a conversation from the sidebar to start messaging</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}