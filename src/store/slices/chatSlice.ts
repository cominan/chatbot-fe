import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Chat, Message, SendMessageRequest, CreateChatRequest } from '../../types';
import { chatApi } from '../../api/chatApi';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchChats = createAsyncThunk('chat/fetchChats', async (_, { rejectWithValue }) => {
  try {
    return await chatApi.getChats();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch chats');
  }
});

export const fetchChat = createAsyncThunk('chat/fetchChat', async (chatId: string, { rejectWithValue }) => {
  try {
    return await chatApi.getChat(chatId);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat');
  }
});

export const createChat = createAsyncThunk(
  'chat/createChat',
  async (data: CreateChatRequest, { rejectWithValue }) => {
    try {
      const response = await chatApi.createChat(data);
      return response.chat;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create chat');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (data: SendMessageRequest, { rejectWithValue, getState }) => {
    try {
      // Add user message immediately
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        content: data.message,
        role: 'user',
        timestamp: new Date(),
        chatId: data.userId,
      };
      
      const response = await chatApi.sendMessage(data);
      return { userMessage, assistantMessage: response.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const deleteChat = createAsyncThunk('chat/deleteChat', async (chatId: string, { rejectWithValue }) => {
  try {
    await chatApi.deleteChat(chatId);
    return chatId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete chat');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addMessageToCurrentChat: (state, action: PayloadAction<Message>) => {
      if (state.currentChat) {
        state.currentChat.messages.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chats
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action: PayloadAction<Chat[]>) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch chat
      .addCase(fetchChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChat.fulfilled, (state, action: PayloadAction<Chat>) => {
        state.loading = false;
        state.currentChat = action.payload;
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create chat
      .addCase(createChat.fulfilled, (state, action: PayloadAction<Chat>) => {
        state.chats.unshift(action.payload);
        state.currentChat = action.payload;
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<{ userMessage: Message; assistantMessage: Message }>) => {
        if (state.currentChat) {
          // Add user message to chat
          state.currentChat.messages.push(action.payload.userMessage);
          // Note: Assistant message will be shown as notification, not added to chat
        }
      })
      // Delete chat
      .addCase(deleteChat.fulfilled, (state, action: PayloadAction<string>) => {
        state.chats = state.chats.filter((chat) => chat.conversationId !== action.payload);
        if (state.currentChat?.conversationId === action.payload) {
          state.currentChat = null;
        }
      });
  },
});

export const { setCurrentChat, clearError, addMessageToCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;