import { Table, Button, Modal, Avatar, Tag } from 'antd'
import { useState } from 'react'

interface Product {
  name: string
  description: string
  price: number
  tax: number
}

interface Winner {
  key: string
  name: string
  lot: number
  phone: string
  email: string
  avatar: string
  products: Product[]
  paid: boolean
  paymentMethod?: string // Optional field for payment method
}

const fakeWinnersData: Winner[] = [
  {
    key: '1',
    name: 'John Doe',
    lot: 1,
    phone: '123-456-7890',
    email: 'john.doe@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    paid: false,
    products: [
      { name: 'Product 1', description: 'High-end jewelry', price: 1000, tax: 100 },
      { name: 'Product 2', description: 'Luxury watch', price: 2000, tax: 200 }
    ]
  },
  {
    key: '2',
    name: 'Jane Smith',
    lot: 2,
    phone: '987-654-3210',
    email: 'jane.smith@example.com',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    paid: true,
    paymentMethod: 'Bank Transfer',
    products: [
      { name: 'Product 3', description: 'Diamond ring', price: 1500, tax: 150 },
      { name: 'Product 4', description: 'Antique necklace', price: 2500, tax: 250 }
    ]
  }
]

export default function ManageWinList() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null)

  const showDetails = (record: Winner) => {
    setSelectedWinner(record)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setSelectedWinner(null)
  }

  const calculateTotalPrice = (products: Product[]) => {
    return products.reduce((total, product) => total + (product.price ?? 0) + (product.tax ?? 0), 0)
  }

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (text: string) => <Avatar src={text} />
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Lot',
      dataIndex: 'lot',
      key: 'lot'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Status',
      key: 'status',
      render: (text: any, record: Winner) => (
        <Tag color={record.paid ? 'green' : 'volcano'}>{record.paid ? 'Paid' : 'Unpaid'}</Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: Winner) => (
        <Button type='link' onClick={() => showDetails(record)}>
          View Details
        </Button>
      )
    }
  ]

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Winner List by Lot</h1>
      <Table columns={columns} dataSource={fakeWinnersData} pagination={{ pageSize: 5 }} />

      <Modal
        title={`Winner Details: ${selectedWinner?.name}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedWinner && (
          <div className='flex space-x-4'>
            {/* Avatar in one column */}
            <div className='w-1/3 flex justify-center mt-5 mb-5'>
              <Avatar size={128} src={selectedWinner.avatar} />
            </div>

            {/* Details in another column */}
            <div className='w-2/3 space-y-2 mt-5 mb-5'>
              <p>
                <strong>Name:</strong> {selectedWinner.name}
              </p>
              <p>
                <strong>Phone:</strong> {selectedWinner.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedWinner.email}
              </p>
              <p>
                <strong>Lot:</strong> {selectedWinner.lot}
              </p>
            </div>
          </div>
        )}

        {/* Horizontal line between sections */}
        <div className='border-t border-gray-300 my-4'></div>

        {selectedWinner && (
          <>
            <h4 className='font-bold mt-4 mb-2'>Products Won:</h4>
            <ul className='list-inside space-y-2'>
              {selectedWinner.products.map((product, index) => (
                <li key={index}>
                  <div className='flex flex-col mb-3'>
                    <div className='flex justify-between'>
                      <strong>{product.name}:</strong> {product.description}
                    </div>
                  </div>
                  <div className='flex flex-col justify-between'>
                    <div className='flex justify-between'>
                      <strong>Price:</strong> ${product.price?.toFixed(2)}
                    </div>
                    <div className='flex justify-between'>
                      <strong>Tax:</strong> ${product.tax?.toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <h3 className='font-semibold mb-2'>Total Amount:</h3>
            <p className='text-right font-bold'>${calculateTotalPrice(selectedWinner.products).toFixed(2)}</p>

            <h3 className='font-semibold mb-2'>Payment Status:</h3>
            <p className='text-right'>
              {selectedWinner.paid ? `Paid (Method: ${selectedWinner.paymentMethod ?? 'Unknown'})` : 'Unpaid'}
            </p>
          </>
        )}
      </Modal>
    </div>
  )
}
