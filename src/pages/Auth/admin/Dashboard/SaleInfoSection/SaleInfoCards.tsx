import { useEffect, useState } from 'react'
import SaleInfo from './SaleInfo'
import { useGetTotalInvoiceQuery, useGetTotalRevenueQuery } from '../../../../../services/dashboard.services'

const SaleInfoCards = () => {
  const { data: totalInvoiceData } = useGetTotalInvoiceQuery(undefined)
  const { data: totalRevenueData } = useGetTotalRevenueQuery(undefined)

  const [saleInfoData, setSaleInfoData] = useState([
    {
      id: 1,
      icon: (
        <img
          src='https://icons.veryicon.com/png/o/system/crm-android-app-icon/app-icon-invoice-requisition.png'
          alt='Invoice Icon'
          className='w-10 h-14'
        />
      ),
      title: 'Invoices',
      sales: 0,
      increment: 0,
      backgroundClass: 'bg-gradient-to-r from-red-200 via-red-300 to-red-400'
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
    },
    {
      id: 3,
      icon: (
        <img src='https://cdn-icons-png.flaticon.com/512/3097/3097928.png' alt='Revenue Icon' className='w-14 h-14' />
      ),
      title: 'Revenue',
      sales: 0,
      increment: 0,
      backgroundClass: 'bg-gradient-to-r from-yellow-200 via-orange-300 to-yellow-400'
    }
  ])

  useEffect(() => {
    if (totalInvoiceData) {
      setSaleInfoData((prevData) =>
        prevData.map((item) => (item.id === 1 ? { ...item, sales: totalInvoiceData.data, increment: 0 } : item))
      )
    }
    if (totalRevenueData && totalRevenueData.isSuccess) {
      setSaleInfoData((prevData) =>
        prevData.map((item) =>
          item.id === 2
            ? { ...item, sales: totalRevenueData.data, increment: 0 } // `totalRevenueData.data` holds the revenue
            : item
        )
      )
    }
  }, [totalInvoiceData, totalRevenueData])

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2'>
      {saleInfoData.map((saleInfoDataItem) => (
        <div key={saleInfoDataItem.id} className='p-4'>
          <SaleInfo
            title={saleInfoDataItem.title}
            icon={saleInfoDataItem.icon}
            sales={saleInfoDataItem.sales}
            increment={saleInfoDataItem.increment}
            backgroundClass={saleInfoDataItem.backgroundClass}
          />
        </div>
      ))}
    </div>
  )
}

export default SaleInfoCards
