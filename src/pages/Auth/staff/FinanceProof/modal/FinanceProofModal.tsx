import { Button, Divider, Input, Modal, Skeleton, Space, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useGetFinanceProofByIdQuery,
  useUpdateFinanceProofMutation
} from '../../../../../services/financeProof.services'
import { RootState } from '../../../../../store'

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

  const showSetLimitBidModal = () => {
    setModalVisible(false)
    setIsSetLimitBidModalVisible(true)
  }

  const handleSetLimitBidOk = async () => {
    setIsSetLimitBidModalVisible(false)
    try {
      await updateFinanceProof({
        id,
        status: 1,
        priceLimit: Number(limitBid),
        reason: '',
        staffId
      }).unwrap()
      message.success('Limit bid set successfully')
    } catch (error) {
      console.error('Error updating finance proof:', error)
      message.error('Failed to set limit bid. Please try again.')
    }
  }

  const handleSetLimitBidCancel = () => {
    setIsSetLimitBidModalVisible(false)
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
        status: 4,
        priceLimit: 0,
        reason: note,
        staffId
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
          financeProof && financeProof?.data.status == 'Pending'
            ? [
                <Button key='reject' type='primary' danger onClick={handleReject}>
                  Reject
                </Button>,
                <Button key='setLimitBid' type='primary' onClick={showSetLimitBidModal}>
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
            {financeProof && financeProof.data.priceLimit ? (
              <Input placeholder='Limit Bid' value={financeProof.data.priceLimit} disabled prefix='$' />
            ) : null}

            <Divider />

            <embed src={financeProof.data.file} width='300' height='200' />
          </div>
        ) : (
          <p>No data available</p>
        )}
      </Modal>

      <Modal
        title='Set Limit Bid'
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
          <Input placeholder='Limit Bid' value={limitBid} onChange={(e) => setLimitBid(e.target.value)} prefix='$' />
        </Space>
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
