import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { login, clearError } from '../store/slices/authSlice';
import type { LoginCredentials } from '../types';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
 const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onFinish = async (values: LoginCredentials) => {
    const result = await dispatch(login(values));
    if (login.fulfilled.match(result)) {
      api.success({
        message: 'Login Successful',
        description: 'Welcome back! You have successfully signed in.',
        placement: 'topRight',
        duration: 4,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
    } else if (login.rejected.match(result)) {
      api.error({
        message: 'Login Failed',
        description: result.payload as string || 'An error occurred during login.',
        placement: 'topRight',
        duration: 5,
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    }
  };

  return (
    <div className="login-form-container">
       {contextHolder}
      <div className="login-form-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue to your chats</p>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Sign In
            </Button>
          </Form.Item>

          <div className="form-footer">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}