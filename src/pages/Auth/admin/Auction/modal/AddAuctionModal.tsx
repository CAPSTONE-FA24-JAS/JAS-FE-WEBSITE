import { useState } from 'react'
import { Modal, Form, Input, DatePicker, TimePicker, Select, Button, Upload, Image } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { PlusOutlined } from '@ant-design/icons'
import type { GetProp, UploadFile, UploadProps } from 'antd'

const { Option } = Select

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

interface AuctionFormData {
  title: string
  description: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  staff: string
  image: UploadFile[]
}

interface AddAuctionModalProps {
  visible: boolean
  onCancel: () => void
  onAdd: (data: AuctionFormData) => void
}

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const AddAuctionModal = (props: AddAuctionModalProps) => {
  const { visible, onCancel, onAdd } = props
  const { control, handleSubmit } = useForm()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const onSubmit = (data: any) => {
    console.log(data)
    onAdd({ ...data, images: fileList })
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList)

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <Modal open={visible} title='ADD AUCTION' onCancel={onCancel} footer={null} width={500}>
      <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
        <div className='space-y-4'>
          <Controller
            name='title'
            control={control}
            rules={{ required: 'Title is required' }}
            render={({ field }) => (
              <Form.Item label='Title Auction'>
                <Input {...field} className='w-full' />
              </Form.Item>
            )}
          />

          <Controller
            name='description'
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <Form.Item label='Description'>
                <Input.TextArea {...field} className='w-full' />
              </Form.Item>
            )}
          />

          <div className='grid grid-cols-2 gap-4'>
            <Controller
              name='startDate'
              control={control}
              rules={{ required: 'Start date is required' }}
              render={({ field }) => (
                <Form.Item label='Start Date'>
                  <DatePicker {...field} className='w-full' />
                </Form.Item>
              )}
            />

            <Controller
              name='startTime'
              control={control}
              rules={{ required: 'Start time is required' }}
              render={({ field }) => (
                <Form.Item label='Start Time'>
                  <TimePicker {...field} className='w-full' format='HH:mm' />
                </Form.Item>
              )}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Controller
              name='endDate'
              control={control}
              rules={{ required: 'End date is required' }}
              render={({ field }) => (
                <Form.Item label='End Date'>
                  <DatePicker {...field} className='w-full' />
                </Form.Item>
              )}
            />

            <Controller
              name='endTime'
              control={control}
              rules={{ required: 'End time is required' }}
              render={({ field }) => (
                <Form.Item label='End Time'>
                  <TimePicker {...field} className='w-full' format='HH:mm' />
                </Form.Item>
              )}
            />
          </div>

          <Controller
            name='staff'
            control={control}
            rules={{ required: 'Staff is required' }}
            render={({ field }) => (
              <Form.Item label='Staff'>
                <Select {...field} className='w-full'>
                  <Option value='Nguyễn Văn L'>Nguyễn Văn L</Option>
                </Select>
              </Form.Item>
            )}
          />

          <Form.Item label='Images:'>
            <Upload
              beforeUpload={(file) => {}} // Prevent upload
              listType='picture-card'
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 4 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' className='w-full'>
              ADD
            </Button>
          </Form.Item>
        </div>
      </Form>

      <Image
        style={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible)
        }}
        src={previewImage}
      />
    </Modal>
  )
}

export default AddAuctionModal
