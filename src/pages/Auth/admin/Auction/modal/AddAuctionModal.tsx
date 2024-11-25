import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, DatePicker, Button, message, Upload, UploadFile, Image } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  useCreateAuctionMutation,
  useGetAuctionByIdQuery,
  useUpdateAuctionMutation
} from '../../../../../services/auction.services'

interface AuctionPayload {
  Name: string
  StartTime: dayjs.Dayjs | null
  EndTime: dayjs.Dayjs | null
  Description: string
  FileImage?: File | Blob
  Id?: number
}

interface AuctionModalProps {
  visible: boolean
  onCancel: () => void
  id?: number | null
  setEditAuction?: React.Dispatch<React.SetStateAction<number>>
}

const AuctionModal: React.FC<AuctionModalProps> = ({ visible, onCancel, id, setEditAuction }) => {
  const { control, handleSubmit, reset, setValue, getValues } = useForm<AuctionPayload>({
    defaultValues: {
      StartTime: null,
      EndTime: null
    }
  })
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [isImageChanged, setIsImageChanged] = useState(false)

  const [createAuction, { isLoading: isCreating }] = useCreateAuctionMutation()
  const [updateAuction, { isLoading: isUpdating }] = useUpdateAuctionMutation()

  const { data: auctionData, isLoading: isLoadingAuction } = useGetAuctionByIdQuery(id!, {
    skip: !id
  })

  useEffect(() => {
    const fetchData = async () => {
      if (auctionData?.data && id) {
        const auction = auctionData.data

        setValue('Name', auction.name)
        setValue('StartTime', dayjs(auction.startTime))
        setValue('EndTime', dayjs(auction.endTime))
        setValue('Description', auction.description)

        if (auction.imageLink) {
          setFileList([
            {
              uid: '-1',
              name: 'Current Image',
              status: 'done',
              url: auction.imageLink
            }
          ])
        }
      }
    }

    fetchData()
    setIsImageChanged(false)
  }, [auctionData, id, setValue])

  const handleStartTimeChange = (value: dayjs.Dayjs | null) => {
    setValue('StartTime', value)
    const currentEndTime = getValues('EndTime')
    if (value && currentEndTime && value.isAfter(currentEndTime)) {
      setValue('EndTime', null)
    }
  }

  const handleEndTimeChange = (value: dayjs.Dayjs | null) => {
    setValue('EndTime', value)
    const currentStartTime = getValues('StartTime')
    if (value && currentStartTime && value.isBefore(currentStartTime)) {
      setValue('StartTime', null)
    }
  }

  const validateStartTime = (value: dayjs.Dayjs | null) => {
    if (!id) {
      if (!value) return 'Start time is required'
      if (value.isBefore(dayjs())) return 'Start time cannot be in the past'
      const endTime = getValues('EndTime')
      if (endTime && value.isAfter(endTime)) return 'Start time must be before end time'
      return true
    }
    return true
  }

  const validateEndTime = (value: dayjs.Dayjs | null) => {
    if (!value) return 'End time is required'
    const startTime = getValues('StartTime')
    if (startTime && value.isBefore(startTime)) return 'End time must be after start time'
    return true
  }

  const handleRemoveImage = () => {
    setFileList([])
    setIsImageChanged(true)
    setValue('FileImage', undefined)
  }

  const onSubmit = async (data: AuctionPayload) => {
    try {
      if (!data.StartTime || !data.EndTime) {
        message.error('Please select both start and end times')
        return
      }

      const formData = new FormData()
      formData.append('Name', data.Name)
      formData.append('StartTime', data.StartTime.toISOString())
      formData.append('EndTime', data.EndTime.toISOString())
      formData.append('Description', data.Description)

      if (id) {
        formData.append('AutionId', id.toString())
        if (isImageChanged) {
          if (data.FileImage instanceof File) {
            formData.append('FileImage', data.FileImage)
          }
        }
        await updateAuction(formData)
          .unwrap()
          .then((res) => {
            if (res.isSuccess) {
              message.success('Auction updated successfully')
              setEditAuction && setEditAuction(NaN)
            }
          })
      } else {
        if (!data.FileImage) {
          message.error('Please select an image')
          return
        }
        if (data.FileImage instanceof File) {
          formData.append('FileImage', data.FileImage)
        }
        await createAuction(formData)
          .unwrap()
          .then((res) => {
            if (res.isSuccess) {
              message.success('Auction created successfully')
            }
          })
      }

      reset()
      setFileList([])
      setIsImageChanged(false)
      onCancel()
    } catch (error) {
      message.error(id ? 'Failed to update auction' : 'Failed to create auction')
      console.error('Error:', error)
    }
  }

  const handleModalCancel = () => {
    reset()
    setFileList([])
    setIsImageChanged(false)
    onCancel()
    setEditAuction && setEditAuction(NaN)
  }

  const isLoading = isCreating || isUpdating || isLoadingAuction

  return (
    <Modal
      open={visible}
      title={id ? 'EDIT AUCTION' : 'ADD AUCTION'}
      onCancel={handleModalCancel}
      footer={null}
      width={500}
    >
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
            rules={{ validate: validateStartTime, required: 'Start time is required' }}
            render={({ field: { value, onChange, ...restField }, fieldState: { error } }) => (
              <Form.Item label='Start Time' validateStatus={error ? 'error' : ''} help={error?.message}>
                <DatePicker
                  {...restField}
                  showTime={{ format: 'HH:mm' }}
                  format='YYYY-MM-DD HH:mm'
                  className='w-full'
                  value={value}
                  onChange={(date) => handleStartTimeChange(date)}
                  disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
                  disabledTime={() => ({
                    disabledHours: () => {
                      const currentHour = dayjs().hour()
                      if (dayjs().isSame(value, 'day')) {
                        return Array.from({ length: currentHour }, (_, i) => i)
                      }
                      return []
                    },
                    disabledMinutes: (selectedHour) => {
                      if (dayjs().isSame(value, 'day') && selectedHour === dayjs().hour()) {
                        const currentMinute = dayjs().minute()
                        return Array.from({ length: currentMinute }, (_, i) => i)
                      }
                      return []
                    }
                  })}
                />
              </Form.Item>
            )}
          />

          <Controller
            name='EndTime'
            control={control}
            rules={{ validate: validateEndTime, required: 'End time is required' }}
            render={({ field: { value, onChange, ...restField }, fieldState: { error } }) => (
              <Form.Item label='End Time' validateStatus={error ? 'error' : ''} help={error?.message}>
                <DatePicker
                  {...restField}
                  showTime={{ format: 'HH:mm' }}
                  format='YYYY-MM-DD HH:mm'
                  className='w-full'
                  value={value}
                  onChange={(date) => handleEndTimeChange(date)}
                  disabledDate={(current) => {
                    const startTime = getValues('StartTime')
                    if (!startTime) return false
                    return current && current.isBefore(startTime, 'day')
                  }}
                  disabledTime={() => {
                    const startTime = getValues('StartTime')
                    if (!startTime || !value) return {}

                    if (startTime.isSame(value, 'day')) {
                      return {
                        disabledHours: () => Array.from({ length: startTime.hour() }, (_, i) => i),
                        disabledMinutes: (selectedHour) => {
                          if (selectedHour === startTime.hour()) {
                            return Array.from({ length: startTime.minute() }, (_, i) => i)
                          }
                          return []
                        }
                      }
                    }
                    return {}
                  }}
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
            rules={{
              required: !id ? 'Image is required' : undefined
            }}
            render={({ field: { onChange }, fieldState: { error } }) => (
              <Form.Item label='Image' validateStatus={error ? 'error' : ''} help={error?.message}>
                <div className='flex gap-2'>
                  <Upload
                    accept='image/*'
                    fileList={fileList}
                    beforeUpload={(file) => {
                      onChange(file)
                      setIsImageChanged(true)
                      setFileList([
                        {
                          uid: '-1',
                          name: file.name,
                          status: 'done',
                          url: URL.createObjectURL(file)
                        }
                      ])
                      return false
                    }}
                    onRemove={handleRemoveImage}
                  >
                    <Button icon={<UploadOutlined />}>{id ? 'Change Image' : 'Select File'}</Button>
                  </Upload>
                  {fileList.length > 0 && (
                    <Button icon={<DeleteOutlined />} onClick={handleRemoveImage} danger>
                      Remove
                    </Button>
                  )}
                </div>
                {fileList.length > 0 && fileList[0].url && (
                  <div className='mt-2'>
                    <Image src={fileList[0].url} alt='Auction' style={{ width: '100%' }} />
                  </div>
                )}
              </Form.Item>
            )}
          />

          <Form.Item>
            <Button type='primary' htmlType='submit' className='w-full' loading={isLoading}>
              {id ? 'UPDATE' : 'ADD'}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  )
}

export default AuctionModal
