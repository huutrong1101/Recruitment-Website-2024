import React, { useEffect, useState } from 'react'
import { Pie } from '@ant-design/charts'
import axios from 'axios'
import axiosInstance from '../../../utils/AxiosInstance'

interface ApplicationStat {
  type: string
  value: number
}

const StatisticsApplicationChart: React.FC = () => {
  const [data, setData] = useState<ApplicationStat[]>([])

  useEffect(() => {
    const fetchStatistics = async () => {
      const month = 5 // Ví dụ cho tháng 5
      const year = 2024 // Ví dụ cho năm 2024
      try {
        const response = await axiosInstance.get(
          `/admin/statistic/application_statistic_by_month?month=${month}&year=${year}`
        )

        const apiData = response.data.metadata

        const formattedData = [
          { type: 'CV được tiếp nhận', value: apiData.totalSubmitted },
          { type: 'CV được chấp nhận', value: apiData.totalAccepted },
          { type: 'CV bị từ chối', value: apiData.totalRejected }
        ]

        setData(formattedData)
      } catch (error) {
        console.error('Error fetching statistics:', error)
      }
    }

    fetchStatistics()
  }, [])

  const config = {
    data: data, // Thay đổi giá trị bằng 0 thành 0.1 để hiển thị trên biểu đồ nhưng rất nhỏ
    angleField: 'value' as const,
    colorField: 'type' as const,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold'
      }
    },
    interactions: [{ type: 'pie-legend-active' as const }, { type: 'element-active' as const }]
  }

  return (
    <>
      <h1 className='font-medium text-center'>Thống kê ứng tuyển</h1>
      <div className='w-full h-full mt-1'>
        <Pie {...config} key={Date.now()} />
      </div>
    </>
  )
}

export default StatisticsApplicationChart
