import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, AlertCircle, Info, CheckCircle, XCircle, MessageSquare, Briefcase, User, Calendar } from 'lucide-react';
import { tokens, animations } from '../../styles/designTokens';

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  MESSAGE: 'message',
  APPLICATION: 'application',
  INTERVIEW: 'interview',
  JOB: 'job',
  TEAM: 'team',
};

// WebSocket connection manager
class WebSocketManager {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.heartbeatInterval = null;
    this.listeners = new Map();
    this.isConnected = false;
  }

  connect(url, token) {
    return new Promise((resolve, reject) => {
      try {
        // Close existing connection
        if (this.socket) {
          this.socket.close();
        }

        // Create new WebSocket connection
        this.socket = new WebSocket(`${url}?token=${token}`);

        // Connection opened
        this.socket.onopen = () => {
          // WebSocket connected
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        // Connection closed
        this.socket.onclose = (event) => {
          // WebSocket disconnected
          this.isConnected = false;
          this.stopHeartbeat();
          this.handleReconnect(url, token);
        };

        // Connection error
        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        // Message received
        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
  }

  send(message) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify(message));
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  handleMessage(data) {
    const { type, payload } = data;
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => callback(payload));
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({ type: 'heartbeat', timestamp: Date.now() });
    }, 30000); // Send heartbeat every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  handleReconnect(url, token) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(url, token).catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }
}

// Create WebSocket manager instance
const wsManager = new WebSocketManager();

// Notification context
const NotificationContext = createContext();

// Notification provider component
export const NotificationProvider = ({ children, user }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(notifications);

  // Update ref when notifications change
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  // Connect to WebSocket
  useEffect(() => {
    if (user && user.token) {
      const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080';
      
      wsManager.connect(wsUrl, user.token)
        .then(() => {
          setIsConnected(true);
        })
        .catch(error => {
          console.error('Failed to connect to WebSocket:', error);
          setIsConnected(false);
        });

      // Set up event listeners
      wsManager.on('notification', handleNotification);
      wsManager.on('mark_read', handleMarkRead);
      wsManager.on('mark_all_read', handleMarkAllRead);

      return () => {
        wsManager.off('notification', handleNotification);
        wsManager.off('mark_read', handleMarkRead);
        wsManager.off('mark_all_read', handleMarkAllRead);
        wsManager.disconnect();
        setIsConnected(false);
      };
    }
  }, [user]);

  const handleNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      ...notification,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep only last 50
    setUnreadCount(prev => prev + 1);

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: getNotificationIcon(notification.type),
        tag: notification.id,
      });
    }
  }, []);

  const handleMarkRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const markAsRead = useCallback((notificationId) => {
    if (wsManager.isConnected) {
      wsManager.send({
        type: 'mark_read',
        payload: { notificationId },
      });
    }
    handleMarkRead(notificationId);
  }, [handleMarkRead]);

  const markAllAsRead = useCallback(() => {
    if (wsManager.isConnected) {
      wsManager.send({
        type: 'mark_all_read',
        payload: {},
      });
    }
    handleMarkAllRead();
  }, [handleMarkAllRead]);

  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    if (!notificationsRef.current.find(n => n.id === notificationId)?.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, []);

  const value = {
    notifications,
    unreadCount,
    isConnected,
    showNotifications,
    setShowNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationToast />
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Get notification icon
const getNotificationIcon = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return <CheckCircle className="w-5 h-5" />;
    case NOTIFICATION_TYPES.ERROR:
      return <XCircle className="w-5 h-5" />;
    case NOTIFICATION_TYPES.WARNING:
      return <AlertCircle className="w-5 h-5" />;
    case NOTIFICATION_TYPES.MESSAGE:
      return <MessageSquare className="w-5 h-5" />;
    case NOTIFICATION_TYPES.APPLICATION:
      return <User className="w-5 h-5" />;
    case NOTIFICATION_TYPES.INTERVIEW:
      return <Calendar className="w-5 h-5" />;
    case NOTIFICATION_TYPES.JOB:
      return <Briefcase className="w-5 h-5" />;
    case NOTIFICATION_TYPES.TEAM:
      return <User className="w-5 h-5" />;
    default:
      return <Info className="w-5 h-5" />;
  }
};

// Get notification color
const getNotificationColor = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return tokens.colors.semantic.success[500];
    case NOTIFICATION_TYPES.ERROR:
      return tokens.colors.semantic.error[500];
    case NOTIFICATION_TYPES.WARNING:
      return tokens.colors.semantic.warning[500];
    case NOTIFICATION_TYPES.MESSAGE:
      return tokens.colors.primary[500];
    case NOTIFICATION_TYPES.APPLICATION:
      return tokens.colors.info[600];
    case NOTIFICATION_TYPES.INTERVIEW:
      return tokens.colors.semantic.warning[600];
    case NOTIFICATION_TYPES.JOB:
      return tokens.colors.semantic.success[600];
    case NOTIFICATION_TYPES.TEAM:
      return tokens.colors.secondary[600];
    default:
      return tokens.colors.secondary[500];
  }
};

// Notification toast component
const NotificationToast = () => {
  const { notifications, markAsRead, removeNotification } = useNotifications();

  return (
    <div className="notification-toast-container">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: tokens.animations.duration[300] }}
            className="notification-toast"
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: tokens.zIndex.modal,
              minWidth: '300px',
              maxWidth: '400px',
              backgroundColor: 'white',
              borderRadius: tokens.borderRadius.lg,
              boxShadow: tokens.shadows.xl,
              border: `1px solid ${tokens.colors.secondary[200]}`,
              overflow: 'hidden',
            }}
          >
            <div
              className="notification-header"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing[3],
                padding: tokens.spacing[4],
                backgroundColor: getNotificationColor(notification.type),
                color: 'white',
              }}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-title" style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: tokens.typography.fontSize.sm[0], fontWeight: tokens.typography.fontWeight.semibold }}>
                  {notification.title}
                </h4>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: tokens.spacing[1],
                  borderRadius: tokens.borderRadius.sm,
                  transition: `all ${tokens.animations.duration[150]}`,
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="notification-body" style={{ padding: tokens.spacing[4] }}>
              <p style={{ 
                margin: 0, 
                fontSize: tokens.typography.fontSize.sm[0], 
                color: tokens.colors.secondary[700],
                lineHeight: tokens.typography.fontSize.sm[1],
              }}>
                {notification.message}
              </p>
              
              {notification.action && (
                <div style={{ marginTop: tokens.spacing[3] }}>
                  <button
                    onClick={() => {
                      notification.action.onClick();
                      markAsRead(notification.id);
                    }}
                    style={{
                      backgroundColor: getNotificationColor(notification.type),
                      color: 'white',
                      border: 'none',
                      padding: `${tokens.spacing[2]} ${tokens.spacing[3]}`,
                      borderRadius: tokens.borderRadius.md,
                      fontSize: tokens.typography.fontSize.sm[0],
                      fontWeight: tokens.typography.fontWeight.medium,
                      cursor: 'pointer',
                      transition: `all ${tokens.animations.duration[150]}`,
                    }}
                  >
                    {notification.action.label}
                  </button>
                </div>
              )}
              
              <div style={{ 
                marginTop: tokens.spacing[2], 
                fontSize: tokens.typography.fontSize.xs[0], 
                color: tokens.colors.secondary[500] 
              }}>
                {formatTime(notification.timestamp)}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Notification bell component
export const NotificationBell = ({ className = '' }) => {
  const { unreadCount, showNotifications, setShowNotifications, notifications, markAllAsRead } = useNotifications();

  return (
    <div className={`notification-bell ${className}`} style={{ position: 'relative' }}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="bell-button"
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          padding: tokens.spacing[2],
          borderRadius: tokens.borderRadius.md,
          cursor: 'pointer',
          transition: `all ${tokens.animations.duration[150]}`,
          color: tokens.colors.secondary[600],
        }}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="notification-badge"
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              backgroundColor: tokens.colors.semantic.error[500],
              color: 'white',
              fontSize: tokens.typography.fontSize.xs[0],
              fontWeight: tokens.typography.fontWeight.bold,
              minWidth: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: tokens.animations.duration[150] }}
            className="notifications-dropdown"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: tokens.spacing[2],
              width: '380px',
              maxHeight: '500px',
              backgroundColor: 'white',
              borderRadius: tokens.borderRadius.lg,
              boxShadow: tokens.shadows.xl,
              border: `1px solid ${tokens.colors.secondary[200]}`,
              overflow: 'hidden',
              zIndex: tokens.zIndex.dropdown,
            }}
          >
            {/* Header */}
            <div
              className="notifications-header"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: tokens.spacing[4],
                borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
                backgroundColor: tokens.colors.secondary[50],
              }}
            >
              <h3 style={{ 
                margin: 0, 
                fontSize: tokens.typography.fontSize.base[0], 
                fontWeight: tokens.typography.fontWeight.semibold,
                color: tokens.colors.secondary[900],
              }}>
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: tokens.colors.primary[600],
                    fontSize: tokens.typography.fontSize.sm[0],
                    cursor: 'pointer',
                    padding: tokens.spacing[1],
                    borderRadius: tokens.borderRadius.sm,
                    transition: `all ${tokens.animations.duration[150]}`,
                  }}
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="notifications-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div
                  className="empty-state"
                  style={{
                    padding: tokens.spacing[8],
                    textAlign: 'center',
                    color: tokens.colors.secondary[500],
                  }}
                >
                  <Bell className="w-8 h-8" style={{ margin: '0 auto', marginBottom: tokens.spacing[3] }} />
                  <p style={{ margin: 0, fontSize: tokens.typography.fontSize.sm[0] }}>
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    style={{
                      padding: tokens.spacing[4],
                      borderBottom: `1px solid ${tokens.colors.secondary[100]}`,
                      backgroundColor: !notification.read ? tokens.colors.primary[50] : 'transparent',
                      cursor: 'pointer',
                      transition: `all ${tokens.animations.duration[150]}`,
                    }}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                      if (notification.action) {
                        notification.action.onClick();
                      }
                    }}
                  >
                    <div className="notification-content" style={{ display: 'flex', gap: tokens.spacing[3] }}>
                      <div
                        className="notification-icon"
                        style={{
                          color: getNotificationColor(notification.type),
                          flexShrink: 0,
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-details" style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: tokens.spacing[2] }}>
                          <h4 style={{ 
                            margin: 0, 
                            fontSize: tokens.typography.fontSize.sm[0], 
                            fontWeight: tokens.typography.fontWeight.semibold,
                            color: tokens.colors.secondary[900],
                            flex: 1,
                          }}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div
                              className="unread-indicator"
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: tokens.colors.primary[500],
                                flexShrink: 0,
                                marginTop: tokens.spacing[1],
                              }}
                            />
                          )}
                        </div>
                        <p style={{ 
                          margin: `${tokens.spacing[1]} 0 0 0`, 
                          fontSize: tokens.typography.fontSize.sm[0], 
                          color: tokens.colors.secondary[600],
                          lineHeight: tokens.typography.fontSize.sm[1],
                        }}>
                          {notification.message}
                        </p>
                        <p style={{ 
                          margin: `${tokens.spacing[2]} 0 0 0`, 
                          fontSize: tokens.typography.fontSize.xs[0], 
                          color: tokens.colors.secondary[500] 
                        }}>
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Format time helper
const formatTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = now - time;

  if (diff < 60000) {
    return 'Just now';
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return time.toLocaleDateString();
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export default NotificationProvider;
