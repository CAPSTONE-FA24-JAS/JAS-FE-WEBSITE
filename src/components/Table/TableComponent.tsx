import React from 'react'

type TableComponentProps = {
  data: any[]
  columns: {
    title: string
    dataIndex?: string
    key: string
    render?: (value: any, record?: any) => React.ReactNode
  }[]
  rowKey: string
}

export default function TableComponent({ data, columns, rowKey }: TableComponentProps) {
  return (
    <div className='py-2 pr-10 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
      <div className='inline-block w-full px-12 py-4 overflow-hidden align-middle bg-white rounded-tl-lg rounded-tr-lg shadow-lg'>
        <div className='flex justify-between'>
          <div className='inline-flex w-7/12 h-12 px-2 bg-transparent border rounded lg:px-6'>
            <div className='relative flex flex-wrap items-stretch w-full h-full mb-6'>
              <div className='flex'>
                <span className='flex items-center py-2 text-sm leading-normal whitespace-no-wrap bg-transparent border border-r-0 border-none rounded rounded-r-none lg:px-3 text-grey-dark'>
                  <svg
                    width='18'
                    height='18'
                    className='w-4 lg:w-auto'
                    viewBox='0 0 18 18'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M8.11086 15.2217C12.0381 15.2217 15.2217 12.0381 15.2217 8.11086C15.2217 4.18364 12.0381 1 8.11086 1C4.18364 1 1 4.18364 1 8.11086C1 12.0381 4.18364 15.2217 8.11086 15.2217Z'
                      stroke='#455A64'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M16.9993 16.9993L13.1328 13.1328'
                      stroke='#455A64'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>
              </div>
              <input
                type='text'
                className='relative flex-1 flex-auto flex-grow flex-shrink w-px px-3 font-thin leading-normal tracking-wide text-gray-500 border border-l-0 border-none rounded rounded-l-none focus:outline-none text-xxs lg:text-xs lg:text-base'
                placeholder='Search'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='inline-block min-w-full px-8 pt-3 overflow-hidden align-middle bg-white rounded-bl-lg rounded-br-lg shadow shadow-dashboard'>
        <table className='min-w-full'>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className='px-6 py-3 leading-4 tracking-wider text-left text-blue-500 border-b-2 border-gray-300'
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white'>
            {data.map((item) => (
              <tr key={item[rowKey]}>
                {columns.map((col) => (
                  <td key={col.key} className='px-6 py-4 whitespace-no-wrap border-b border-gray-500'>
                    {col.render ? col.render(item[col.dataIndex as string], item) : item[col.dataIndex as string] ?? ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
