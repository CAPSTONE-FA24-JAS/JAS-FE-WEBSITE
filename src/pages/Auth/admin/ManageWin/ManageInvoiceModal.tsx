import { Modal, Avatar, Button, notification } from 'antd'
import { useState } from 'react'
import { useFinishInvoiceMutation, useGetInvoiceByIdQuery } from '../../../../services/invoice.services'
import { stringToDate } from '../../../../utils/convertTypeDayjs'

interface ManageInvoiceModalProps {
  visible: boolean
  onCancel: () => void
  invoiceId: number | null
  setStatus: (status: string) => void
  refetch: () => void
}

export default function ManageInvoiceModal({
  visible,
  onCancel,
  invoiceId,
  setStatus,
  refetch
}: ManageInvoiceModalProps) {
  const { data: invoiceData, error, isLoading } = useGetInvoiceByIdQuery(invoiceId, { skip: !invoiceId })
  const [finishInvoice] = useFinishInvoiceMutation()
  const [isImageModalVisible, setImageModalVisible] = useState(false) // State for the image modal

  const handleFinish = async () => {
    if (invoiceData?.data?.status === 'Delivered') {
      try {
        const response = await finishInvoice({ invoiceId: invoiceData.data.id }).unwrap()
        notification.success({
          message: 'Success',
          description: response.message,
          placement: 'topRight'
        })
        setStatus('Finished')
        refetch()
        onCancel()
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to update status',
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
  console.log('Paid Times:', paidTimes)
  console.log('Delivering Times:', deliveringTimes)
  console.log('Delivered Times:', deliveredTimes)
  console.log('Finished Times:', finishedTimes)
  return (
    <>
      <Modal title={`Invoice Details: ${invoiceDetails.id}`} open={visible} onCancel={onCancel} footer={null}>
        <div className='flex space-x-4'>
          <div className='flex justify-center w-1/3 mt-5 mb-5'>
            <Avatar
              size={128}
              src={imageLinkJewelry}
              onClick={() => setImageModalVisible(true)}
              style={{ cursor: 'pointer' }}
            />
          </div>

          <div className='w-2/3 mt-5 mb-5 space-y-2'>
            <p>
              <strong className='mt-4 mb-2 text-lg font-extrabold'>{productName}</strong>
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
              <p className='font-bold text-red-700 ml-11'>{status}</p>
            </div>
          </div>
        </div>

        <div className='my-4 border-t border-gray-300'></div>

        <p className='mt-4 mb-2 text-lg font-extrabold'>Winner Information:</p>

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

        <div className='my-4 border-t border-gray-300'></div>

        <p className='mt-4 mb-2 text-lg font-extrabold'>Additional Information:</p>

        <div className='space-y-2'>
          {/* Display times based on current status */}
          {status === 'Paid' && paidTimes.length > 0 && (
            <div className='flex justify-between'>
              <strong>Payment Time:</strong>
              <p>{stringToDate(paidTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
          )}

          {status === 'Delivering' && (
            <>
              {paidTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Payment Time:</strong>
                  <p>{stringToDate(paidTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}

              {deliveringTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Delivering Time:</strong>
                  <p>{stringToDate(deliveringTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
            </>
          )}

          {status === 'Delivered' && (
            <>
              {paidTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Payment Time:</strong>
                  <p>{stringToDate(paidTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
              {deliveringTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Delivering Time:</strong>
                  <p>{stringToDate(deliveringTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
              {deliveredTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Delivered Time:</strong>
                  <p>{stringToDate(deliveredTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
            </>
          )}

          {status === 'Finished' && (
            <>
              {paidTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Payment Time:</strong>
                  <p>{stringToDate(paidTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
              {deliveringTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Delivering Time:</strong>
                  <p>{stringToDate(deliveringTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
              {deliveredTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Delivered Time:</strong>
                  <p>{stringToDate(deliveredTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
              {finishedTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Finished Time:</strong>
                  <p>{stringToDate(finishedTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
            </>
          )}
        </div>

        <h3 className='mb-2 font-semibold'>Total Amount:</h3>
        <p className='font-bold text-right'>₫{totalPrice.toLocaleString()}</p>

        {status === 'Delivered' && (
          <div className='flex justify-end' style={{ marginTop: 20 }}>
            <Button type='primary' onClick={handleFinish}>
              Finish Invoice
            </Button>
          </div>
        )}
      </Modal>

      {/* Full-size Image Modal */}
      <Modal open={isImageModalVisible} onCancel={() => setImageModalVisible(false)} footer={null} centered width={800}>
        <img src={imageLinkJewelry} alt='Full-Size Jewelry' style={{ width: '100%', height: 'auto' }} />
      </Modal>
    </>
  )
}
