import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Send, Paperclip, Smile, MoreVertical, Phone, Video } from 'lucide-react';

// Simple Enhanced Chat Component with Search
export const EnhancedChatComponent = ({ user, initialMessages = [] }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
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

    return (
      <div style={{
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
      }}>
        <div style={{ maxWidth: '70%' }}>
          {!isOwn && (
            <div style={{ 
              fontSize: '12px', 
              color: '#666',
              marginBottom: '4px',
            }}>
              {message.senderName}
            </div>
          )}
          
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: isOwn ? '#3b82f6' : '#f3f4f6',
              color: isOwn ? 'white' : '#1f2937',
              wordBreak: 'break-word',
            }}
          >
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
              {message.content}
            </p>
          </div>
          
          <div style={{ 
            fontSize: '12px', 
            color: '#666',
            marginTop: '4px',
            textAlign: isOwn ? 'right' : 'left',
          }}>
            {formatTime(message.timestamp)}
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
        padding: '16px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <div>
          <h2 style={{ 
            margin: 0, 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#1f2937',
          }}>
            Team Chat
          </h2>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: '#6b7280',
          }}>
            {messages.length} messages
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                color: '#1f2937',
                outline: 'none',
                width: '200px',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: '#6b7280',
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
              padding: '8px',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
            }}
          >
            <Phone size={18} />
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
            }}
          >
            <Video size={18} />
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              borderRadius: '6px',
              color: '#6b7280',
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
        padding: '16px',
        backgroundColor: '#f9fafb',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredMessages.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '32px',
              color: '#6b7280',
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
        padding: '16px',
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
      }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
            }}
          >
            <Paperclip size={20} />
          </button>

          <div style={{ 
            flex: 1, 
            position: 'relative',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '8px',
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
                fontSize: '14px',
                color: '#1f2937',
                fontFamily: 'system-ui, sans-serif',
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
              padding: '8px',
              borderRadius: '6px',
              color: '#6b7280',
              cursor: 'pointer',
            }}
          >
            <Smile size={20} />
          </button>

          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              background: inputText.trim() ? '#3b82f6' : '#d1d5db',
              border: 'none',
              padding: '8px',
              borderRadius: '6px',
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

// Simple Conversation List with Search
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
        padding: '16px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '12px',
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
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              color: '#1f2937',
              outline: 'none',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: '4px',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#6b7280',
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
            padding: '32px',
            color: '#6b7280',
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
                gap: '12px',
                padding: '16px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                backgroundColor: activeId === conv.id ? '#eff6ff' : 'transparent',
                borderBottom: '1px solid #f3f4f6',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#3b82f6',
              }}>
                {conv.name?.[0] || conv.title?.[0] || '?'}
              </div>
              
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: '#1f2937',
                }}>
                  {conv.name || conv.title}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6b7280',
                }}>
                  {conv.lastMessage || 'No messages yet'}
                </div>
              </div>
              
              <div style={{ 
                fontSize: '12px', 
                color: '#6b7280',
              }}>
                {conv.unreadCount > 0 && (
                  <span style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
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
