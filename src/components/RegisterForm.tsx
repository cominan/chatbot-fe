import { Form, Input, Button, DatePicker, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { register, clearError } from '../store/slices/authSlice';
import type { RegisterData } from '../types';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

export default function RegisterForm() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [form] = Form.useForm();
 const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onFinish = async (values: any) => {
    const registerData: RegisterData = {
      username: values.username,
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : undefined,
      address: values.address,
    };
    
    const result = await dispatch(register(registerData));
    if (register.fulfilled.match(result)) {
      api.success({
        message: 'Registration Successful',
        description: 'Your account has been created successfully! Welcome aboard.',
        placement: 'topRight',
        duration: 4,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
    } else if (register.rejected.match(result)) {
      api.error({
        message: 'Registration Failed',
        description: result.payload as string || 'An error occurred during registration.',
        placement: 'topRight',
        duration: 5,
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    }
  };

  return (
    <div className="register-form-container">
     {contextHolder}
      <div className="register-form-card">
        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">Sign up to start chatting</p>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
          scrollToFirstError
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Username is required' },
              { min: 3, max: 50, message: 'Username must be between 3 and 50 characters' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Email should be valid' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 6, max: 100, message: 'Password must be between 6 and 100 characters' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="firstName"
            rules={[{ required: true, message: 'First name is required' }]}
          >
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item name="lastName">
            <Input placeholder="Last Name (Optional)" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            rules={[
              {
                pattern: /^$|^[0-9]{10,15}$/,
                message: 'Phone number should be between 10-15 digits',
              },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Phone Number (Optional)" />
          </Form.Item>

          <Form.Item
            name="dateOfBirth"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  if (dayjs(value).isAfter(dayjs())) {
                    return Promise.reject(new Error('Date of birth must be in the past'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Date of Birth (Optional)"
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </Form.Item>

          <Form.Item name="address">
            <Input.TextArea
              placeholder="Address (Optional)"
              rows={2}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Sign Up
            </Button>
          </Form.Item>

          <div className="form-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}