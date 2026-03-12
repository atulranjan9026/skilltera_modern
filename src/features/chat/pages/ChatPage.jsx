import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getCurrentUser, getCurrentUserId, getUserType } from '../../../utils/auth';
import useChatSocket from '../hooks/useChatSocket';
import { ChatItem, MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";

// Configure axios base url to match API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function ChatPage() {
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const messageEndRef = useRef(null);

    const currentUser = getCurrentUser();
    const token = localStorage.getItem(getUserType() === 'company' ? 'companyToken' : 'candidateToken');
    const role = getUserType();

    // Fetch conversation list on load
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get(`${API_URL}/chat/conversations`, { 
                    headers: { Authorization: `Bearer ${token}` } 
                });
                if (res.data?.success) {
                    setConversations(res.data.conversations);
                }
            } catch (err) {
                console.error("Error fetching conversations", err);
            }
        };
        if (token) {
            fetchConversations();
        }
    }, [token]);

    // Setup real-time Socket.io listener
    const handleNewMessage = (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
    };

    const { sendMessage } = useChatSocket(activeConv?._id, handleNewMessage);

    // Auto scroll to bottom
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const openConversation = async (conv) => {
        setActiveConv(conv);
        try {
            // Fetch history
            const res = await axios.get(`${API_URL}/chat/messages/${conv._id}`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            if (res.data?.success) {
                setMessages(res.data.messages);
                
                // Reset local unread counter
                setConversations(prev => prev.map(c => 
                    c._id === conv._id 
                    ? { ...c, [role === 'company' ? 'companyUnread' : 'candidateUnread']: 0 } 
                    : c
                ));
            }
        } catch (err) {
            console.error("Error fetching messages", err);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !activeConv || !currentUser?._id) return;

        sendMessage({
            conversationId: activeConv._id,
            senderId: currentUser._id,
            text: inputText,
            receiverRole: role === 'company' ? 'candidate' : 'company' 
        });
        
        setInputText("");
    };

    return (
        <div className="flex h-[calc(100vh-80px)] w-full max-w-6xl mx-auto border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md my-4">
            {/* Sidebar List */}
            <div className="w-80 border-r border-gray-200 overflow-y-auto bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <h3 className="text-lg font-semibold text-gray-800 m-0">Messages</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No conversations yet</div>
                    ) : (
                        conversations.map(conv => {
                            const otherPartyName = role === 'company' 
                                ? `${conv.candidateId?.firstName || ''} ${conv.candidateId?.lastName || ''}`.trim() || 'Candidate'
                                : conv.companyId?.companyName || 'Company';
                            const unread = role === 'company' 
                                ? conv.companyUnread 
                                : conv.candidateUnread;

                            return (
                                <div key={conv._id} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                                    <ChatItem
                                        avatar={role === 'company' ? conv.candidateId?.imageLink : conv.companyId?.logoUrl}
                                        alt={otherPartyName}
                                        title={otherPartyName}
                                        subtitle={conv.jobSubject}
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
            <div className="flex-1 flex flex-col bg-white">
                {activeConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center shadow-sm z-10">
                            <div>
                                <h4 className="font-semibold text-gray-800 m-0">{activeConv.jobSubject}</h4>
                                <p className="text-sm text-gray-500 m-0">
                                    {role === 'company' 
                                        ? `${activeConv.candidateId?.firstName || ''} ${activeConv.candidateId?.lastName || ''}`
                                        : activeConv.companyId?.companyName}
                                </p>
                            </div>
                        </div>

                        {/* Message List */}
                        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 relative">
                            <div className="flex flex-col gap-2 min-h-full justify-end">
                                {messages.map((m) => {
                                    const isMine = m.senderId === currentUser._id;
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
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                        </svg>
                        <p className="text-lg">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
