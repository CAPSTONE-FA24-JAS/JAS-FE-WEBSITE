import { Modal, Avatar, Button, notification } from 'antd'
import { useState } from 'react'
import { stringToDate } from '../../../../../../utils/convertTypeDayjs'
import {
  useGetInvoiceByIdQuery,
  useApprovePaymentByBankTransferMutation
} from '../../../../../../services/invoice.services'

interface ManageInvoiceModalProps {
  visible: boolean
  onCancel: () => void
  invoiceId: number | null
  setStatus: (status: string) => void
  refetch: () => void
}

export default function BillInvoiceModal({
  visible,
  onCancel,
  invoiceId,
  setStatus,
  refetch
}: ManageInvoiceModalProps) {
  const { data: invoiceData, error, isLoading } = useGetInvoiceByIdQuery(invoiceId, { skip: !invoiceId })
  const [approvePayment, { isLoading: isApproving }] = useApprovePaymentByBankTransferMutation()
  const [isImageModalVisible, setImageModalVisible] = useState(false)

  const handleApprovePayment = async () => {
    if (invoiceId && invoiceDetails.status === 'PendingPayment') {
      try {
        const response = await approvePayment({ invoiceId }).unwrap()
        notification.success({
          message: 'Payment Approved',
          description: response.message,
          placement: 'topRight'
        })
        setStatus('Paid')
        refetch()
        onCancel()
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to approve payment',
          placement: 'topRight'
        })
      }
    }
  }

  if (isLoading) return <p>Loading invoice data...</p>
  if (error) return <p>Error loading invoice data.</p>
  if (!invoiceData?.data) return <p>No invoice data available.</p>

  const invoiceDetails = invoiceData.data
  const totalPrice = invoiceDetails.totalPrice ?? 0
  const productName = invoiceDetails.productName ?? 'Unknown Product'
  const status = invoiceDetails.status ?? 'Unknown Status'
  const imageLinkJewelry = invoiceDetails.myBidDTO?.lotDTO?.imageLinkJewelry ?? '/default-image.png'
  const winnerName = invoiceDetails.winnerName ?? 'N/A'
  const winnerPhone = invoiceDetails.winnerPhone ?? 'N/A'
  const winnerEmail = invoiceDetails.winnerEmail ?? 'N/A'

  const historyTimes = invoiceDetails.myBidDTO?.historyCustomerLots || []
  const paidTimes = historyTimes.filter((item: any) => item.status === 'Paid').map((item: any) => item.currentTime)
  const deliveringTimes = historyTimes
    .filter((item: any) => item.status === 'Delivering')
    .map((item: any) => item.currentTime)
  const deliveredTimes = historyTimes
    .filter((item: any) => item.status === 'Delivered')
    .map((item: any) => item.currentTime)
  const finishedTimes = historyTimes
    .filter((item: any) => item.status === 'Finished')
    .map((item: any) => item.currentTime)

  return (
    <>
      <Modal title={`Invoice Details: ${invoiceDetails.id}`} open={visible} onCancel={onCancel} footer={null}>
        <div className='flex space-x-4'>
          <div className='w-1/3 flex justify-center mt-5 mb-5'>
            <Avatar
              size={128}
              src={imageLinkJewelry}
              onClick={() => setImageModalVisible(true)}
              style={{ cursor: 'pointer' }}
            />
          </div>

          <div className='w-2/3 space-y-2 mt-5 mb-5'>
            <p>
              <strong className='font-extrabold mt-4 mb-2 text-lg'>{productName}</strong>
            </p>

            <div className='flex'>
              <p>
                <strong>Total Price:</strong>
              </p>
              <p className='ml-4 font-bold text-gray-600'>{totalPrice.toLocaleString()}₫</p>
            </div>
            <div className='flex'>
              <p>
                <strong>Status:</strong>
              </p>
              <p className='ml-11 font-bold text-red-700'>{status}</p>
            </div>
          </div>
        </div>

        <div className='border-t border-gray-300 my-4'></div>

        <p className='font-extrabold mt-4 mb-2 text-lg'>Winner Information:</p>

        <div className='flex justify-between mb-4'>
          <p>
            <strong>Customer Name:</strong>
          </p>
          <p className='font-bold text-gray-600'>{winnerName}</p>
        </div>
        <div className='flex justify-between mb-4'>
          <p>
            <strong>Phone:</strong>
          </p>
          <p className='font-bold text-gray-600'>{winnerPhone}</p>
        </div>
        <div className='flex justify-between'>
          <p>
            <strong>Email:</strong>
          </p>
          <p className='font-bold text-gray-600'>{winnerEmail}</p>
        </div>

        <div className='border-t border-gray-300 my-4'></div>

        <p className='font-extrabold mt-4 mb-2 text-lg'>Additional Information:</p>

        <div className='space-y-2'>
          {/* Display times based on current status */}
          {status === 'Paid' && paidTimes.length > 0 && (
            <div className='flex justify-between'>
              <strong>Payment Time:</strong>
              <p>{stringToDate(paidTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          )}
          {/* Additional status times can be displayed here */}
        </div>

        {status === 'PendingPayment' && (
          <div className='flex justify-end mt-4'>
            <Button type='primary' loading={isApproving} onClick={handleApprovePayment}>
              Approve Payment
            </Button>
          </div>
        )}
      </Modal>

      <Modal open={isImageModalVisible} onCancel={() => setImageModalVisible(false)} footer={null} centered width={800}>
        <img src={imageLinkJewelry} alt='Full-Size Jewelry' style={{ width: '100%', height: 'auto' }} />
      </Modal>
    </>
  )
}
