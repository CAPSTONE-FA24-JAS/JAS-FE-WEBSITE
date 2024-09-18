import React from 'react'
import { Form, Input, Button, Select, message, Row, Col } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, LockOutlined } from '@ant-design/icons'

const { Option } = Select

// Define the role options
const roleOptions = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'User' },
  { id: 3, name: 'Manager' }
]

export default function CreateAccount() {
  const [form] = Form.useForm()

  // Handle form submission
  const onFinish = (values: any) => {
    console.log('Received values:', values)
    message.success('Account created successfully!')
    // Add logic to send data to server or handle it as needed
  }

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-4'>Create New Account</h2>
      <Form
        form={form}
        layout='vertical'
        onFinish={onFinish}
        initialValues={{ roleId: 1 }} // Default roleId (e.g., Admin)
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='First Name'
              name='firstName'
              rules={[{ required: true, message: 'Please input the first name!' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Last Name'
              name='lastName'
              rules={[{ required: true, message: 'Please input the last name!' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                { required: true, message: 'Please input the email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Phone Number' name='phoneNumber'>
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label='Address' name='address'>
              <Input prefix={<HomeOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Gender' name='gender' rules={[{ required: true, message: 'Please select the gender!' }]}>
              <Select placeholder='Select gender'>
                <Option value='Male'>Male</Option>
                <Option value='Female'>Female</Option>
                <Option value='Other'>Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label='Password'
              name='passwordHash'
              rules={[{ required: true, message: 'Please input the password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='Role' name='roleId' rules={[{ required: true, message: 'Please select the role!' }]}>
              <Select placeholder='Select role'>
                {roleOptions.map((role) => (
                  <Option key={role.id} value={role.id}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Create Account
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
