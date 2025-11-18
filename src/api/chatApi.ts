import type { Chat, CreateChatRequest, CreateChatResponse, SendMessageRequest, SendMessageResponse } from '../types';
import { apiClient } from './baseApi';

export const chatApi = {
  // Get all chats for current user
  getChats: async (): Promise<Chat[]> => {
    const response = await apiClient.get<Chat[]>('/chats');
    return response.data;
  },

  // Get a specific chat by ID
  getChat: async (chatId: string): Promise<Chat> => {
    const response = await apiClient.get<Chat>(`/chats/${chatId}`);
    return response.data;
  },

  // Create a new chat
  createChat: async (data: CreateChatRequest): Promise<CreateChatResponse> => {
    const response = await apiClient.post<CreateChatResponse>('/chats', data);
    return response.data;
  },

  // Send a message in a chat
  sendMessage: async (data: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await apiClient.post<SendMessageResponse>('/messages', data);
    return response.data;
  },

  // Delete a chat
  deleteChat: async (chatId: string): Promise<void> => {
    await apiClient.delete(`/chats/${chatId}`);
  },
};