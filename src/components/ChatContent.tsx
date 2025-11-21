import { Layout, Input, Button, Empty, Avatar, notification } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { sendMessage } from '../store/slices/chatSlice';
import { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';

const { Content } = Layout;
const { TextArea } = Input;

export default function ChatContent() {
  const dispatch = useAppDispatch();
  const { currentChat } = useAppSelector((state) => state.chat);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !currentChat) return;

    setSending(true);
    try {
      const result = await dispatch(
        sendMessage({
          userId: null as any, // Replace with actual user ID from auth state if needed
          conversationId: currentChat.conversationId,
          message: inputValue.trim(),
        })
      );
      console.log("result", result);
      
      // Show notification for assistant's response
      if (sendMessage.fulfilled.match(result)) {
        const response = result.payload as { userMessage: Message; assistantMessage: String, conversationId: string };
        console.log("response", response);
        
        notification.info({
          message: 'Assistant Response',
          description: response.assistantMessage,
          placement: 'topRight',
          duration: 8,
          style: {
            width: 400,
          },
          icon: <RobotOutlined style={{ color: '#1890ff' }} />,
        });
      }
      
      setInputValue('');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentChat) {
    return (
      <Content className="chat-content">
        <div className="empty-chat">
          <Empty
            description="Select a chat or create a new one to start messaging"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      </Content>
    );
  }

  return (
    <Content className="chat-content">
      <div className="messages-container">
        {currentChat?.messages?.length === 0 ? (
          <div className="empty-messages">
            <Empty
              description="No messages yet. Start the conversation!"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className="messages-list">
              {currentChat?.messages?.map((message) => {
                console.log("message", message);
                
                return (
                  <div
                    key={message.id}
                    className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
                  >
                    {message.sender === 'user' && (
                      <Avatar
                        icon={<UserOutlined />}
                        className="message-avatar"
                      />
                    )}
                    <div className="message-content">
                      <div className="message-text">{message.content}</div>
                      <div className="message-time">
                        {new Date(message.createdAt).toLocaleDateString('vi-VN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </div>
                    </div>
                    {message.sender === 'bot' && (
                      <Avatar
                        icon={<RobotOutlined />}
                        className="message-avatar"
                      />
                    )}
                  </div>
                )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="input-container">
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={sending}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={sending}
          disabled={!inputValue.trim()}
        >
          Send
        </Button>
      </div>
    </Content>
  );
}