import { Button, Form, Input, message, Modal } from 'antd'
import { useCancelByMangerToNoAuctionMutation } from '../../../../../services/jewelry.services'

// Props interface
interface CancelJewelryModalProps {
  jewelryId: number | null
  isOpen: boolean
  onClose: () => void
}

// Form values interface
interface CancelFormValues {
  reason: string
}

// Error response interface
interface ErrorResponse {
  data?: {
    message?: string
  }
  status?: number
}

const CancelJewelryModal = ({ jewelryId, isOpen, onClose }: CancelJewelryModalProps) => {
  const [form] = Form.useForm<CancelFormValues>()
  const [cancelJewelry, { isLoading }] = useCancelByMangerToNoAuctionMutation()

  const handleSubmit = async (values: CancelFormValues) => {
    try {
      if (jewelryId !== null) {
        await cancelJewelry({
          jewelryId: jewelryId.toString(),
          reason: values.reason
        }).unwrap()

        message.success('Jewelry canceled successfully')
        form.resetFields()
        onClose()
      }
    } catch (error) {
      const errorResponse = error as ErrorResponse
      const errorMessage = errorResponse.data?.message || 'Unknown error'
      message.error('Failed to cancel jewelry: ' + errorMessage)
    }
  }

  return (
    <Modal title='Cancel Jewelry' open={isOpen} onCancel={onClose} footer={null} destroyOnClose>
      <Form<CancelFormValues> form={form} layout='vertical' onFinish={handleSubmit} className='mt-4'>
        <Form.Item
          name='reason'
          label='Cancellation Reason'
          rules={[
            { required: true, message: 'Please enter a reason' },
            { min: 10, message: 'Reason must be at least 10 characters' }
          ]}
        >
          <Input.TextArea rows={4} placeholder='Please provide a reason for cancellation' className='w-full' />
        </Form.Item>

        <div className='flex justify-end gap-2 mt-4'>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='primary' htmlType='submit' loading={isLoading}>
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default CancelJewelryModal
