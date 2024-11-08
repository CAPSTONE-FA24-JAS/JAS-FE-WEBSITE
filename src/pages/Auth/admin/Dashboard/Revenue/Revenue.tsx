import React, { useState, useEffect, useRef } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import { useGetRevenueInYearQuery, useGetInvoiceInYearQuery } from '../../../../../services/dashboard.services'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Đăng ký các thành phần của Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const RevenueChart = () => {
  const [year, setYear] = useState(2024)
  const availableYears = [2022, 2023, 2024, 2025] // Danh sách các năm có sẵn

  const { data: revenueData, isLoading: isLoadingRevenue } = useGetRevenueInYearQuery(year)
  const { data: invoiceData, isLoading: isLoadingInvoice } = useGetInvoiceInYearQuery(year)

  const lineChartRef = useRef<Chart<'line', any, unknown> | null>(null)
  const barChartRef = useRef<Chart<'bar', any, unknown> | null>(null)

  const monthlyRevenue = revenueData?.data.map((item: any) => item.revenue) || Array(12).fill(0)
  const monthlyInvoices = invoiceData?.data.map((item: any) => item.invoiceCount) || Array(12).fill(0)

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(event.target.value))
  }

  const lineChartData = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenue,
        borderColor: '#FF0000',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5
      }
    ]
  }

  const barChartData = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    datasets: [
      {
        label: 'Invoices',
        data: monthlyInvoices,
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
        borderColor: '#0000FF',
        borderWidth: 1
      }
    ]
  }

  const lineChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Revenue for ${year}`,
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw} VND`
        }
      }
    },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { title: { display: true, text: 'Revenue (VND)' }, beginAtZero: true }
    }
  }

  const barChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Invoices for ${year}`,
        font: { size: 18 }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw}`
        }
      }
    },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { title: { display: true, text: 'Invoices' }, beginAtZero: true }
    }
  }

  useEffect(() => {
    if (lineChartRef.current) {
      const chartInstance = lineChartRef.current
      chartInstance.destroy()
    }
    if (barChartRef.current) {
      const chartInstance = barChartRef.current
      chartInstance.destroy()
    }
  }, [year]) // Chỉ hủy và tạo lại biểu đồ khi năm thay đổi

  return (
    <div className='flex gap-4'>
      <div className='p-4 w-1/2 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300'>
        <div className='flex justify-between items-center'>
          <div className='flex-1'></div>
          <select
            onChange={handleYearChange}
            value={year}
            className='ml-auto rounded-lg border-2 bg-gradient-to-r from-gray-400 to-white text-black font-semibold hover:bg-gradient-to-l hover:from-gray-600 hover:to-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300'
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {isLoadingRevenue ? (
          <p>Loading Revenue...</p>
        ) : (
          <div>
            <Line ref={lineChartRef} data={lineChartData} options={lineChartOptions} />
          </div>
        )}
      </div>

      <div className='p-4 w-1/2 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300'>
        <div className='flex justify-between items-center'>
          <div className='flex-1'></div>
          <select
            onChange={handleYearChange}
            value={year}
            className='ml-auto rounded-lg border-2 bg-gradient-to-r from-gray-400 to-white text-black font-semibold hover:bg-gradient-to-l hover:from-gray-600 hover:to-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300'
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
        {isLoadingInvoice ? (
          <p>Loading Invoices...</p>
        ) : (
          <div>
            <Bar ref={barChartRef} data={barChartData} options={barChartOptions} />
          </div>
        )}
      </div>
    </div>
  )
}

export default RevenueChart
