import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Video, 
  Calendar, 
  FileText, 
  Share2, 
  Bell, 
  Search, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Mic,
  Camera,
  Image,
  Clock,
  Check,
  CheckCheck,
  UserPlus,
  Settings,
  LogOut,
  Edit,
  Trash2,
  Download,
  Star,
  Archive
} from 'lucide-react';
import { tokens, animations } from '../../styles/designTokens';

// Collaboration Service
const collaborationService = {
  // Chat functionality
  sendMessage: async (message) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: Date.now(),
      ...message,
      timestamp: new Date(),
      status: 'delivered',
    };
  },

  getMessages: async (channelId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: 1,
        channelId,
        senderId: 'user1',
        senderName: 'Sarah Johnson',
        senderAvatar: 'SJ',
        content: 'Hey team! How\'s the hiring for the frontend position going?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 2,
        channelId,
        senderId: 'user2',
        senderName: 'Mike Chen',
        senderAvatar: 'MC',
        content: 'We have 3 strong candidates. I\'ve scheduled interviews for tomorrow.',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
      {
        id: 3,
        channelId,
        senderId: 'user3',
        senderName: 'Emily Davis',
        senderAvatar: 'ED',
        content: 'Great! I\'ve prepared the interview questions. Should I share them?',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        status: 'read',
        type: 'text',
      },
    ];
  },

  // Team members
  getTeamMembers: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: 'user1',
        name: 'Sarah Johnson',
        role: 'Hiring Manager',
        avatar: 'SJ',
        status: 'online',
        department: 'Engineering',
        email: 'sarah@company.com',
      },
      {
        id: 'user2',
        name: 'Mike Chen',
        role: 'Senior Recruiter',
        avatar: 'MC',
        status: 'online',
        department: 'HR',
        email: 'mike@company.com',
      },
      {
        id: 'user3',
        name: 'Emily Davis',
        role: 'Technical Lead',
        avatar: 'ED',
        status: 'away',
        department: 'Engineering',
        email: 'emily@company.com',
      },
      {
        id: 'user4',
        name: 'Alex Turner',
        role: 'Recruiter',
        avatar: 'AT',
        status: 'offline',
        department: 'HR',
        email: 'alex@company.com',
      },
    ];
  },

  // Channels
  getChannels: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: 'general',
        name: 'General',
        type: 'public',
        description: 'Team-wide discussions',
        memberCount: 12,
        unreadCount: 3,
        lastActivity: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        id: 'hiring',
        name: 'Hiring Team',
        type: 'private',
        description: 'Hiring strategy and coordination',
        memberCount: 8,
        unreadCount: 0,
        lastActivity: new Date(Date.now() - 2 * 60 * 1000),
      },
      {
        id: 'engineering',
        name: 'Engineering Interviews',
        type: 'private',
        description: 'Technical interview discussions',
        memberCount: 6,
        unreadCount: 1,
        lastActivity: new Date(Date.now() - 15 * 60 * 1000),
      },
    ];
  },

  // Video meetings
  scheduleMeeting: async (meeting) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      id: Date.now(),
      ...meeting,
      status: 'scheduled',
      joinUrl: `https://meet.company.com/${Date.now()}`,
    };
  },

  getMeetings: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        title: 'Frontend Candidate Interviews',
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        duration: 60,
        participants: ['Sarah Johnson', 'Mike Chen', 'Emily Davis'],
        type: 'interview',
        status: 'scheduled',
      },
      {
        id: 2,
        title: 'Weekly Team Sync',
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        duration: 30,
        participants: ['All Team Members'],
        type: 'meeting',
        status: 'scheduled',
      },
    ];
  },

  // Shared documents
  getDocuments: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      {
        id: 1,
        name: 'Interview Questions Template',
        type: 'document',
        size: '245 KB',
        modified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        sharedBy: 'Emily Davis',
        starred: true,
      },
      {
        id: 2,
        name: 'Candidate Evaluation Rubric',
        type: 'spreadsheet',
        size: '1.2 MB',
        modified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        sharedBy: 'Sarah Johnson',
        starred: false,
      },
      {
        id: 3,
        name: 'Hiring Process Flowchart',
        type: 'image',
        size: '890 KB',
        modified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        sharedBy: 'Mike Chen',
        starred: true,
      },
    ];
  },
};

// Message Component
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
        return <Check size={14} style={{ color: tokens.colors.secondary[400] }} />;
      case 'delivered':
        return <CheckCheck size={14} style={{ color: tokens.colors.secondary[400] }} />;
      case 'read':
        return <CheckCheck size={14} style={{ color: tokens.colors.primary[500] }} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`message ${isOwn ? 'own' : 'other'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
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
    </motion.div>
  );
};

// Chat Input Component
const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage({
        content: message.trim(),
        type: 'text',
      });
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: tokens.spacing[2], alignItems: 'flex-end' }}>
      <button
        type="button"
        style={{
          background: 'none',
          border: 'none',
          padding: tokens.spacing[2],
          borderRadius: tokens.borderRadius.md,
          color: tokens.colors.secondary[500],
          cursor: 'pointer',
          transition: `all ${tokens.animations.duration[150]}`,
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
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setIsTyping(e.target.value.length > 0);
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={disabled}
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
          padding: tokens.spacing[2],
          borderRadius: tokens.borderRadius.md,
          color: tokens.colors.secondary[500],
          cursor: 'pointer',
          transition: `all ${tokens.animations.duration[150]}`,
        }}
      >
        <Smile size={20} />
      </button>

      <button
        type="submit"
        disabled={!message.trim() || disabled}
        style={{
          background: message.trim() && !disabled ? tokens.colors.primary[500] : tokens.colors.secondary[300],
          border: 'none',
          padding: tokens.spacing[2],
          borderRadius: tokens.borderRadius.md,
          color: 'white',
          cursor: message.trim() && !disabled ? 'pointer' : 'not-allowed',
          transition: `all ${tokens.animations.duration[150]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Send size={18} />
      </button>
    </form>
  );
};

// Channel List Component
const ChannelList = ({ channels, activeChannel, onChannelSelect }) => {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {channels.map((channel) => (
        <button
          key={channel.id}
          onClick={() => onChannelSelect(channel)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[3],
            padding: tokens.spacing[3],
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            transition: `all ${tokens.animations.duration[150]}`,
            backgroundColor: activeChannel?.id === channel.id ? tokens.colors.primary[50] : 'transparent',
            borderRadius: tokens.borderRadius.md,
          }}
        >
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: channel.type === 'private' ? tokens.colors.semantic.warning[500] : tokens.colors.semantic.success[500],
          }} />
          
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ 
              fontSize: tokens.typography.fontSize.sm[0], 
              fontWeight: tokens.typography.fontWeight.medium,
              color: tokens.colors.secondary[900],
            }}>
              {channel.name}
            </div>
            <div style={{ 
              fontSize: tokens.typography.fontSize.xs[0], 
              color: tokens.colors.secondary[600],
            }}>
              {channel.description}
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[2] }}>
            {channel.unreadCount > 0 && (
              <span style={{
                backgroundColor: tokens.colors.primary[500],
                color: 'white',
                fontSize: tokens.typography.fontSize.xs[0],
                fontWeight: tokens.typography.fontWeight.bold,
                padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
                borderRadius: tokens.borderRadius.sm,
                minWidth: '20px',
                textAlign: 'center',
              }}>
                {channel.unreadCount}
              </span>
            )}
            <span style={{ 
              fontSize: tokens.typography.fontSize.xs[0], 
              color: tokens.colors.secondary[500],
            }}>
              {channel.memberCount}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

// Team Members List Component
const TeamMembersList = ({ members }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return tokens.colors.semantic.success[500];
      case 'away': return tokens.colors.semantic.warning[500];
      case 'offline': return tokens.colors.secondary[400];
      default: return tokens.colors.secondary[400];
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {members.map((member) => (
        <div
          key={member.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing[3],
            padding: tokens.spacing[3],
            borderRadius: tokens.borderRadius.md,
            transition: `all ${tokens.animations.duration[150]}`,
          }}
        >
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: tokens.colors.primary[500],
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: tokens.typography.fontSize.sm[0],
              fontWeight: tokens.typography.fontWeight.bold,
            }}>
              {member.avatar}
            </div>
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(member.status),
              border: '2px solid white',
            }} />
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: tokens.typography.fontSize.sm[0], 
              fontWeight: tokens.typography.fontWeight.medium,
              color: tokens.colors.secondary[900],
            }}>
              {member.name}
            </div>
            <div style={{ 
              fontSize: tokens.typography.fontSize.xs[0], 
              color: tokens.colors.secondary[600],
            }}>
              {member.role}
            </div>
          </div>
          
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: tokens.spacing[2],
              borderRadius: tokens.borderRadius.sm,
              color: tokens.colors.secondary[500],
              cursor: 'pointer',
              transition: `all ${tokens.animations.duration[150]}`,
            }}
          >
            <MoreVertical size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

// Video Meeting Component
const VideoMeeting = ({ meeting, onJoin, onStart }) => {
  return (
    <motion.div
      className="video-meeting"
      whileHover={{ y: -2 }}
      style={{
        backgroundColor: 'white',
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing[4],
        border: `1px solid ${tokens.colors.secondary[200]}`,
        cursor: 'pointer',
        transition: `all ${tokens.animations.duration[150]}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3] }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: tokens.borderRadius.md,
          backgroundColor: tokens.colors.primary[100],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Video size={24} style={{ color: tokens.colors.primary[500] }} />
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ 
            margin: 0, 
            fontSize: tokens.typography.fontSize.base[0], 
            fontWeight: tokens.typography.fontWeight.semibold,
            color: tokens.colors.secondary[900],
          }}>
            {meeting.title}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing[3], marginTop: tokens.spacing[1] }}>
            <span style={{ 
              fontSize: tokens.typography.fontSize.sm[0], 
              color: tokens.colors.secondary[600],
            }}>
              {meeting.startTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <span style={{ 
              fontSize: tokens.typography.fontSize.sm[0], 
              color: tokens.colors.secondary[600],
            }}>
              {meeting.duration} min
            </span>
            <span style={{ 
              fontSize: tokens.typography.fontSize.sm[0], 
              color: tokens.colors.secondary[600],
            }}>
              {meeting.participants.length} participants
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onJoin ? onJoin(meeting) : onStart(meeting)}
          style={{
            padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
            borderRadius: tokens.borderRadius.md,
            border: `1px solid ${tokens.colors.primary[500]}`,
            backgroundColor: 'transparent',
            color: tokens.colors.primary[500],
            fontSize: tokens.typography.fontSize.sm[0],
            fontWeight: tokens.typography.fontWeight.medium,
            cursor: 'pointer',
            transition: `all ${tokens.animations.duration[150]`,
          }}
        >
          {onJoin ? 'Join' : 'Start'}
        </button>
      </div>
    </motion.div>
  );
};

// Main Collaboration Hub Component
export const CollaborationHub = ({ user }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
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

  // Load initial data

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleChannelSelect = async (channel) => {
    setActiveChannel(channel);
    const messagesData = await collaborationService.getMessages(channel.id);
    setMessages(messagesData);
  };

  const handleSendMessage = async (message) => {
    if (!activeChannel || !user) return;

    const newMsg = await collaborationService.sendMessage({
      ...message,
      channelId: activeChannel.id,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    });

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  const handleChannelSelect = async (channel) => {
    setActiveChannel(channel);
    const messagesData = await collaborationService.getMessages(channel.id);
    setMessages(messagesData);
  };

  const handleJoinMeeting = (meeting) => {
    console.log('Joining meeting:', meeting);
    // Open video call interface
  };

  const handleStartMeeting = () => {
    console.log('Starting new meeting');
    // Open meeting creation modal
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        color: tokens.colors.secondary[500],
      }}>
        <div style={{ textAlign: 'center' }}>
          <Users className="w-8 h-8 animate-pulse" style={{ margin: '0 auto', marginBottom: tokens.spacing[3] }} />
          <p style={{ fontSize: tokens.typography.fontSize.sm[0] }}>Loading collaboration hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="collaboration-hub" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: tokens.spacing[4],
        backgroundColor: 'white',
        borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: tokens.typography.fontSize.lg[0], 
          fontWeight: tokens.typography.fontWeight.semibold,
          color: tokens.colors.secondary[900],
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing[2],
        }}>
          <Users size={24} style={{ color: tokens.colors.primary[500] }} />
          Team Collaboration
        </h1>
        
        <div style={{ display: 'flex', gap: tokens.spacing[2] }}>
          <button
            onClick={handleStartMeeting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: tokens.spacing[2],
              padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
              borderRadius: tokens.borderRadius.md,
              border: `1px solid ${tokens.colors.primary[500]}`,
              backgroundColor: 'transparent',
              color: tokens.colors.primary[500],
              fontSize: tokens.typography.fontSize.sm[0],
              fontWeight: tokens.typography.fontWeight.medium,
              cursor: 'pointer',
              transition: `all ${tokens.animations.duration[150]}`,
            }}
          >
            <Video size={16} />
            Start Meeting
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
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: '300px',
          backgroundColor: tokens.colors.secondary[50],
          borderRight: `1px solid ${tokens.colors.secondary[200]}`,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
          }}>
            {[
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'meetings', label: 'Meetings', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: tokens.spacing[1],
                  padding: tokens.spacing[3],
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  transition: `all ${tokens.animations.duration[150]}`,
                  color: activeTab === tab.id ? tokens.colors.primary[500] : tokens.colors.secondary[600],
                  backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
                }}
              >
                <tab.icon size={18} />
                <span style={{ fontSize: tokens.typography.fontSize.xs[0] }}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <ChannelList
                      channels={channels}
                      activeChannel={activeChannel}
                      onChannelSelect={handleChannelSelect}
                    />
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'team' && (
                <motion.div
                  key="team"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ height: '100%', padding: tokens.spacing[3] }}
                >
                  <TeamMembersList members={teamMembers} />
                </motion.div>
              )}
              
              {activeTab === 'meetings' && (
                <motion.div
                  key="meetings"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ height: '100%', padding: tokens.spacing[3] }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing[3] }}>
                    {meetings.map((meeting) => (
                      <VideoMeeting
                        key={meeting.id}
                        meeting={meeting}
                        onJoin={handleJoinMeeting}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat Area */}
        {activeTab === 'chat' && activeChannel && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
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
                  {activeChannel.name}
                </h2>
                <p style={{ 
                  margin: 0, 
                  fontSize: tokens.typography.fontSize.sm[0], 
                  color: tokens.colors.secondary[600],
                }}>
                  {activeChannel.description}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: tokens.spacing[2], alignItems: 'center' }}>
                {/* Search Input */}
                <div style={{ position: 'relative', marginRight: tokens.spacing[2] }}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsSearching(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowDropdown(true)}
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
                {filteredMessages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === user?.id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div style={{
              padding: tokens.spacing[4],
              backgroundColor: 'white',
              borderTop: `1px solid ${tokens.colors.secondary[200]}`,
            }}>
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationHub;
