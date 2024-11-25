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
  const [isImageModalVisible, setImageModalVisible] = useState(false)

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
  const winnerAddress = invoiceDetails.addressToShip ?? 'N/A'
  const invoiceCode = invoiceDetails.id ?? 'N/A'
  const lotCode = invoiceDetails.myBidDTO?.lotDTO?.id ?? 'N/A'
  const customerLotCode = invoiceDetails.myBidDTO?.id ?? 'N/A'
  const nameLot = invoiceDetails.myBidDTO?.lotDTO?.title ?? 'N/A'
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

  const receivedImageLink = invoiceDetails.statusInvoiceDTOs?.find((item: any) => item.status === 'Recieved')?.imageLink
  const deliveredImageLink = invoiceDetails.statusInvoiceDTOs?.find(
    (item: any) => item.status === 'Delivered'
  )?.imageLink

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
                <strong>Status:</strong>
              </p>
              <p className='font-bold text-red-700 ml-11'>{status}</p>
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
        <div className='mb-2 space-y-2'>
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

          {status === 'Paid' && (
            <>
              {pendingpaymentTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Pending Payment Time:</strong>
                  <p>{stringToDate(pendingpaymentTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
              {paidTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Payment Time:</strong>
                  <p>{stringToDate(paidTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
            </>
          )}

          {status === 'Delivering' && (
            <>
              {pendingpaymentTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Pending Payment Time:</strong>
                  <p>{stringToDate(pendingpaymentTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}

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
              {pendingpaymentTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Pending Payment Time:</strong>
                  <p>{stringToDate(pendingpaymentTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}

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
              {pendingpaymentTimes.length > 0 && (
                <div className='flex justify-between'>
                  <strong>Pending Payment Time:</strong>
                  <p>{stringToDate(pendingpaymentTimes[0]).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
              )}
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

        {status === 'Delivered' && (
          <div className='flex justify-end' style={{ marginTop: 20 }}>
            <Button type='primary' onClick={handleFinish}>
              Finish Invoice
            </Button>
          </div>
        )}

        <div className='flex justify-between mb-2'>
          <p>
            <strong>Received Image:</strong>
          </p>
          <img src={receivedImageLink} alt='Received' style={{ width: '100px', height: 'auto' }} />
        </div>

        <div className='flex justify-between mb-2'>
          <p>
            <strong>Delivered Image:</strong>
          </p>
          <img src={deliveredImageLink} alt='Delivered' style={{ width: '100px', height: 'auto' }} />
        </div>
      </Modal>

      {/* Full-size Image Modal */}
      <Modal open={isImageModalVisible} onCancel={() => setImageModalVisible(false)} footer={null} centered width={800}>
        <img src={imageLinkJewelry} alt='Full-Size Jewelry' style={{ width: '100%', height: 'auto' }} />
      </Modal>
    </>
  )
}
