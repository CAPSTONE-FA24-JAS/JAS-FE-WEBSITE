import { Button, Divider, InputNumber, Modal, Skeleton, Space, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState } from 'react'
import {
  useGetFinanceProofByIdQuery,
  useUpdateFinanceProofMutation
} from '../../../../../services/financeProof.services'

interface FinancialProofModalProps {
  visible: boolean
  onClose: () => void
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  id: number
}

const FinancialProofModal: React.FC<FinancialProofModalProps> = ({ visible, onClose, id, setModalVisible }) => {
  const { data: financeProof, isLoading } = useGetFinanceProofByIdQuery(id)
  const [updateFinanceProof, { isLoading: isUpdating }] = useUpdateFinanceProofMutation()
  const [reasonReject, setReasonReject] = useState<boolean>(false)
  const [note, setNote] = useState<string>('')

  const handleSetLimitBidOk = async () => {
    setModalVisible(false)
    try {
      await updateFinanceProof({
        id,
        status: 2,
        priceLimit: financeProof?.data.priceLimit ?? 0,
        reason: '',
        staffId: financeProof?.data.staffId ?? 0
      }).unwrap()
      message.success('Limit bid set successfully')
    } catch (error) {
      console.error('Error updating finance proof:', error)
      message.error('Failed to set limit bid. Please try again.')
    }
  }

  const handleReject = () => {
    setReasonReject(true)
    setModalVisible(false)
  }

  const handleRejectOk = async () => {
    setReasonReject(false)
    try {
      await updateFinanceProof({
        id,
        status: 3,
        priceLimit: financeProof?.data.priceLimit ?? 0,
        reason: note,
        staffId: financeProof?.data.staffId ?? 0
      }).unwrap()
      message.success('Finance proof rejected successfully')
    } catch (error) {
      console.error('Error rejecting finance proof:', error)
      message.error('Failed to reject finance proof. Please try again.')
    }
  }

  const handleRejectCancel = () => {
    setReasonReject(false)
  }

  return (
    <>
      <Modal
        title='Financial Proof Details'
        open={visible}
        onCancel={onClose}
        footer={
          financeProof?.data.status == 'Processing'
            ? [
                <Button key='reject' type='primary' danger onClick={handleReject}>
                  Reject
                </Button>,
                <Button loading={isUpdating} key='setLimitBid' type='primary' onClick={handleSetLimitBidOk}>
                  Set Limit Bid
                </Button>
              ]
            : null
        }
      >
        {isLoading ? (
          <Skeleton active />
        ) : financeProof ? (
          <div className='flex flex-col gap-4 mt-9'>
            <p>Customer Name: {financeProof.data.customerName}</p>
            <p>Create Date: {financeProof.data.startDate}</p>
            <p>Expired Date: {financeProof.data.expireDate}</p>
            <InputNumber
              className='w-[70%]'
              placeholder='Limit Bid'
              value={financeProof.data.priceLimit}
              disabled
              prefix='$'
            />
            <p>Reason: {financeProof.data?.reason}</p>
            <Divider />
            <embed src={financeProof.data.file} width='300' height='200' />
          </div>
        ) : (
          <p>No data available</p>
        )}
      </Modal>

      <Modal
        title='Reason for Reject'
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
          <TextArea rows={4} placeholder='Reason' value={note} onChange={(e) => setNote(e.target.value)} />
        </Space>
      </Modal>
    </>
  )
}

export default FinancialProofModal
