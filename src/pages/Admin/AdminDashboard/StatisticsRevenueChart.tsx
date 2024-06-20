import React, { useEffect, useState } from 'react'
import { Line } from '@ant-design/charts'
import { Select } from 'antd'
import { AdminService } from '../../../services/AdminService'

interface RevenueDetail {
  month: number
  revenue: string
}

interface ApiResponse {
  message: string
  status: string
  statusCode: number
  metadata: {
    totalRevenue: string
    monthlyDetails: RevenueDetail[]
    year: number
  }
  options: object
}

interface FormattedData {
  month: string
  revenue: number
}

const StatisticsRevenueChart: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [data, setData] = useState<FormattedData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AdminService.getCaculateRevenueByYear(selectedYear)
        const { yearlyDetails } = response.data.metadata

        // Define all months
        const allMonths = Array.from({ length: 12 }, (_, i) => i + 1)

        // Merge API response with all months
        const formattedData: FormattedData[] = allMonths.map((month) => {
          const monthData = yearlyDetails.find((detail: any) => detail.month === month)
          return {
            month: `Tháng ${month}`,
            revenue: monthData ? parseFloat(monthData.revenue.replace(/,/g, '')) : 0
          }
        })

        setData(formattedData)
      } catch (error) {
        console.error('Error fetching revenue data:', error)
      }
    }

    fetchData()
  }, [selectedYear])

  const props = {
    data,
    xField: 'month',
    yField: 'revenue',
    point: { size: 5, shape: 'diamond' },
    label: { style: { fill: '#aaa' } }
  }

  return (
    <div className={`flex flex-col w-full`}>
      <h1 className='font-medium text-center'>Thống kê doanh thu</h1>
      <div className='flex justify-end'>
        <Select defaultValue={selectedYear} onChange={(value) => setSelectedYear(value)}>
          {[...Array(5)].map((_, index) => {
            const yearOption = new Date().getFullYear() - index
            return (
              <Select.Option key={yearOption} value={yearOption}>
                {yearOption}
              </Select.Option>
            )
          })}
        </Select>
      </div>
      <Line {...props} />
    </div>
  )
}

export default StatisticsRevenueChart
