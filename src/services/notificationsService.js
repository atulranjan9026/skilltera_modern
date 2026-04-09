import { get, post } from './api';

export const notificationsService = {
  /**
   * Get unread notifications count
   * Returns 0 if endpoint doesn't exist yet
   */
  getUnreadCount: async (candidateId) => {
    try {
      const response = await get(`/candidates/${candidateId}/notifications/unread-count`);
      return response;
    } catch (err) {
      // Endpoint doesn't exist yet, return 0
      return { success: true, count: 0 };
    }
  },

  /**
   * Get candidate notifications
   */
  getNotifications: async (candidateId) => {
    try {
      return await get(`/candidates/${candidateId}/notifications`);
    } catch (err) {
      return { success: true, notifications: [] };
    }
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    return post(`/notifications/${notificationId}/read`);
  }
};