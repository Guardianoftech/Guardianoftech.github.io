import { api } from './api';

export const sendChatMessage = async (message: string, conversationId?: number) => {
  try {
    const response = await api.post('/assistant/chat', { 
      message,
      conversation_id: conversationId || null
    });
    return response;
  } catch (error) {
    console.error("AI API Error:", error);
    throw error;
  }
};

export const fetchConversations = async () => {
  const response = await api.get('/assistant/conversations');
  return response.data;
};