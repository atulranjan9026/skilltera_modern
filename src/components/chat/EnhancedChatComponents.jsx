import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, MessageSquare, Video, Calendar, Send, Paperclip, Smile, MoreVertical, Phone } from 'lucide-react';
import { tokens } from '../../styles/designTokens';

// Enhanced Chat Component with Search
export const EnhancedChatComponent = ({ user, initialMessages = [] }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef(null);

  // Filter messages based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMessages(messages);
    } else {
      const filtered = messages.filter(message => {
        const text = message.content.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return text.includes(searchLower);
      });
      setFilteredMessages(filtered);
    }
  }, [searchTerm, messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !user) return;

    const newMessage = {
      id: Date.now(),
      content: inputText.trim(),
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const Message = ({ message, isOwn }) => {
    const formatTime = (timestamp) => {
      return timestamp.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'sent':
          return <span style={{ color: tokens.colors.secondary[400] }}>✓</span>;
        case 'delivered':
          return <span style={{ color: tokens.colors.secondary[400] }}>✓✓</span>;
        case 'read':
          return <span style={{ color: tokens.colors.primary[500] }}>✓✓</span>;
        default:
          return null;
      }
    };

    return (
      <div
        className={`message ${isOwn ? 'own' : 'other'}`}
        style={{
          display: 'flex',
          justifyContent: isOwn ? 'flex-end' : 'flex-start',
          marginBottom: tokens.spacing[3],
        }}
      >
        <div style={{ maxWidth: '70%', display: 'flex', flexDirection: isOwn ? 'align-items' : 'flex-end' }}>
          {!isOwn && (
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%',
              backgroundColor: tokens.colors.primary[500],
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: tokens.typography.fontSize.sm[0],
              fontWeight: tokens.typography.fontWeight.bold,
              marginRight: tokens.spacing[2],
              flexShrink: 0,
            }}>
              {message.senderAvatar}
            </div>
          )}
          
          <div>
            {!isOwn && (
              <div style={{ 
                fontSize: tokens.typography.fontSize.xs[0], 
                color: tokens.colors.secondary[600],
                marginBottom: tokens.spacing[1],
                marginLeft: isOwn ? 'auto' : '40px',
              }}>
                {message.senderName}
              </div>
            )}
            
            <div
              className="message-bubble"
              style={{
                padding: tokens.spacing[3],
                borderRadius: tokens.borderRadius.lg,
                backgroundColor: isOwn ? tokens.colors.primary[500] : tokens.colors.secondary[100],
                color: isOwn ? 'white' : tokens.colors.secondary[900],
                wordBreak: 'break-word',
              }}
            >
              <p style={{ 
                margin: 0, 
                fontSize: tokens.typography.fontSize.sm[0],
                lineHeight: tokens.typography.fontSize.sm[1],
              }}>
                {message.content}
              </p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: tokens.spacing[1],
              marginTop: tokens.spacing[1],
              fontSize: tokens.typography.fontSize.xs[0],
              color: tokens.colors.secondary[500],
              justifyContent: isOwn ? 'flex-end' : 'flex-start',
            }}>
              <span>{formatTime(message.timestamp)}</span>
              {isOwn && getStatusIcon(message.status)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header with Search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: tokens.spacing[4],
        backgroundColor: 'white',
        borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
      }}>
        <div>
          <h2 style={{ 
            margin: 0, 
            fontSize: tokens.typography.fontSize.base[0], 
            fontWeight: tokens.typography.fontWeight.semibold,
            color: tokens.colors.secondary[900],
          }}>
            Team Chat
          </h2>
          <p style={{ 
            margin: 0, 
            fontSize: tokens.typography.fontSize.sm[0], 
            color: tokens.colors.secondary[600],
          }}>
            {messages.length} messages
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: tokens.spacing[2], alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearching(e.target.value.length > 0);
              }}
              placeholder="Search messages..."
              style={{
                padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
                borderRadius: tokens.borderRadius.md,
                border: `1px solid ${tokens.colors.secondary[300]}`,
                fontSize: tokens.typography.fontSize.sm[0],
                color: tokens.colors.secondary[900],
                backgroundColor: 'white',
                outline: 'none',
                width: '200px',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: tokens.spacing[2],
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: tokens.spacing[1],
                  borderRadius: tokens.borderRadius.sm,
                  cursor: 'pointer',
                  color: tokens.colors.secondary[500],
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: tokens.spacing[2],
              borderRadius: tokens.borderRadius.sm,
              color: tokens.colors.secondary[500],
              cursor: 'pointer',
            }}
          >
            <Phone size={18} />
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: tokens.spacing[2],
              borderRadius: tokens.borderRadius.sm,
              color: tokens.colors.secondary[500],
              cursor: 'pointer',
            }}
          >
            <Video size={18} />
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: tokens.spacing[2],
              borderRadius: tokens.borderRadius.sm,
              color: tokens.colors.secondary[500],
              cursor: 'pointer',
            }}
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: tokens.spacing[4],
        backgroundColor: tokens.colors.secondary[50],
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[2] }}>
          {filteredMessages.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: tokens.spacing[8],
              color: tokens.colors.secondary[500],
            }}>
              {messages.length === 0 ? 'No messages yet' : 'No messages found'}
            </div>
          ) : (
            filteredMessages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isOwn={message.senderId === user?.id}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{
        padding: tokens.spacing[4],
        backgroundColor: 'white',
        borderTop: `1px solid ${tokens.colors.secondary[200]}`,
      }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ display: 'flex', gap: tokens.spacing[2], alignItems: 'flex-end' }}>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              padding: tokens.spacing[2],
              borderRadius: tokens.borderRadius.md,
              color: tokens.colors.secondary[500],
              cursor: 'pointer',
            }}
          >
            <Paperclip size={20} />
          </button>

          <div style={{ 
            flex: 1, 
            position: 'relative',
            backgroundColor: tokens.colors.secondary[100],
            borderRadius: tokens.borderRadius.lg,
            padding: tokens.spacing[2],
          }}>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              style={{
                width: '100%',
                border: 'none',
                background: 'none',
                outline: 'none',
                resize: 'none',
                fontSize: tokens.typography.fontSize.sm[0],
                color: tokens.colors.secondary[900],
                fontFamily: tokens.typography.fontFamily.sans,
                minHeight: '40px',
                maxHeight: '120px',
              }}
              rows={1}
            />
          </div>

          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              padding: tokens.spacing[2),
              borderRadius: tokens.borderRadius.md,
              color: tokens.colors.secondary[500],
              cursor: 'pointer',
            }}
          >
            <Smile size={20} />
          </button>

          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              background: inputText.trim() ? tokens.colors.primary[500] : tokens.colors.secondary[300],
              border: 'none',
              padding: tokens.spacing[2],
              borderRadius: tokens.borderRadius.md,
              color: 'white',
              cursor: inputText.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

// Enhanced Conversation List with Search
export const EnhancedConversationList = ({ conversations, onSelectConversation, activeId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conv => {
        const name = conv.name || conv.title || '';
        const message = conv.lastMessage || '';
        const searchLower = searchTerm.toLowerCase();
        
        return name.toLowerCase().includes(searchLower) ||
               message.toLowerCase().includes(searchLower);
      });
      setFilteredConversations(filtered);
    }
  }, [searchTerm, conversations]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with Search */}
      <div style={{
        padding: tokens.spacing[4],
        backgroundColor: 'white',
        borderBottom: `1px solid ${tokens.colors.secondary[200]`,
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: tokens.typography.fontSize.lg[0], 
          fontWeight: tokens.typography.fontWeight.semibold,
          color: tokens.colors.secondary[900],
          marginBottom: tokens.spacing[3],
        }}>
          Conversations
        </h3>
        
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            style={{
              width: '100%',
              padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
              borderRadius: tokens.borderRadius.md,
              border: `1px solid ${tokens.colors.secondary[300]}`,
              fontSize: tokens.typography.fontSize.sm[0],
              color: tokens.colors.secondary[900],
              outline: 'none',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: tokens.spacing[2],
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: tokens.spacing[1],
                borderRadius: tokens.borderRadius.sm,
                cursor: 'pointer',
                color: tokens.colors.secondary[500],
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Conversation List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredConversations.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: tokens.spacing[8],
            color: tokens.colors.secondary[500],
          }}>
            {conversations.length === 0 ? 'No conversations yet' : 'No conversations found'}
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing[3],
                padding: tokens.spacing[4],
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                transition: `all ${tokens.animations.duration[150]`,
                backgroundColor: activeId === conv.id ? tokens.colors.primary[50] : 'transparent',
                borderBottom: `1px solid ${tokens.colors.secondary[100]}`,
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: tokens.colors.primary[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: tokens.typography.fontSize.sm[0],
                fontWeight: tokens.typography.fontWeight.bold,
                color: tokens.colors.primary[600],
              }}>
                {conv.name?.[0] || conv.title?.[0] || '?'}
              </div>
              
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ 
                  fontSize: tokens.typography.fontSize.sm[0], 
                  fontWeight: tokens.typography.fontWeight.medium,
                  color: tokens.colors.secondary[900],
                }}>
                  {conv.name || conv.title}
                </div>
                <div style={{ 
                  fontSize: tokens.typography.fontSize.xs[0], 
                  color: tokens.colors.secondary[600],
                }}>
                  {conv.lastMessage || 'No messages yet'}
                </div>
              </div>
              
              <div style={{ 
                fontSize: tokens.typography.fontSize.xs[0], 
                color: tokens.colors.secondary[500],
              }}>
                {conv.unreadCount > 0 && (
                  <span style={{
                    backgroundColor: tokens.colors.primary[500],
                    color: 'white',
                    padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                    borderRadius: tokens.borderRadius.sm,
                    fontSize: tokens.typography.fontSize.xs[0],
                    fontWeight: tokens.typography.fontWeight.bold,
                  }}>
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default {
  EnhancedChatComponent,
  EnhancedConversationList,
};
