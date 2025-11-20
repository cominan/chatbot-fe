import { Layout, Menu, Button, Popconfirm, Empty } from 'antd';
import { PlusOutlined, MessageOutlined, DeleteOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createChat, deleteChat, setCurrentChat, fetchChats, fetchChat } from '../store/slices/chatSlice';
import { logout } from '../store/slices/authSlice';
import { useEffect } from 'react';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const { chats, currentChat } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleNewChat = async () => {
    await dispatch(createChat({ title: 'New Chat' }));
    dispatch(fetchChats());
  };

  const handleSelectChat = (chatId: string) => {
    console.log("chatId", chatId);
    dispatch(fetchChat(chatId));
    // const chat = chats.find((c) => c.conversationId === chatId);
    // if (chat) {
    //   dispatch(setCurrentChat(chat));
    // }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await dispatch(deleteChat(chatId));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const menuItems: MenuProps['items'] = chats.map((chat) => ({
    key: chat.conversationId,
    icon: <MessageOutlined />,
    label: (
      <div className="chat-menu-item">
        <span className="chat-title">{chat.title}</span>
        <Popconfirm
          title="Delete this chat?"
          description="This action cannot be undone."
          onConfirm={(e) => handleDeleteChat(chat.conversationId, e as any)}
          okText="Delete"
          cancelText="Cancel"
        >
          <DeleteOutlined
            className="delete-icon"
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>
      </div>
    ),
  }));

  return (
    <Sider width={280} className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Chat History</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleNewChat}
          block
        >
          New Chat
        </Button>
      </div>

      <div className="sidebar-content">
        {chats.length > 0 ? (
          <Menu
            mode="inline"
            selectedKeys={currentChat ? [currentChat.conversationId] : []}
            items={menuItems}
            onClick={({ key }) => handleSelectChat(key)}
          />
        ) : (
          <Empty
            description="No chats yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <UserOutlined />
          <span>{user?.username || 'User'}</span>
        </div>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          block
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
}