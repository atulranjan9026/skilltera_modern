// services/chatService.js
import { get, post } from "./api";

export const chatService = {
  // Initiate a new conversation
  initiateConversation: async (participantId, message) => {
    return post('/chat/initiate', {
      participantId,
      message
    });
  },

  // Get all conversations for current user
  getUserConversations: async () => {
    return get('/chat/conversations');
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId) => {
    return get(`/chat/messages/${conversationId}`);
  },

  // Send a message in a conversation
  sendMessage: async (conversationId, message) => {
    return post(`/chat/messages/${conversationId}`, { message });
  }
};
