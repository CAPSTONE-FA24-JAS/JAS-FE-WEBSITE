import { useEffect, useState } from 'react'
import SaleInfo from './SaleInfo'
import {
  useGetTotalInvoiceByStatusQuery,
  useGetTotalInvoiceQuery,
  useGetTotalRevenueInvoiceQuery,
  useGetTotalRevenueQuery
} from '../../../../../services/dashboard.services'

interface InvoiceStatus {
  status: string
  total: number
}

const SaleInfoCards = () => {
  const { data: totalInvoiceData } = useGetTotalInvoiceQuery(undefined)
  const { data: totalRevenueData } = useGetTotalRevenueQuery(undefined)
  const { data: totalRevenueInvoiceData } = useGetTotalRevenueInvoiceQuery(undefined)
  const { data: totalInvoiceByStatusData } = useGetTotalInvoiceByStatusQuery(undefined)

  const statuses = [
    'CreateInvoice',
    'PendingPayment',
    'Paid',
    'Delivering',
    'Delivered',
    'Rejected',
    'Finished',
    'Refunded',
    'Cancelled',
    'Closed'
  ]

  const [saleInfoData, setSaleInfoData] = useState([
    {
      id: 1,
      icon: (
        <img
          src='https://icons.veryicon.com/png/o/system/crm-android-app-icon/app-icon-invoice-requisition.png'
          alt='Invoice Icon'
          className='w-14 h-14'
        />
      ),
      title: 'Invoices',
      sales: 0,
      increment: 0,
      backgroundClass: 'bg-gradient-to-r from-red-200 via-red-300 to-red-400'
    },
    {
      id: 4,
      icon: (
        <img
          src='https://cdn-icons-png.flaticon.com/512/3405/3405801.png'
          alt='Invoice By Status Icon'
          className='w-14 h-14'
        />
      ),
      title: 'Invoice By Status',
      sales: 0,
      increment: 0,
      backgroundClass: 'bg-gradient-to-r from-green-200 via-green-300 to-green-400'
    },
    {
      id: 3,
      icon: (
        <img
          src='https://cdn4.iconfinder.com/data/icons/shopping-216/512/invoice-512.png'
          alt='Invoice Revenue Icon'
          className='w-14 h-14'
        />
      ),
      title: 'Invoice Revenue',
      sales: 0,
      increment: 0,
      backgroundClass: 'bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-400'
    },
    {
      id: 2,
      icon: (
        <img src='https://cdn-icons-png.flaticon.com/512/3097/3097928.png' alt='Revenue Icon' className='w-14 h-14' />
      ),
      title: 'Revenue',
      sales: 0,
      increment: 0,
      backgroundClass: 'bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400'
    }
  ])

  const [selectedStatus, setSelectedStatus] = useState<string>('CreateInvoice')
  const [statusTotal, setStatusTotal] = useState<number>(0)

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value
    setSelectedStatus(selected)

    const filteredStatus = totalInvoiceByStatusData?.data.find(
      (statusItem: InvoiceStatus) => statusItem.status === selected
    )
    setStatusTotal(filteredStatus?.total || 0)
  }

  useEffect(() => {
    if (totalInvoiceData) {
      setSaleInfoData((prevData) =>
        prevData.map((item) => (item.id === 1 ? { ...item, sales: totalInvoiceData.data, increment: 0 } : item))
      )
    }
    if (totalRevenueData && totalRevenueData.isSuccess) {
      setSaleInfoData((prevData) =>
        prevData.map((item) => (item.id === 2 ? { ...item, sales: totalRevenueData.data, increment: 0 } : item))
      )
    }
    if (totalRevenueInvoiceData && totalRevenueInvoiceData.isSuccess) {
      setSaleInfoData((prevData) =>
        prevData.map((item) => (item.id === 3 ? { ...item, sales: totalRevenueInvoiceData.data, increment: 0 } : item))
      )
    }
    if (totalInvoiceByStatusData && totalInvoiceByStatusData.isSuccess) {
      const defaultStatus = statuses[0] // Default status
      setSelectedStatus(defaultStatus)

      const filteredStatus = totalInvoiceByStatusData.data.find(
        (statusItem: InvoiceStatus) => statusItem.status === defaultStatus
      )
      setStatusTotal(filteredStatus?.total || 0)
    }
  }, [totalInvoiceData, totalRevenueData, totalRevenueInvoiceData, totalInvoiceByStatusData])

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-10'>
      {saleInfoData.map((saleInfoDataItem) => (
        <div
          key={saleInfoDataItem.id}
          className={`flex flex-col justify-between items-center shadow-lg rounded-3xl  ${saleInfoDataItem.backgroundClass}`}
        >
          <SaleInfo
            title={saleInfoDataItem.title}
            icon={saleInfoDataItem.icon}
            sales={saleInfoDataItem.id === 4 ? statusTotal : saleInfoDataItem.sales}
            backgroundClass=''
            {...(saleInfoDataItem.id === 4 && {
              selectedStatus,
              statuses,
              handleStatusChange
            })}
          />
        </div>
      ))}
    </div>
  )
}

export default SaleInfoCards
