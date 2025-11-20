import type { Chat, CreateChatRequest, CreateChatResponse, SendMessageRequest, SendMessageResponse } from '../types';
import { apiClient } from './baseApi';

export const chatApi = {
  // Get all chats for current user
  getChats: async (): Promise<Chat[]> => {
    const response = await apiClient.get<Chat[]>('/history/conversations');
    return response.data;
  },

  // Get a specific chat by ID
  getChat: async (conversationId: string): Promise<Chat> => {
    const response = await apiClient.get<Chat>(`/history/conversations/${conversationId}`);
    return response.data;
  },

  // Create a new chat
  createChat: async (data: CreateChatRequest): Promise<Chat> => {
    const response = await apiClient.post<Chat>('/chat/create-chat', data);
    return response.data;
  },

  // Send a message in a chat
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await apiClient.post<SendMessageResponse>('/chat/send', data);
    return response.data;
  },

  // Delete a chat
  deleteChat: async (chatId: string): Promise<void> => {
    await apiClient.delete(`/chats/${chatId}`);
  },
};