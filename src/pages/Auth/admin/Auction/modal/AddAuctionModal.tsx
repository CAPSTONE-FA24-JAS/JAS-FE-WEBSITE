import React from 'react'
import { Modal, Form, Input, DatePicker, Button, message } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import dayjs, { Dayjs } from 'dayjs'
import { useCreateAuctionMutation } from '../../../../../services/auction.service'

interface AuctionFormData {
  startTime: Dayjs
  endTime: Dayjs
  description: string
  location: string
  notes: string
}

interface AddAuctionModalProps {
  visible: boolean
  onCancel: () => void
}

const AddAuctionModal: React.FC<AddAuctionModalProps> = ({ visible, onCancel }) => {
  const { control, handleSubmit, reset } = useForm<AuctionFormData>()
  const [createAuction, { isLoading }] = useCreateAuctionMutation()

  const onSubmit = async (data: AuctionFormData) => {
    try {
      const auctionData = {
        ...data,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString()
      }

      await createAuction(auctionData).unwrap()
      message.success('Auction created successfully')
      reset() // Reset form fields
      onCancel() // Close the modal
    } catch (error) {
      message.error('Failed to create auction')
      console.error('Error creating auction:', error)
    }
  }

  return (
    <Modal open={visible} title='ADD AUCTION' onCancel={onCancel} footer={null} width={500}>
      <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
        <div className='space-y-4'>
          <Controller
            name='startTime'
            control={control}
            rules={{ required: 'Start time is required' }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item label='Start Time' validateStatus={error ? 'error' : ''} help={error?.message}>
                <DatePicker
                  showTime
                  {...field}
                  className='w-full'
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                />
              </Form.Item>
            )}
          />

          <Controller
            name='endTime'
            control={control}
            rules={{ required: 'End time is required' }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item label='End Time' validateStatus={error ? 'error' : ''} help={error?.message}>
                <DatePicker
                  showTime
                  {...field}
                  className='w-full'
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                />
              </Form.Item>
            )}
          />

          <Controller
            name='description'
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item label='Description' validateStatus={error ? 'error' : ''} help={error?.message}>
                <Input.TextArea {...field} className='w-full' />
              </Form.Item>
            )}
          />

          <Controller
            name='location'
            control={control}
            rules={{ required: 'Location is required' }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item label='Location' validateStatus={error ? 'error' : ''} help={error?.message}>
                <Input {...field} className='w-full' />
              </Form.Item>
            )}
          />

          <Controller
            name='notes'
            control={control}
            rules={{ required: 'Notes are required' }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item label='Notes' validateStatus={error ? 'error' : ''} help={error?.message}>
                <Input.TextArea {...field} className='w-full' />
              </Form.Item>
            )}
          />

          <Form.Item>
            <Button type='primary' htmlType='submit' className='w-full' loading={isLoading}>
              ADD
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default AddAuctionModal
