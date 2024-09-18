import { Button, Col, Input, InputNumber, Row, Typography } from 'antd'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useCreatePreliminaryMutation, useGetValuationByIdQuery } from '../../../../services/valuation.services'

const { Title } = Typography

const CreatePreliminaryValuation = () => {
  const [formValues, setFormValues] = useState({
    customerName: '',
    jewelryName: '',
    weight: 0,
    height: 0,
    depth: 0,
    preliminaryPrice: 0,
    description: ''
  })

  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useGetValuationByIdQuery({
    id: Number(id)
  })
  const [createPreliminary] = useCreatePreliminaryMutation()

  useEffect(() => {
    if (data) {
      setFormValues({
        customerName: data.seller ? `${data.seller.firstName} ${data.seller.lastName}` : '',
        jewelryName: data.name,
        weight: data.width,
        height: data.height,
        depth: data.depth,
        preliminaryPrice: data.desiredPrice || 0,
        description: data.description
      })
    }
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const handleCreate = async () => {
    try {
      const response = await createPreliminary({
        name: formValues.jewelryName,
        height: formValues.height,
        width: formValues.weight,
        depth: formValues.depth,
        desiredPrice: formValues.preliminaryPrice,
        description: formValues.description
      }).unwrap()
      console.log('Create response:', response)
    } catch (error) {
      console.error('Create error:', error)
    }
  }

  const handleCancel = () => {
    setFormValues({
      customerName: '',
      jewelryName: '',
      weight: 0,
      height: 0,
      depth: 0,
      preliminaryPrice: 0,
      description: ''
    })
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
                name='customerName'
                type='text'
                value={formValues.customerName}
                onChange={handleChange}
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5'
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
                name='jewelryName'
                type='text'
                value={formValues.jewelryName}
                onChange={handleChange}
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5'
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
                name='weight'
                min={0}
                value={formValues.weight}
                onChange={(value) => setFormValues((prevValues) => ({ ...prevValues, weight: value || 0 }))}
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5'
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
                name='height'
                min={0}
                value={formValues.height}
                onChange={(value) => setFormValues((prevValues) => ({ ...prevValues, height: value || 0 }))}
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5'
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
                name='depth'
                min={0}
                value={formValues.depth}
                onChange={(value) => setFormValues((prevValues) => ({ ...prevValues, depth: value || 0 }))}
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5'
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
                name='preliminaryPrice'
                min={0}
                value={formValues.preliminaryPrice}
                onChange={(value) => setFormValues((prevValues) => ({ ...prevValues, preliminaryPrice: value || 0 }))}
                className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5'
              />
            </div>
          </Col>
        </Row>
        <div className='mb-4'>
          <label htmlFor='description' className='block mb-2 text-sm font-medium text-gray-900'>
            Description
          </label>
          <textarea
            id='description'
            name='description'
            rows={4}
            value={formValues.description}
            onChange={handleChange}
            className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5'
          />
        </div>
        <div className='flex justify-end gap-4'>
          <Button onClick={handleCancel} className='bg-gray-200 text-gray-800'>
            Cancel
          </Button>
          <Button type='primary' onClick={handleCreate}>
            Create
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreatePreliminaryValuation
