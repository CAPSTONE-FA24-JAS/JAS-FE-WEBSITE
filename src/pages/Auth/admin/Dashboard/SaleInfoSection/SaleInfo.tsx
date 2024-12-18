import { ReactElement } from 'react'
import { ArrowUpOutlined } from '@ant-design/icons'
import { currencyFormat } from '../../../../../helper/format-function'

type SaleInfoProps = {
  icon: React.ReactNode
  title: string
  sales: number
  increment: number
  date?: string
  backgroundClass: string
}

const SaleInfo = ({ icon, title, sales, increment, date, backgroundClass }: SaleInfoProps): ReactElement => {
  return (
    <div
      className={`${backgroundClass} shadow-xl rounded-3xl w-full p-4 hover:shadow-2xl transition-shadow duration-300`}
    >
      <div className='flex items-center justify-between space-x-4'>
        <div className='text-3xl text-black'>{icon}</div>
        <div>
          <div className='text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600'>
            {title}
          </div>
          {date && <div className='text-sm text-black-200'>{date}</div>}
        </div>
      </div>

      <div className='mt-2'>
        <div className='text-sm font-semibold text-black-200'>Total</div>
        <div className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-500 to-white-500'>
          {title === 'Revenue' || title === 'Invoice Revenue' ? currencyFormat(sales) : sales}
        </div>
      </div>

      <div className='flex items-center mt-2 space-x-2'>
        <ArrowUpOutlined className='text-2xl font-bold text-green-900' />

        <div className='text-black'>+{increment}% last month</div>
      </div>
    </div>
  )
}

export default SaleInfo
