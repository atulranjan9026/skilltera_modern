import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, Send, Search } from 'lucide-react';
import { getCurrentUser, getUserType } from '../../../utils/auth';
import useChatSocket from '../hooks/useChatSocket';
import { chatService } from '../../../services/chatService';

const decodeJWT = (token) => {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
};

const COMPANY_ROLES = ['interviewer', 'hiring_manager', 'backup_hiring_manager'];

function getInitials(name = '') {
    return name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';
}

const AVATAR_COLORS = [
    { bg: 'bg-orange-100', text: 'text-orange-700' },
    { bg: 'bg-blue-100', text: 'text-blue-700' },
    { bg: 'bg-green-100', text: 'text-green-700' },
    { bg: 'bg-purple-100', text: 'text-purple-700' },
    { bg: 'bg-pink-100', text: 'text-pink-700' },
];

function avatarColor(str = '') {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Avatar({ name = '', imageUrl, size = 'md' }) {
    const initials = getInitials(name);
    const { bg, text } = avatarColor(name);
    const sizeClass = size === 'sm' ? 'w-9 h-9 text-xs' : 'w-10 h-10 text-sm';

    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt={name}
                className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
            />
        );
    }
    return (
        <div className={`${sizeClass} ${bg} ${text} rounded-full flex items-center justify-center font-medium flex-shrink-0`}>
            {initials}
        </div>
    );
}

function formatTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatPage({ initialConversationId }) {
    const [conversations, setConversations] = useState([]);
    const [filteredConversations, setFilteredConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const messageEndRef = useRef(null);

    const currentUser = useMemo(() => getCurrentUser(), []);
    const token = useMemo(() =>
        localStorage.getItem('token') ||
        localStorage.getItem('candidateToken') ||
        localStorage.getItem('companyToken')
        , []);
    const role = useMemo(() => decodeJWT(token)?.role || getUserType(), [token]);
    const isCompanySide = useMemo(() => COMPANY_ROLES.includes(role), [role]);
    const userId = useMemo(() => currentUser?._id || currentUser?.id, [currentUser]);
    const isAuthenticated = !!currentUser && !!userId;

    const handleNewMessage = useCallback((newMessage) => {
        setMessages(prev => [...prev, newMessage]);
        setConversations(prev => prev.map(c =>
            c._id === newMessage.conversationId
                ? {
                    ...c,
                    [isCompanySide ? 'companyUnread' : 'candidateUnread']:
                        activeConv?._id === newMessage.conversationId
                            ? 0
                            : (c[isCompanySide ? 'companyUnread' : 'candidateUnread'] || 0) + 1,
                }
                : c
        ));
    }, [isCompanySide, activeConv?._id]);

    const { sendMessage } = useChatSocket(activeConv?._id, handleNewMessage);

    // Fetch conversations
    useEffect(() => {
        if (!currentUser || !userId || !token) return;
        if (!localStorage.getItem('token')) localStorage.setItem('token', token);
        (async () => {
            try {
                const res = await chatService.getUserConversations();
                const list = res?.success ? res.conversations : [];
                setConversations(list);
                setFilteredConversations(list);
            } catch {
                setConversations([]);
                setFilteredConversations([]);
            }
        })();
    }, [token, currentUser, userId]);

    // Filter by search
    useEffect(() => {
        if (!searchTerm.trim()) { setFilteredConversations(conversations); return; }
        const lower = searchTerm.toLowerCase();
        setFilteredConversations(conversations.filter(conv => {
            const name = isCompanySide
                ? (conv.candidateId?.name || `${conv.candidateId?.firstName || ''} ${conv.candidateId?.lastName || ''}`.trim())
                : conv.companyId?.companyName || '';
            return name.toLowerCase().includes(lower) || conv.jobSubject?.toLowerCase().includes(lower);
        }));
    }, [searchTerm, conversations, isCompanySide]);

    // Auto-select initial conversation
    useEffect(() => {
        if (!conversations.length || !initialConversationId) return;
        const found = conversations.find(c => c._id === initialConversationId);
        if (found && activeConv?._id !== initialConversationId) openConversation(found);
    }, [conversations, initialConversationId]);

    // Auto-scroll
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const openConversation = async (conv) => {
        setActiveConv(conv);
        try {
            const res = await chatService.getMessages(conv._id);
            if (res?.success) {
                setMessages(res.messages);
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
        e?.preventDefault();
        const text = inputText.trim();
        if (!text || !activeConv || !userId) return;
        setInputText('');
        sendMessage({
            conversationId: activeConv._id,
            jobId: activeConv.jobId?._id || activeConv.jobId,
            senderId: userId,
            text,
            receiverRole: isCompanySide ? 'candidate' : 'company',
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) handleSend(e);
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const getPartyName = (conv) => isCompanySide
        ? (conv.candidateId?.name ||
            `${conv.candidateId?.firstName || ''} ${conv.candidateId?.lastName || ''}`.trim() ||
            'Candidate')
        : conv.companyId?.companyName || 'Company';

    const getPartyImage = (conv) => isCompanySide
        ? (conv.candidateId?.imageLink || conv.candidateId?.avatar?.url)
        : (conv.companyId?.logoUrl || conv.companyId?.imageLink);

    const getUnread = (conv) =>
        isCompanySide ? conv.companyUnread : conv.candidateUnread;

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="flex h-[calc(100vh-80px)] w-full max-w-6xl mx-auto my-4 rounded-2xl overflow-hidden shadow-xl border border-slate-200">

            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <div className="w-72 flex-shrink-0 flex flex-col bg-white border-r border-slate-200">

                {/* Header */}
                <div className="px-4 pt-5 pb-4 border-b border-slate-200">
                    <h2 className="text-slate-800 font-semibold text-lg mb-3 tracking-tight">Messages</h2>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search conversations…"
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 pl-8 pr-8 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto py-2">
                    {filteredConversations.length === 0 ? (
                        <p className="text-center text-slate-400 text-sm mt-8 px-4">
                            {conversations.length === 0 ? 'No conversations yet' : 'No results found'}
                        </p>
                    ) : (
                        filteredConversations.map(conv => {
                            const name = getPartyName(conv);
                            const image = getPartyImage(conv);
                            const unread = getUnread(conv);
                            const isActive = activeConv?._id === conv._id;

                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => openConversation(conv)}
                                    className={`relative flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
                                        ${isActive
                                            ? 'bg-primary-50 border-r-2 border-primary-500'
                                            : 'hover:bg-slate-50'
                                        }`}
                                >
                                    <Avatar name={name} imageUrl={image} size="sm" />

                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${isActive ? 'text-primary-700' : 'text-slate-800'}`}>
                                            {name}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate mt-0.5">
                                            {conv.jobId?.jobTitle || conv.jobSubject || ''}
                                        </p>
                                    </div>

                                    {!!unread && (
                                        <span className="flex-shrink-0 bg-primary-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                            {unread}
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── Chat window ───────────────────────────────────────────── */}
            {isAuthenticated && activeConv ? (
                <div className="flex-1 flex flex-col min-w-0 bg-white">

                    {/* Chat header */}
                    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-200 bg-white">
                        <Avatar name={getPartyName(activeConv)} imageUrl={getPartyImage(activeConv)} />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-slate-800 truncate">
                                {getPartyName(activeConv)}
                            </h3>
                            <p className="text-xs text-slate-500 truncate">
                                {activeConv.jobId?.jobTitle || activeConv.jobSubject}
                            </p>
                        </div>
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400 ring-2 ring-white" title="Online" />
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 bg-slate-50 flex flex-col gap-2.5 scrollbar-thin scrollbar-thumb-slate-200">
                        {messages.map((m) => {
                            const isMine = m.senderId === userId;
                            return (
                                <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[68%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                                            ${isMine
                                                ? 'bg-primary-500 text-white rounded-br-sm'
                                                : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm'
                                            }`}
                                        >
                                            {m.text}
                                        </div>
                                        <span className={`text-[10px] mt-1 ${isMine ? 'text-slate-400' : 'text-slate-400'}`}>
                                            {formatTime(m.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messageEndRef} />
                    </div>

                    {/* Input bar */}
                    <form
                        onSubmit={handleSend}
                        className="flex items-center gap-3 px-4 py-3 border-t border-slate-200 bg-white"
                    >
                        <input
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message…"
                            className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
                        >
                            <Send size={16} className="text-white translate-x-px" />
                        </button>
                    </form>
                </div>
            ) : (
                /* Empty state */
                <div className="flex-1 flex flex-col items-center justify-center bg-white text-slate-400 gap-3">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    {!isAuthenticated ? (
                        <>
                            <p className="text-base font-medium text-slate-600">Please log in</p>
                            <p className="text-sm text-slate-400">You need to be authenticated to use chat</p>
                        </>
                    ) : (
                        <>
                            <p className="text-base font-medium text-slate-600">No conversation selected</p>
                            <p className="text-sm text-slate-400">Pick a conversation from the sidebar</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}