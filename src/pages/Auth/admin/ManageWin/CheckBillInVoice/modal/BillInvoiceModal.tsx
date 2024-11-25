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
  const winnerAddress = invoiceDetails.addressToShip ?? 'N/A'
  const invoiceCode = invoiceDetails.id ?? 'N/A'
  const lotCode = invoiceDetails.myBidDTO?.lotDTO?.id ?? 'N/A'
  const customerLotCode = invoiceDetails.myBidDTO?.id ?? 'N/A'
  const nameLot = invoiceDetails.myBidDTO?.lotDTO?.title ?? 'N/A'
  const typeProduction = invoiceDetails.myBidDTO?.lotDTO?.typeProduction ?? 'N/A'
  const bidPrice = invoiceDetails.myBidDTO?.yourMaxBidPrice ?? 'N/A'
  const platformFee = invoiceDetails.free ?? 'N/A'
  const shippingFee = invoiceDetails.feeShip ?? 'N/A'
  const historyTimes = invoiceDetails.myBidDTO?.historyCustomerLots || []
  const createinvoiceTimes = historyTimes
    .filter((item: any) => item.status === 'CreateInvoice')
    .map((item: any) => item.currentTime)
  const pendingpaymentTimes = historyTimes
    .filter((item: any) => item.status === 'PendingPayment')
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
                <strong>Status:</strong>
              </p>
              <p className='ml-11 font-bold text-red-700'>{status}</p>
            </div>
          </div>
        </div>

        <div className='my-4 border-t border-gray-300'></div>

        <p className='mt-4 mb-2 text-lg font-extrabold uppercase'>Customer Information:</p>
        <div className='my-4 border-t border-gray-300'></div>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Customer Name:</strong>
          </p>
          <p className='font-bold text-gray-600'>{winnerName}</p>
        </div>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Phone:</strong>
          </p>
          <p className='font-bold text-gray-600'>{winnerPhone}</p>
        </div>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Email:</strong>
          </p>
          <p className='font-bold text-gray-600'>{winnerEmail}</p>
        </div>

        <div className='flex justify-between'>
          <p>
            <strong>Address:</strong>
          </p>
          <p className='font-bold text-gray-600'>{winnerAddress}</p>
        </div>
        <div className='my-4 border-t border-gray-300'></div>

        <p className='mt-4 mb-2 text-lg font-extrabold uppercase'>Order Information:</p>
        <div className='my-4 border-t border-gray-300'></div>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Invoice Code:</strong>
          </p>
          <p className='font-bold text-gray-600'>#{invoiceCode}</p>
        </div>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Lot Code:</strong>
          </p>
          <p className='font-bold text-gray-600'>#{lotCode}</p>
        </div>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Customer Lot Code:</strong>
          </p>
          <p className='font-bold text-gray-600'>#{customerLotCode}</p>
        </div>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Name Lot:</strong>
          </p>
          <p className='font-bold text-gray-600'>{nameLot}</p>
        </div>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Type of production:</strong>
          </p>
          <p className='font-bold text-gray-600'></p>
        </div>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Bid Price:</strong>
          </p>
          <p className='font-bold text-gray-600'>{bidPrice.toLocaleString()}₫</p>
        </div>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Platform Fee:</strong>
          </p>
          <p className='font-bold text-gray-600'>{platformFee.toLocaleString()}₫</p>
        </div>
        <div className='flex justify-between mb-2'>
          <p>
            <strong>Shipping Fee:</strong>
          </p>
          <p className='font-bold text-gray-600'>{shippingFee.toLocaleString()}₫</p>
        </div>

        <div className='my-4 border-t border-gray-300'></div>

        <div className='flex justify-between mb-2 font-extrabold'>
          <p>
            <strong>Total Amount:</strong>
          </p>
          <p className='font-extrabold '>{totalPrice.toLocaleString()}₫</p>
        </div>
        <div className='space-y-2'>
          {status === 'CreateInvoice' && (
            <div className='flex justify-between'>
              <strong>Create Invoice Time:</strong>
              <p>{stringToDate(createinvoiceTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          )}
          {status === 'PendingPayment' && (
            <>
              {createinvoiceTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Create Invoice Time:</strong>
                  <p>{stringToDate(createinvoiceTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
              {pendingpaymentTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Pending Payment Time:</strong>
                  <p>{stringToDate(pendingpaymentTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
            </>
          )}
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
