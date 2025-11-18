import { Layout } from 'antd';
import Sidebar from './Sidebar';
import ChatContent from './ChatContent';

export default function ChatLayout() {
  return (
    <Layout className="chat-layout">
      <Sidebar />
      <ChatContent />
    </Layout>
  );
}