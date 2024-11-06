import { DollarOutlined, RiseOutlined } from '@ant-design/icons'
import SaleInfo from './SaleInfo'

interface SaleInfoData {
  id: number
  icon: React.ReactNode
  title: string
  sales: number
  increment: number
  date: string
  backgroundClass: string // Add backgroundClass to define the color for each card
}

export const saleInfoData: SaleInfoData[] = [
  {
    id: 1,
    // Replace FileTextOutlined with an image
    icon: (
      <img
        src='https://icons.veryicon.com/png/o/system/crm-android-app-icon/app-icon-invoice-requisition.png'
        alt='Invoice Icon'
        className='w-12 h-12'
      />
    ),
    title: 'Invoices',
    sales: 230220,
    increment: 55,
    date: 'May 2022',
    backgroundClass: 'bg-gradient-to-r from-red-200 via-red-300 to-red-400'
  },
  {
    id: 2,
    icon: (
      <img src='https://cdn-icons-png.flaticon.com/512/3097/3097928.png' alt='Invoice Icon' className='w-12 h-12' />
    ),
    title: 'Revenue',
    sales: 3200,
    increment: 12,
    date: 'May 2022',
    backgroundClass: 'bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400'
  },
  {
    id: 3,
    icon: <img src='https://cdn-icons-png.freepik.com/512/924/924471.png' alt='Invoice Icon' className='w-12 h-12' />,
    title: 'Profit',
    sales: 2300,
    increment: 210,
    date: 'May 2022',
    backgroundClass: 'bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400'
  }
]

const SaleInfoCards = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {saleInfoData.map((saleInfoDataItem) => (
        <div key={saleInfoDataItem.id} className='p-4'>
          <SaleInfo
            title={saleInfoDataItem.title}
            icon={saleInfoDataItem.icon}
            sales={saleInfoDataItem.sales}
            increment={saleInfoDataItem.increment}
            date={saleInfoDataItem.date}
            backgroundClass={saleInfoDataItem.backgroundClass}
          />
        </div>
      ))}
    </div>
  )
}

export default SaleInfoCards
