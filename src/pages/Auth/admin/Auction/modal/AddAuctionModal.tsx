import React, { useState } from 'react'
import { Modal, Form, Input, DatePicker, Button, message, Upload, UploadFile } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import dayjs from 'dayjs'
import { useCreateAuctionMutation } from '../../../../../services/auction.services'
import { UploadOutlined } from '@ant-design/icons'

interface CreateAuctionPayload {
  Name: string
  StartTime: dayjs.Dayjs
  EndTime: dayjs.Dayjs
  Description: string
  FileImage: File | Blob
}

interface AddAuctionModalProps {
  visible: boolean
  onCancel: () => void
}

const AddAuctionModal: React.FC<AddAuctionModalProps> = ({ visible, onCancel }) => {
  const { control, handleSubmit, reset } = useForm<CreateAuctionPayload>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [createAuction, { isLoading }] = useCreateAuctionMutation()

  const onSubmit = async (data: CreateAuctionPayload) => {
    try {
      const formData = new FormData()
      formData.append('Name', data.Name)
      formData.append('StartTime', data.StartTime.toISOString())
      formData.append('EndTime', data.EndTime.toISOString())
      formData.append('Description', data.Description)
      formData.append('FileImage', data.FileImage)

      await createAuction(formData)
        .unwrap()
        .then((res) => {
          if (res.isSuccess) message.success('Auction created successfully')
        })
      reset()
      onCancel()
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
            name='Name'
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item label='Name' validateStatus={error ? 'error' : ''} help={error?.message}>
                <Input {...field} className='w-full' />
              </Form.Item>
            )}
          />

          <Controller
            name='StartTime'
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
            name='EndTime'
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
            name='Description'
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field, fieldState: { error } }) => (
              <Form.Item label='Description' validateStatus={error ? 'error' : ''} help={error?.message}>
                <Input.TextArea {...field} className='w-full' />
              </Form.Item>
            )}
          />

          <Controller
            name='FileImage'
            control={control}
            rules={{ required: 'Image is required' }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Form.Item label='Image' validateStatus={error ? 'error' : ''} help={error?.message}>
                <Upload
                  accept='image/*'
                  beforeUpload={(file) => {
                    onChange(file)
                    return false
                  }}
                  fileList={
                    value
                      ? [
                          {
                            uid: '-1',
                            name: (value as File).name,
                            status: 'done',
                            url: URL.createObjectURL(value as Blob)
                          }
                        ]
                      : []
                  }
                  onRemove={() => onChange(null)}
                >
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
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
