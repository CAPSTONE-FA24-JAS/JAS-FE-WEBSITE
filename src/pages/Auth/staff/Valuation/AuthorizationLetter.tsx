import React, { useState } from 'react'
import { Input, Row, Col, Typography, Button } from 'antd'

const { Title, Text } = Typography

export default function CreateAuthorization() {
  const [authorizer, setAuthorizer] = useState({
    fullName: '',
    address: '',
    email: '',
    phone: '',
    idCard: '',
    issueDate: '',
    expiryDate: ''
  })

  const [authorizee, setAuthorizee] = useState({
    fullName: '',
    address: '',
    email: '',
    phone: '',
    idCard: '',
    issueDate: '',
    expiryDate: ''
  })

  const [content, setContent] = useState('')
  const [commitment, setCommitment] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log({ authorizer, authorizee, content, commitment })
  }

  return (
    <div className='p-10'>
      <Title level={4} className='text-xl font-bold text-center '>
        Cộng hòa xã hội chủ nghĩa Việt Nam
      </Title>

      <Title level={5} className=' font-semibold text-center'>
        Độc lập - Tự do - Hạnh phúc
      </Title>

      <form onSubmit={handleSubmit}>
        <Title level={3} className='text-lg font-extrabold text-center'>
          GIẤY ỦY QUYỀN
        </Title>
        <Text className='text-center italic'>
          - Căn cứ Bộ Luât Dân sự nước Cộng hoà xã hội chủ nghĩa Việt Nam.
          <br />- Căn cứ vào các văn bản hiến pháp hiện hành.
        </Text>

        <Title level={4} className='font-bold'>
          I. Bên ủy quyền:
        </Title>

        {/* Authorizer Fields */}
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              Họ và tên:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              value={authorizer.fullName}
              onChange={(e) => setAuthorizer({ ...authorizer, fullName: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              Địa chỉ:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              value={authorizer.address}
              onChange={(e) => setAuthorizer({ ...authorizer, address: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              Email:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              type='email'
              value={authorizer.email}
              onChange={(e) => setAuthorizer({ ...authorizer, email: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              Điện thoại:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              value={authorizer.phone}
              onChange={(e) => setAuthorizer({ ...authorizer, phone: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              CCCD:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              value={authorizer.idCard}
              onChange={(e) => setAuthorizer({ ...authorizer, idCard: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              Ngày cấp:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              type='date'
              value={authorizer.issueDate}
              onChange={(e) => setAuthorizer({ ...authorizer, issueDate: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              Ngày hết hạn:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              type='date'
              value={authorizer.expiryDate}
              onChange={(e) => setAuthorizer({ ...authorizer, expiryDate: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>

        <Title level={4} className='font-bold'>
          II. Bên được ủy quyền:
        </Title>

        {/* Authorizee Fields */}
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              Họ và tên:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              value={authorizee.fullName}
              onChange={(e) => setAuthorizee({ ...authorizee, fullName: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              Địa chỉ:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              value={authorizee.address}
              onChange={(e) => setAuthorizee({ ...authorizee, address: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              Email:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              type='email'
              value={authorizee.email}
              onChange={(e) => setAuthorizee({ ...authorizee, email: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              Điện thoại:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              value={authorizee.phone}
              onChange={(e) => setAuthorizee({ ...authorizee, phone: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              CCCD:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              value={authorizee.idCard}
              onChange={(e) => setAuthorizee({ ...authorizee, idCard: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              Ngày cấp:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              type='date'
              value={authorizee.issueDate}
              onChange={(e) => setAuthorizee({ ...authorizee, issueDate: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>
        <Row gutter={16} className='mb-2'>
          <Col span={6}>
            <Text strong className='block mb-2'>
              Ngày hết hạn:
            </Text>
          </Col>
          <Col span={18}>
            <Input
              type='date'
              value={authorizee.expiryDate}
              onChange={(e) => setAuthorizee({ ...authorizee, expiryDate: e.target.value })}
              required
              className='font-bold text-black'
            />
          </Col>
        </Row>

        <Title level={4} className='font-bold'>
          III. Nội dung ủy quyền:
        </Title>
        <Input.TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Nhập nội dung ủy quyền'
          required
          className='mb-4'
        />

        <Title level={4} className='font-bold'>
          IV. Cam kết:
        </Title>
        <Input.TextArea
          value={commitment}
          onChange={(e) => setCommitment(e.target.value)}
          placeholder='Nhập cam kết'
          required
          className='mb-4'
        />

        <div className='flex justify-between mt-10'>
          <Text className='uppercase font-bold ml-20 text-xl'>Bên ủy quyền</Text>
          <Text className='uppercase font-bold mr-20 text-xl'>Bên được ủy quyền</Text>
        </div>

        <div className='flex justify-between'>
          <Text className='italic ml-28'>(Ký, họ tên)</Text>
          <Text className='italic mr-36'>(Ký, họ tên)</Text>
        </div>

        <Button type='primary' htmlType='submit' className='mt-4 '>
          Gửi giấy ủy quyền
        </Button>
      </form>
    </div>
  )
}
