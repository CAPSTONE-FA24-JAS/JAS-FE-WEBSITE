import React, { useState } from 'react'
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
  const availableYears = [2022, 2023, 2024, 2025] // Available years

  const { data: revenueData, isLoading: isLoadingRevenue } = useGetRevenueInYearQuery(year)
  const { data: invoiceData, isLoading: isLoadingInvoice } = useGetInvoiceInYearQuery(year)
  const monthlyRevenue = revenueData?.data.map((item: any) => item.revenue) || Array(12).fill(0)
  const monthlyInvoices = Array(12).fill(0)
  invoiceData?.data.forEach((item: { month: string; revenue: number }) => {
    const monthIndex = new Date(Date.parse(item.month + ' 1, 2024')).getMonth()
    monthlyInvoices[monthIndex] = item.revenue
  })
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

  return (
    <div className='flex gap-4'>
      <div className='w-1/2 p-4 transition-shadow duration-300 border border-gray-200 shadow-xl rounded-3xl hover:shadow-2xl'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'></div>
          <select
            onChange={handleYearChange}
            value={year}
            className='ml-auto font-semibold text-black transition-colors duration-300 border-2 rounded-lg bg-gradient-to-r from-gray-400 to-white hover:bg-gradient-to-l hover:from-gray-600 hover:to-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50'
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {isLoadingRevenue ? <p>Loading Revenue...</p> : <Line data={lineChartData} options={lineChartOptions} />}
      </div>

      <div className='w-1/2 p-4 transition-shadow duration-300 border border-gray-200 shadow-xl rounded-3xl hover:shadow-2xl'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'></div>
          <select
            onChange={handleYearChange}
            value={year}
            className='ml-auto font-semibold text-black transition-colors duration-300 border-2 rounded-lg bg-gradient-to-r from-gray-400 to-white hover:bg-gradient-to-l hover:from-gray-600 hover:to-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50'
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
        {isLoadingInvoice ? <p>Loading Invoices...</p> : <Bar data={barChartData} options={barChartOptions} />}
      </div>
    </div>
  )
}

export default RevenueChart
