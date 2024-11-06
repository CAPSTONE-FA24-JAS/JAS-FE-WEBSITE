import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register required chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const RevenueChart = () => {
  // Sample data for the chart: Revenue by month
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Months
    datasets: [
      {
        label: 'Revenue', // Label for the revenue line
        data: [5000, 4500, 5200, 4800, 6000, 6700, 6500, 7200, 7500, 8000, 8500, 9000], // Revenue values for each month
        borderColor: '#FF0000', // Changed line color to red
        backgroundColor: 'rgba(255, 0, 0, 0.2)', // Background color for the area under the line, adjusted to a red tint
        fill: true, // Fill the area under the line (biểu đồ miền)
        tension: 0.4, // Smoothness of the line
        pointRadius: 5 // Point size on the line
      }
    ]
  }

  // Chart options to customize the appearance
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Revenue', // Chart title
        font: {
          size: 18
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.raw} VND`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tháng'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Revenue (VND)'
        },
        beginAtZero: true // Start the y-axis at 0
      }
    }
  }

  return (
    <div className='p-0 w-2/3 h-screen bg-white'>
      <Line data={data} options={options} />
    </div>
  )
}

export default RevenueChart
