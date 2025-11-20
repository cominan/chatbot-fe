// User types
export interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

// Chat types
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  chatId: string;
}

export interface Chat {
  conversationId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface SendMessageRequest {
  userId: string;
  message: string;
  conversationId: string;
}

export interface SendMessageResponse {
  botReply: string;
  conversationId: string;
}

export interface CreateChatRequest {
  title: string;
}

export interface CreateChatResponse {
  chat: Chat;
}