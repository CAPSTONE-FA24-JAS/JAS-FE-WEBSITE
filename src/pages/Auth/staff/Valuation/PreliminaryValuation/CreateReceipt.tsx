import { Modal, Typography, Input, Row, Col } from 'antd'
import React, { useState } from 'react'
import { useCreateReceiptMutation } from '../../../../../services/valuation.services'
import { dateToString } from '../../../../../utils/convertTypeDayjs'
import dayjs from 'dayjs'
const { Title, Text } = Typography

interface Seller {
  firstName: string
  lastName: string
  address: string
  citizenIdentificationCard: string
  idIssuanceDate: string
  idExpirationDate: string
  phoneNumber: string
}

interface Record {
  id: number
  name: string
  actualStatusOfJewelry?: string
  seller?: Seller
}

interface CreateReceiptProps {
  isVisible: boolean
  onCancel: () => void
  onCreate: () => void
  record: Record
}

const CreateReceipt: React.FC<CreateReceiptProps> = ({ isVisible, onCancel, onCreate, record }) => {
  const [actualStatusOfJewelry, setActualStatusOfJewelry] = useState(record?.actualStatusOfJewelry || '')
  const [deliveryDate, setDeliveryDate] = useState<string>(dateToString(dayjs()))
  const [idIssuanceDate, setIdIssuanceDate] = useState<string>(dateToString(dayjs(record?.seller?.idIssuanceDate)))
  const [idExpirationDate, setIdExpirationDate] = useState<string>(
    dateToString(dayjs(record?.seller?.idExpirationDate))
  )
  const [createReceipt] = useCreateReceiptMutation()

  const handleCreate = async () => {
    const requestData = {
      id: record?.id,
      actualStatusOfJewelry,
      status: 5, // Set status to 5 explicitly
      deliveryDate
    }

    try {
      const response: any = await createReceipt({ id: record?.id, data: requestData }).unwrap()
      console.log('Receipt creation response:', response)
      const responseData = response.data
      const documents = responseData?.valuationDocuments || []
      console.log('Documents:', documents)

      // Filter documents to get the most recent one
      const filteredDocuments = documents.filter((document: any) => document.valuationDocumentType === 'Reciept')
      filteredDocuments.sort(
        (a: any, b: any) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
      )
      const mostRecentDocument = filteredDocuments[0]
      const fileDocumentUrl = mostRecentDocument?.documentLink

      if (fileDocumentUrl) {
        // Open the URL in a new tab
        window.open(fileDocumentUrl, '_blank')
      } else {
        console.error('No file document URL found for the specified valuationDocumentTypeId.')
      }

      onCreate()
    } catch (error) {
      console.error('Failed to create receipt:', error)
    }
  }

  return (
    <Modal
      title='Create Confirmation Receipt'
      open={isVisible}
      onCancel={onCancel}
      okText='Create'
      cancelText='Cancel'
      width={800}
      className='modal-custom'
      onOk={handleCreate}
    >
      <div className='p-0'>
        <Title level={4} className='text-xl font-bold text-center'>
          Cộng hòa xã hội chủ nghĩa Việt Nam
          <br />
          Độc lập - Tự do - Hạnh Phúc
        </Title>
        <Title level={3} className='text-lg font-extrabold text-center'>
          BIÊN BẢN GIAO NHẬN
        </Title>
        <Title level={5} className='font-bold'>
          I. Bên A:
        </Title>
        {/* Bên A Fields */}
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              Họ và tên:
            </Text>
          </Col>
          <Col span={21}>
            <Input className='w-full mb-2 font-bold text-black' value='Jewelry Auction Company' readOnly />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              Địa chỉ:
            </Text>
          </Col>
          <Col span={21}>
            <Input
              className='w-full mb-2 font-bold text-black'
              value='S10.05(VHGP), Nguyen Xien Street, Long Binh Ward, Thu Duc District, Ho Chi Minh City'
              readOnly
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              Email:
            </Text>
          </Col>
          <Col span={21}>
            <Input className='w-full mb-2 font-bold text-black' value='ngocnhse160303@fpt.edu.vn' readOnly />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              Điện thoại:
            </Text>
          </Col>
          <Col span={21}>
            <Input className='w-full mb-2 font-bold text-black' value='02158945456' readOnly />
          </Col>
        </Row>

        <Title level={5} className='font-bold'>
          II. Bên B:
        </Title>
        {/* Bên B Fields */}
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              Họ và tên:
            </Text>
          </Col>
          <Col span={21}>
            <Input
              className='w-full mb-2 font-bold'
              value={`${record?.seller?.firstName} ${record?.seller?.lastName}`}
              readOnly
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              Địa chỉ:
            </Text>
          </Col>
          <Col span={21}>
            <Input className='w-full mb-2 font-bold' value={record?.seller?.address} readOnly />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              CCCD:
            </Text>
          </Col>
          <Col span={21}>
            <Input className='w-full mb-2 font-bold' value={record?.seller?.citizenIdentificationCard} readOnly />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              Ngày cấp:
            </Text>
          </Col>
          <Col span={21}>
            <Input
              className='w-full mb-2 font-bold'
              value={idIssuanceDate}
              onChange={(e) => setIdIssuanceDate(e.target.value)}
              readOnly
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              Hết hạn:
            </Text>
          </Col>
          <Col span={21}>
            <Input
              className='w-full mb-2 font-bold'
              value={idExpirationDate}
              onChange={(e) => setIdExpirationDate(e.target.value)}
              readOnly
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              Điện thoại:
            </Text>
          </Col>
          <Col span={21}>
            <Input className='w-full mb-2 font-bold' value={record?.seller?.phoneNumber} readOnly />
          </Col>
        </Row>

        <Title level={5} className='font-bold'>
          III. Nội dung xác nhận:
        </Title>
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              Jewelry Valuation Name:
            </Text>
          </Col>
          <Col span={21}>
            <Input className='w-full mb-2 font-bold' value={record?.name} readOnly />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              Ngày nhận hàng:
            </Text>
          </Col>
          <Col span={21}>
            <Input
              className='w-full mb-2 font-bold'
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}>
            <Text strong className='block mb-2'>
              Trạng thái sản phẩm:
            </Text>
          </Col>
          <Col span={21}>
            <Input
              className='w-full mb-2 font-bold'
              value={actualStatusOfJewelry}
              onChange={(e) => setActualStatusOfJewelry(e.target.value)}
            />
          </Col>
        </Row>
      </div>
    </Modal>
  )
}

export default CreateReceipt
