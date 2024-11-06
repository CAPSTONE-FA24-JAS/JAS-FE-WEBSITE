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
      className={`${backgroundClass} shadow-md rounded-lg w-full p-4 hover:shadow-xl transition-shadow duration-300`}
    >
      <div className='flex justify-between items-center space-x-4'>
        <div className='text-3xl text-black'>{icon}</div>
        <div>
          <div className='text-lg font-semibold text-black'>{title}</div>
          {date && <div className='text-sm text-black-200'>{date}</div>}{' '}
        </div>
      </div>

      <div className='mt-2'>
        <div className='text-black-200 text-sm'>Total</div>
        <div className='text-lg font-semibold text-black'>{currencyFormat(sales)}</div>
      </div>

      <div className='mt-2 flex items-center space-x-2'>
        <ArrowUpOutlined className='text-green-900' />
        <div className='text-black'>+{increment}% last month</div>
      </div>
    </div>
  )
}

export default SaleInfo