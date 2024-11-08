import React, { useState, useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import { useGetRevenueInYearQuery } from '../../../../../services/dashboard.services'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

// Đăng ký các thành phần của Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const RevenueChart = () => {
  const [year, setYear] = useState(2024)
  const { data: revenueData, isLoading } = useGetRevenueInYearQuery(year)

  const chartRef = useRef<Chart<'line', any, unknown> | null>(null)

  const monthlyRevenue = revenueData?.data.map((item: any) => item.revenue) || Array(12).fill(0)

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(event.target.value))
  }

  const chartData = {
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
        data: monthlyRevenue, // Use revenue data from API response
        borderColor: '#FF0000',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5
      }
    ]
  }

  const options = {
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

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = chartRef.current
      chartInstance.destroy()
    }
  }, [chartData])

  return (
    <div className='p-4 w-2/3  rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300'>
      <div className='flex justify-between items-center'>
        <div className='flex-1'></div>
        <select
          onChange={handleYearChange}
          value={year}
          className='ml-auto rounded-lg border-2 bg-gradient-to-r from-gray-400 to-white text-black font-semibold hover:bg-gradient-to-l hover:from-gray-600 hover:to-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-300'
        >
          <option value={2024}>2024</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Line ref={chartRef} data={chartData} options={options} />
        </div>
      )}
    </div>
  )
}
export default RevenueChart
