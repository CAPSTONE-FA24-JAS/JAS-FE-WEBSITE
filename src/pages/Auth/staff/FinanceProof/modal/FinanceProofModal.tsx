import { Button, Divider, Input, Modal, Skeleton, Space, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useGetFinanceProofByIdQuery,
  useUpdateFinanceProofMutation
} from '../../../../../services/financeProof.services'
import { RootState } from '../../../../../store'
import { EyeOutlined } from '@ant-design/icons'
import { parseDate, parsePriceVND } from '../../../../../utils/convertTypeDayjs'

interface FinancialProofModalProps {
  visible: boolean
  onClose: () => void
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  id: number
}

const FinancialProofModal: React.FC<FinancialProofModalProps> = ({ visible, onClose, id, setModalVisible }) => {
  const { data: financeProof, isLoading } = useGetFinanceProofByIdQuery(id)
  const [updateFinanceProof, { isLoading: isUpdating }] = useUpdateFinanceProofMutation()
  const [isSetLimitBidModalVisible, setIsSetLimitBidModalVisible] = useState(false)
  const [reasonReject, setReasonReject] = useState<boolean>(false)
  const [limitBid, setLimitBid] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const staffId = useSelector((state: RootState) => state.authLoginAPI.staffId) ?? 0

  const handleOpenDocument = (fileUrl: string) => {
    window.open(fileUrl, '_blank')
  }

  const showSetLimitBidModal = () => {
    setModalVisible(false)
    setIsSetLimitBidModalVisible(true)
  }
  const validateLimitBid = (value: string): boolean => {
    const cleanValue = value.replace(/[,\s]/g, '')
    const numValue = Number(cleanValue)

    if (!value.trim()) {
      message.error('Please enter a limit amount')
      return false
    }

    if (!/^\d+$/.test(cleanValue)) {
      message.error('Please enter numbers only')
      return false
    }

    if (numValue <= 0) {
      message.error('The limit must be a positive number')
      return false
    }

    return true
  }

  const handleLimitBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setLimitBid(value)
    }
  }

  const handleSetLimitBidOk = async () => {
    if (!validateLimitBid(limitBid)) {
      return
    }

    try {
      await updateFinanceProof({
        id,
        status: 1,
        priceLimit: Number(limitBid),
        reason: '',
        staffId: staffId
      }).unwrap()
      setIsSetLimitBidModalVisible(false)
      message.success('Limit bid set successfully')
    } catch (error) {
      console.error('Error updating finance proof:', error)
      message.error('Failed to set limit bid. Please try again.')
    }
  }

  const handleSetLimitBidCancel = () => {
    setIsSetLimitBidModalVisible(false)
    setLimitBid('')
  }

  const handleReject = () => {
    setReasonReject(true)
    setModalVisible(false)
  }

  const handleRejectOk = async () => {
    if (!note.trim()) {
      message.error('Please provide a reason for rejection')
      return
    }

    try {
      await updateFinanceProof({
        id,
        status: 4,
        priceLimit: 0,
        reason: note.trim(),
        staffId: staffId
      }).unwrap()
      setReasonReject(false)
      message.success('Finance proof rejected successfully')
    } catch (error) {
      console.error('Error rejecting finance proof:', error)
      message.error('Failed to reject finance proof. Please try again.')
    }
  }

  const handleRejectCancel = () => {
    setReasonReject(false)
    setNote('')
  }

  const renderFooter = () => {
    if (financeProof && financeProof?.data.status === 'Pending') {
      return [
        <Button key='reject' type='primary' danger onClick={handleReject}>
          Reject
        </Button>,
        <Button key='setLimitBid' type='primary' onClick={showSetLimitBidModal}>
          Set Limit Bid
        </Button>
      ]
    }
    return null
  }

  return (
    <>
      <Modal title='Financial Proof Details' open={visible} onCancel={onClose} footer={renderFooter()}>
        {isLoading ? (
          <Skeleton active />
        ) : financeProof ? (
          <div className='flex flex-col gap-4 mt-9'>
            <p>Customer Name: {financeProof.data.customerName}</p>
            <p>Create Date: {parseDate(financeProof.data.startDate, 'dd/mm/yyyy hh:mm:ss')}</p>
            <p>Expired Date: {parseDate(financeProof.data.expireDate, 'dd/mm/yyyy hh:mm:ss')}</p>
            {financeProof.data.priceLimit > 0 && (
              <Input placeholder='Limit Amount' value={parsePriceVND(financeProof.data.priceLimit)} disabled />
            )}
            <Divider />
            <div className='flex flex-row items-start gap-4'>
              <div className='flex-1'>
                <embed src={financeProof.data.file} width='300' height='200' />
              </div>
              <Button type='primary' icon={<EyeOutlined />} onClick={() => handleOpenDocument(financeProof.data.file)}>
                View Document
              </Button>
            </div>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </Modal>

      <Modal
        title='Set Limit Amount'
        open={isSetLimitBidModalVisible}
        onOk={handleSetLimitBidOk}
        onCancel={handleSetLimitBidCancel}
        footer={[
          <Button key='cancel' onClick={handleSetLimitBidCancel}>
            Cancel
          </Button>,
          <Button key='update' type='primary' onClick={handleSetLimitBidOk} loading={isUpdating}>
            Update
          </Button>
        ]}
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          <Input
            placeholder='Enter limit amount'
            value={limitBid}
            onChange={handleLimitBidChange}
            type='text'
            suffix='VND'
            required
          />
        </Space>
      </Modal>

      <Modal
        title='Reason for Rejection'
        open={reasonReject}
        onOk={handleRejectOk}
        onCancel={handleRejectCancel}
        footer={[
          <Button key='cancel' onClick={handleRejectCancel}>
            Cancel
          </Button>,
          <Button key='update' type='primary' onClick={handleRejectOk} loading={isUpdating}>
            Update
          </Button>
        ]}
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          <TextArea
            rows={4}
            placeholder='Please provide a reason for rejection'
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Space>
      </Modal>
    </>
  )
}

export default FinancialProofModal
