import { Table, Button, Typography } from 'antd'

const { Title } = Typography

const myMissionListData = [
  {
    id: 1,
    auctionName: 'Đấu giá trang sức A',
    startTime: '2024-10-01 10:00',
    endTime: '2024-10-02 10:00',
    actualTime: '2024-10-01 10:30',
    status: 'Đang diễn ra',
    action: 'Xem chi tiết'
  },
  {
    id: 2,
    auctionName: 'Đấu giá trang sức B',
    startTime: '2024-10-03 12:00',
    endTime: '2024-10-04 12:00',
    actualTime: '2024-10-03 12:15',
    status: 'Sắp diễn ra',
    action: 'Xem chi tiết'
  },
  {
    id: 3,
    auctionName: 'Đấu giá trang sức C',
    startTime: '2024-09-28 09:00',
    endTime: '2024-09-29 09:00',
    actualTime: '2024-09-28 09:05',
    status: 'Đã kết thúc',
    action: 'Xem chi tiết'
  },
  {
    id: 4,
    auctionName: 'Đấu giá trang sức D',
    startTime: '2024-10-05 14:00',
    endTime: '2024-10-06 14:00',
    actualTime: '-',
    status: 'Chưa bắt đầu',
    action: 'Xem chi tiết'
  },
  {
    id: 5,
    auctionName: 'Đấu giá trang sức E',
    startTime: '2024-10-07 16:00',
    endTime: '2024-10-08 16:00',
    actualTime: '-',
    status: 'Chưa bắt đầu',
    action: 'Xem chi tiết'
  }
]

const MyMissionList = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Auction Name',
      dataIndex: 'auctionName',
      key: 'auctionName'
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime'
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime'
    },
    {
      title: 'Actual Time',
      dataIndex: 'actualTime',
      key: 'actualTime'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: any) => (
        <Button type='link' onClick={() => handleActionClick(record.id)}>
          {record.action}
        </Button>
      )
    }
  ]

  const handleActionClick = (id: any) => {
    console.log('Viewing details for auction ID:', id)
  }

  return (
    <div className='p-6'>
      <Title level={3}>My Mission List</Title>
      <Table dataSource={myMissionListData} columns={columns} rowKey='id' />
    </div>
  )
}

export default MyMissionList
