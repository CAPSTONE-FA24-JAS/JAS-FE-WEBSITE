import { Modal, Typography, Input, Row, Col, message, Select, InputNumber } from 'antd'
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
  accountDTO: {
    phoneNumber: string
  }
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
  refetch: () => void
}

const { Option } = Select

const CreateReceipt: React.FC<CreateReceiptProps> = ({ isVisible, onCancel, onCreate, record, refetch }) => {
  const [actualStatusOfJewelry, setActualStatusOfJewelry] = useState(record?.actualStatusOfJewelry || '')
  const [note, setnote] = useState('')
  const [khoiluong, setkhoiluong] = useState('')
  const [jewelryName, setjewlryName] = useState('')
  const [deliveryDate, setDeliveryDate] = useState<string>(dateToString(dayjs()))
  const [idIssuanceDate, setIdIssuanceDate] = useState<string>(record?.seller?.idIssuanceDate || '')
  const [idExpirationDate, setIdExpirationDate] = useState<string>(record?.seller?.idExpirationDate || '')

  const [createReceipt] = useCreateReceiptMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({ actualStatusOfJewelry: false, khoiluong: false, jewelryName: false })

  const productStatusOptions = [
    'Rất tốt ',
    'Tốt ',
    'Hư hại nhẹ ',
    'Hư hại nghiêm trọng ',
    'Thiếu phụ kiện ',
    'Không đạt tiêu chuẩn ',
    'Giả mạo '
  ]

  const handleCreate = async () => {
    // Kiểm tra validation
    const validationErrors = {
      actualStatusOfJewelry: !actualStatusOfJewelry.trim(),
      khoiluong: !khoiluong.trim(),
      jewelryName: !jewelryName.trim()
    }
    setErrors(validationErrors)

    if (Object.values(validationErrors).some((error) => error)) {
      message.error('Vui lòng điền đầy đủ các trường bắt buộc!')
      return
    }

    setIsLoading(true)
    const requestData = {
      id: record?.id,
      actualStatusOfJewelry,
      note,
      khoiluong,
      jewelryName,
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
      refetch()
    } catch (error) {
      console.error('Failed to create receipt:', error)
    } finally {
      setIsLoading(false)
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
      confirmLoading={isLoading}
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
              value='Lô E2a-7, Đường D1, Long Thạnh Mỹ, Thành phố Thủ Đức, Hồ Chí Minh'
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
            <Input className='w-full mb-2 font-bold text-black' value=' NguyenVanStaff@gmail.com' readOnly />
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
            <Input className='w-full mb-2 font-bold' value={record?.seller?.accountDTO?.phoneNumber} readOnly />
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
          <Col span={12}>
            <Row gutter={16}>
              <Col span={24}>
                <Text strong className='block mb-2'>
                  Trạng thái sản phẩm: <span style={{ color: 'red' }}>*</span>
                </Text>
                <Select
                  className={`w-full mb-2 font-bold ${errors.actualStatusOfJewelry ? 'border-red-500' : ''}`}
                  value={actualStatusOfJewelry}
                  onChange={(value) => setActualStatusOfJewelry(value)}
                >
                  {productStatusOptions.map((status, index) => (
                    <Option key={index} value={status}>
                      {status}
                    </Option>
                  ))}
                </Select>
                {errors.actualStatusOfJewelry && <Text className='text-red-500'>Trường này là bắt buộc.</Text>}
              </Col>
              <Col span={24}>
                <Text strong className='block mb-2'>
                  Khối Lượng (g): <span style={{ color: 'red' }}>*</span>
                </Text>
                <InputNumber
                  className={`w-full mb-2 font-bold ${errors.khoiluong ? 'border-red-500' : ''}`}
                  value={khoiluong ? parseFloat(khoiluong) : 0}
                  onChange={(value) => setkhoiluong((value ?? 0).toString())}
                  min={0}
                  step={0.1}
                  formatter={(value) => `${value} g`}
                  parser={(value) => parseFloat(value?.replace(' g', '') || '0')}
                />
                {errors.khoiluong && <Text className='text-red-500'>Trường này là bắt buộc.</Text>}
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row gutter={16}>
              <Col span={24}>
                <Text strong className='block mb-2'>
                  Tên sản phẩm: <span style={{ color: 'red' }}>*</span>
                </Text>
                <Input
                  className={`w-full mb-2 font-bold ${errors.jewelryName ? 'border-red-500' : ''}`}
                  value={jewelryName}
                  onChange={(e) => setjewlryName(e.target.value)}
                />
                {errors.jewelryName && <Text className='text-red-500'>Trường này là bắt buộc.</Text>}
              </Col>
              <Col span={24}>
                <Text strong className='block mb-2'>
                  Ghi chú:
                </Text>
                <Input className='w-full mb-2 font-bold' value={note} onChange={(e) => setnote(e.target.value)} />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </Modal>
  )
}

export default CreateReceipt
