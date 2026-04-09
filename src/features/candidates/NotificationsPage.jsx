import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import { notificationsService } from '../../services/notificationsService';
import { useAuthContext } from '../../store/context/AuthContext';
import { toast } from '../../utils/toast';

/**
 * Notifications Page - Display application status updates and notifications
 */
export default function NotificationsPage() {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    if (user?._id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsService.getNotifications(user._id);
      if (response?.success) {
        setNotifications(response.notifications || []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications');
      // For now, show empty state since endpoint returns placeholder data
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAsRead(null);
      fetchNotifications();
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const getNotificationIcon = (type) => {
    const iconClass = 'w-5 h-5';
    switch (type) {
      case 'application_submitted':
        return <Bell className={iconClass} />;
      case 'interview_scheduled':
        return <Check className={iconClass} />;
      case 'interview_completed':
        return <CheckCheck className={iconClass} />;
      case 'offer_received':
        return <CheckCheck className={`${iconClass} text-green-500`} />;
      case 'application_rejected':
        return <Trash2 className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'application_submitted':
        return `Your application has been submitted for ${notification.jobTitle}`;
      case 'interview_scheduled':
        return `Interview scheduled at ${notification.companyName} for ${notification.jobTitle}`;
      case 'interview_completed':
        return `Your interview at ${notification.companyName} has been completed`;
      case 'offer_received':
        return `You received an offer from ${notification.companyName}`;
      case 'application_rejected':
        return `Your application for ${notification.jobTitle} was not selected`;
      default:
        return 'You have a new notification';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-600 mt-1">
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            </p>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No notifications</h2>
            <p className="text-slate-600">
              You're all caught up! Check back later for updates on your applications.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow ${
                  !notification.isRead ? 'border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1 text-slate-400">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 font-medium">
                      {getNotificationMessage(notification)}
                    </p>
                    {notification.description && (
                      <p className="text-slate-600 text-sm mt-1">{notification.description}</p>
                    )}
                    <p className="text-slate-500 text-xs mt-2">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Status Badge */}
                  {!notification.isRead && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
