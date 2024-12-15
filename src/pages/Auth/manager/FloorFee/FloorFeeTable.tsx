import { useState } from 'react'
import { Table, Button, Form, InputNumber, message } from 'antd'
import { Floor } from '../../../../types/Floor.type'
import { useGetFloorFeeQuery, useUpdateFloorFeesMutation } from '../../../../services/dashboard.services'
import { parsePriceVND } from '../../../../utils/convertTypeDayjs'

const FloorFeeTable = () => {
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState<number | null>(null)
  const { data: floorFeesResponse, isLoading } = useGetFloorFeeQuery()
  const [updateFloorFee] = useUpdateFloorFeesMutation()

  const sortedData = Array.isArray(floorFeesResponse?.data)
    ? [...floorFeesResponse.data].sort((a, b) => a.from - b.from)
    : []

  const isEditing = (record: Floor) => record.id === editingKey

  const isHighestRange = (record: Floor) => {
    return record.from === Math.max(...sortedData.map((item) => item.from))
  }

  const edit = (record: Floor) => {
    form.setFieldsValue({ ...record })
    setEditingKey(record.id)
  }

  const cancel = () => {
    setEditingKey(null)
    form.resetFields()
  }

  const save = async (id: number) => {
    try {
      const row = await form.validateFields()
      const currentRecord = sortedData.find((item) => item.id === id)

      // Only validate to > from if it's not the highest range or if 'to' has a value
      if (!isHighestRange(currentRecord!) && row.to !== null && row.to <= row.from) {
        message.error('The "To" value must be greater than the "From" value')
        return
      }

      const updatedData = {
        id,
        from: row.from,
        to: row.to === null ? null : row.to,
        percent: row.percent
      }

      await updateFloorFee(updatedData).unwrap()
      setEditingKey(null)
      message.success('Floor fee updated successfully')
    } catch (error) {
      message.error('Failed to update floor fee')
      console.error('Error updating floor fee:', error)
    }
  }

  const columns = [
    {
      title: 'From',
      dataIndex: 'from',
      width: '25%',
      render: (_: any, record: Floor) => {
        const editable = isEditing(record)
        return editable ? (
          <Form.Item
            name='from'
            style={{ margin: 0 }}
            rules={[
              { required: true, message: 'Please input the from value!' },
              { type: 'number', min: 0, message: 'Value must be greater than or equal to 0' }
            ]}
          >
            <InputNumber
              min={0}
              className='w-full'
              onChange={() => {
                form.validateFields(['to'])
              }}
            />
          </Form.Item>
        ) : (
          parsePriceVND(record.from)
        )
      }
    },
    {
      title: 'To',
      dataIndex: 'to',
      width: '25%',
      render: (_: any, record: Floor) => {
        const editable = isEditing(record)
        const isHighest = isHighestRange(record)

        return editable ? (
          <Form.Item
            name='to'
            style={{ margin: 0 }}
            rules={[
              {
                required: !isHighest,
                message: 'Please input the to value!'
              },
              {
                type: 'number',
                min: 0,
                message: 'Value must be greater than or equal to 0',
                transform: (value) => (value === null ? 0 : value)
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const fromValue = getFieldValue('from')
                  // Skip validation if this is the highest range and value is null/empty
                  if (isHighest && (value === null || value === undefined)) {
                    return Promise.resolve()
                  }
                  if (!value || !fromValue || value > fromValue) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('To value must be greater than From value'))
                }
              })
            ]}
          >
            <InputNumber
              min={0}
              className='w-full'
              placeholder={isHighest ? 'Leave empty for infinity' : 'Enter value'}
            />
          </Form.Item>
        ) : record.to === null ? (
          'Infinity'
        ) : (
          parsePriceVND(record.to)
        )
      }
    },
    {
      title: 'Percent',
      dataIndex: 'percent',
      width: '25%',
      render: (_: any, record: Floor) => {
        const editable = isEditing(record)
        return editable ? (
          <Form.Item
            name='percent'
            style={{ margin: 0 }}
            rules={[
              { required: true, message: 'Please input the percent value!' },
              { type: 'number', min: 0, max: 100, message: 'Percent must be between 0 and 100' }
            ]}
          >
            <InputNumber min={0} max={100} formatter={(value) => `${value}%`} className='w-full' />
          </Form.Item>
        ) : (
          `${record.percent}%`
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_: any, record: Floor) => {
        const editable = isEditing(record)
        return editable ? (
          <span className='space-x-2'>
            <Button type='primary' onClick={() => save(record.id)} className='mr-2'>
              Save
            </Button>
            <Button onClick={cancel}>Cancel</Button>
          </span>
        ) : (
          <Button type='link' disabled={editingKey !== null} onClick={() => edit(record)}>
            Edit
          </Button>
        )
      }
    }
  ]

  return (
    <Form form={form}>
      <Table bordered dataSource={sortedData} columns={columns} rowKey='id' loading={isLoading} pagination={false} />
    </Form>
  )
}

export default FloorFeeTable
