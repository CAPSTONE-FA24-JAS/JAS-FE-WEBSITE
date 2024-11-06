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
    <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-8'>
      <div className='align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white shadow-lg px-12'>
        <div className='flex justify-between'>
          <div className='inline-flex border rounded w-7/12 px-2 lg:px-6 h-12 bg-transparent'>
            <div className='flex flex-wrap items-stretch w-full h-full mb-6 relative'>
              <div className='flex'>
                <span className='flex items-center leading-normal bg-transparent rounded rounded-r-none border border-r-0 border-none lg:px-3 py-2 whitespace-no-wrap text-grey-dark text-sm'>
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
                className='flex-shrink flex-grow flex-auto leading-normal tracking-wide w-px flex-1 border border-none border-l-0 rounded rounded-l-none px-3 relative focus:outline-none text-xxs lg:text-xs lg:text-base text-gray-500 font-thin'
                placeholder='Search'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='align-middle inline-block min-w-full shadow overflow-hidden bg-white shadow-dashboard px-8 pt-3 rounded-bl-lg rounded-br-lg'>
        <table className='min-w-full'>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className='px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider'
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