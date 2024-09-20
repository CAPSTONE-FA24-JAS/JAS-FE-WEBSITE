import { Button, Col, Input, InputNumber, notification, Row, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCreatePreliminaryMutation, useGetValuationByIdQuery } from '../../../../services/valuation.services'

const { Title } = Typography

const CreatePreliminaryValuation = () => {
  const [formValues, setFormValues] = useState({
    customerName: '',
    jewelryName: '',
    weight: 0,
    height: 0,
    depth: 0,
    desiredPrice: 0,
    description: ''
  })

  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useGetValuationByIdQuery({ id: Number(id) })
  const [createPreliminary, { isLoading: isCreating }] = useCreatePreliminaryMutation()

  useEffect(() => {
    if (data && data.data) {
      const { data: valuationData } = data
      setFormValues({
        customerName: valuationData.seller ? `${valuationData.seller.firstName} ${valuationData.seller.lastName}` : '',
        jewelryName: valuationData.name || '',
        weight: valuationData.width || 0,
        height: valuationData.height || 0,
        depth: valuationData.depth || 0,
        description: valuationData.description || '',
        desiredPrice: formValues.desiredPrice // Giữ nguyên giá trị preliminaryPrice hiện tại
      })
    }
  }, [data])

  const handlePriceChange = (value: number | null) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      desiredPrice: value || 0
    }))
  }

  const handleCreatePreliminary = async () => {
    console.log('Submitting preliminary valuation with the following data:', {
      id: Number(id),
      status: 'Preliminary Valued',
      DesiredPrice: formValues.desiredPrice
    })

    try {
      const response = await createPreliminary({
        id: Number(id),
        status: 'Preliminary Valued',
        DesiredPrice: formValues.desiredPrice
      }).unwrap()

      console.log('API response:', response)

      notification.success({
        message: 'Success',
        description: 'Preliminary valuation created successfully!'
      })

      navigate('/staff/valuationList')
    } catch (error) {
      console.error('Failed to create preliminary valuation:', error)
      notification.error({
        message: 'Error',
        description: 'Failed to create preliminary valuation. Please try again later.'
      })
    }
  }

  const handleBack = () => {
    navigate(-1) // Navigate back to the previous page
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='p-4'>
      <Title level={2} className='mb-4'>
        Create Preliminary Valuation
      </Title>
      <div className='max-w-4xl mx-auto'>
        <Row gutter={16}>
          <Col span={12}>
            <div className='mb-4'>
              <label htmlFor='customerName' className='block mb-2 text-sm font-medium text-gray-900'>
                Customer Name
              </label>
              <Input
                id='customerName'
                value={formValues.customerName}
                readOnly
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
              />
            </div>
          </Col>
          <Col span={12}>
            <div className='mb-4'>
              <label htmlFor='jewelryName' className='block mb-2 text-sm font-medium text-gray-900'>
                Jewelry Name
              </label>
              <Input
                id='jewelryName'
                value={formValues.jewelryName}
                readOnly
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
              />
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <div className='mb-4'>
              <label htmlFor='weight' className='block mb-2 text-sm font-medium text-gray-900'>
                Weight
              </label>
              <InputNumber
                id='weight'
                value={formValues.weight}
                readOnly
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
              />
            </div>
          </Col>
          <Col span={12}>
            <div className='mb-4'>
              <label htmlFor='height' className='block mb-2 text-sm font-medium text-gray-900'>
                Height
              </label>
              <InputNumber
                id='height'
                value={formValues.height}
                readOnly
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
              />
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <div className='mb-4'>
              <label htmlFor='depth' className='block mb-2 text-sm font-medium text-gray-900'>
                Depth
              </label>
              <InputNumber
                id='depth'
                value={formValues.depth}
                readOnly
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
              />
            </div>
          </Col>
          <Col span={12}>
            <div className='mb-4'>
              <label htmlFor='preliminaryPrice' className='block mb-2 text-sm font-medium text-gray-900'>
                Preliminary Price
              </label>
              <InputNumber
                id='preliminaryPrice'
                min={0}
                value={formValues.desiredPrice}
                onChange={handlePriceChange}
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
              />
            </div>
          </Col>
        </Row>
        <div className='mb-4'>
          <label htmlFor='description' className='block mb-2 text-sm font-medium text-gray-900'>
            Description
          </label>
          <Input.TextArea
            id='description'
            rows={4}
            value={formValues.description}
            readOnly
            className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5'
          />
          <div className='flex justify-between gap-4 mt-4'>
            <Button onClick={handleBack} className='bg-gray-200 text-gray-800'>
              Back
            </Button>
            <Button type='primary' onClick={handleCreatePreliminary} loading={isCreating}>
              Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePreliminaryValuation