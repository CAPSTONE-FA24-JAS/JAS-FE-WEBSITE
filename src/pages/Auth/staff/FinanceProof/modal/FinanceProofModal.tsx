import React, { useState } from 'react'
import { Modal, Button, Input, DatePicker, Space, Divider } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import { FinanceProof } from '../FinanceProofList'
import { Dayjs } from 'dayjs'

interface FinancialProofModalProps {
  visible: boolean
  onClose: () => void
  financeProof: FinanceProof | null
}

const FinancialProofModal: React.FC<FinancialProofModalProps> = ({ visible, onClose, financeProof }) => {
  const [isSetLimitBidModalVisible, setIsSetLimitBidModalVisible] = useState(false)
  const [limitBid, setLimitBid] = useState<string>('')
  const [expiredDate, setExpiredDate] = useState<Dayjs | null>(null)

  const showSetLimitBidModal = () => {
    onClose()
    setIsSetLimitBidModalVisible(true)
  }

  const handleSetLimitBidOk = () => {
    setIsSetLimitBidModalVisible(false)
    // Here you would typically handle the submission of the limit bid
    console.log('Limit Bid:', limitBid)
    console.log('Expired Date:', expiredDate?.format('YYYY-MM-DD'))
    onClose()
  }

  const handleSetLimitBidCancel = () => {
    setIsSetLimitBidModalVisible(false)
  }

  const handleReject = () => {
    // Handle rejection logic here
    console.log('Rejected')
    onClose()
  }

  return (
    <>
      <Modal
        title='Financial Proof Details'
        visible={visible}
        onCancel={onClose}
        footer={[
          <Button key='reject' type='primary' danger onClick={handleReject}>
            Reject
          </Button>,
          <Button key='setLimitBid' type='primary' onClick={showSetLimitBidModal}>
            Set Limit Bid
          </Button>
        ]}
      >
        {financeProof && (
          <div className='flex flex-col gap-4 mt-9'>
            <p>Customer Name: {financeProof.name}</p>
            <p>Contact: {financeProof.contact}</p>
            <p>Create Date: {financeProof.createDate}</p>
            <p>Expired Date: {financeProof.expiredDate}</p>
            <Divider />
            <embed
              src='https://res.cloudinary.com/daqrnewnp/raw/upload/v1726735890/fphq7nnq5g9qrflbrzpf.pdf'
              width='300'
              height='200'
            />
          </div>
        )}
      </Modal>

      <Modal
        title='Set Limit Bid'
        visible={isSetLimitBidModalVisible}
        onOk={handleSetLimitBidOk}
        onCancel={handleSetLimitBidCancel}
        footer={[
          <Button key='cancel' onClick={handleSetLimitBidCancel}>
            Cancel
          </Button>,
          <Button key='update' type='primary' onClick={handleSetLimitBidOk}>
            Update
          </Button>
        ]}
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          <Input placeholder='Limit Bid' value={limitBid} onChange={(e) => setLimitBid(e.target.value)} prefix='$' />
          <DatePicker
            style={{ width: '100%' }}
            placeholder='Expired Date'
            onChange={(date) => setExpiredDate(date)}
            suffixIcon={<CalendarOutlined />}
          />
        </Space>
      </Modal>
    </>
  )
}

export default FinancialProofModal
