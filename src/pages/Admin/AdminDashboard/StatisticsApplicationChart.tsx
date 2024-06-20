import React, { useEffect, useState } from 'react'
import { Pie } from '@ant-design/charts'
import { Select } from 'antd'
import axiosInstance from '../../../utils/AxiosInstance'

const { Option } = Select

interface ApplicationStat {
  type: string
  value: number
}

const StatisticsApplicationChart: React.FC = () => {
  const [data, setData] = useState<ApplicationStat[]>([])
  const [chartKey, setChartKey] = useState(Math.random())
  const [year, setYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axiosInstance.get(`/admin/statistic/application_statistic_by_year?year=${year}`)

        const apiData = response.data.metadata

        const formattedData = [
          { type: 'CV được tiếp nhận', value: apiData.totalSubmitted },
          { type: 'CV được chấp nhận', value: apiData.totalAccepted },
          { type: 'CV bị từ chối', value: apiData.totalRejected }
        ]

        setData(formattedData)
        // Cập nhật key để tái render biểu đồ với dữ liệu mới
        setChartKey(Math.random())
      } catch (error) {
        console.error('Error fetching statistics:', error)
      }
    }

    fetchStatistics()
  }, [year])

  const config = {
    data: data,
    angleField: 'value' as const,
    colorField: 'type' as const,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold'
      }
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5
      }
    },
    interactions: [{ type: 'pie-legend-active' as const }, { type: 'element-active' as const }]
  }

  return (
    <>
      <h1 className='font-medium text-center'>Thống kê ứng tuyển</h1>
      <div className='flex items-center justify-end gap-1 mt-2'>
        <Select defaultValue={year} style={{ width: 100 }} onChange={(value) => setYear(value)}>
          {Array.from({ length: 10 }, (_, i) => (
            <Option key={i + year - 5} value={i + year - 5}>
              {i + year - 5}
            </Option>
          ))}
        </Select>
      </div>
      <div className='w-full h-full mt-1'>
        <Pie {...config} key={chartKey} />
      </div>
    </>
  )
}

export default StatisticsApplicationChart
