import { ReactElement } from 'react'
import { currencyFormat } from '../../../../../helper/format-function'

type SaleInfoProps = {
  icon: React.ReactNode
  title: string
  sales: number
  date?: string
  backgroundClass: string
  children?: React.ReactNode
  selectedStatus?: string
  statuses?: string[]
  handleStatusChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const SaleInfo = ({
  icon,
  title,
  sales,
  date,
  backgroundClass,
  children,
  selectedStatus,
  statuses,
  handleStatusChange
}: SaleInfoProps): ReactElement => {
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

      <div className='mt-8 mb-4 flex items-center justify-between'>
        <div>
          <div className='text-sm font-semibold text-black-200'>Total</div>
          <div className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700'>
            {title === 'Revenue' || title === 'Invoice Revenue' ? currencyFormat(sales) : sales}
          </div>
        </div>
        {title === 'Invoice By Status' && statuses && handleStatusChange && (
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className='ml-auto font-semibold text-black transition-colors duration-300 border-2 rounded-lg bg-gradient-to-r from-green-400 to-white hover:bg-gradient-to-l hover:from-green-600 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className='flex items-center mt-2 space-x-2'>{children}</div>
    </div>
  )
}

export default SaleInfo
