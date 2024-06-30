import React, { useEffect, useState } from 'react'
import LeftChart from './LeftChart'
import RightChart from './RightChart'
import axiosInstance from '../../../../utils/AxiosInstance'
import { Select, Spin } from 'antd'

const { Option } = Select

interface StatisticsData {
  leftChartData: { month: string; totalNewRecruiters: number }[]
  rightChartData: { type: string; value: number }[]
}

interface APIResponse {
  message: string
  status: string
  statusCode: number
  metadata: {
    year: number
    totalNewRecruiters: number
    yearlyDetails: {
      month: number
      totalNewRecruiters: number
    }[]
  }
  options: any
}

const StatisticsCompanyChart: React.FC = () => {
  const [statisticsData, setStatisticsData] = useState<StatisticsData>({
    leftChartData: [],
    rightChartData: []
  })
  const [year, setYear] = useState(2024)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get<APIResponse>(
          `/admin/statistic/recruiter_statistic_by_year?year=${year}`
        )

        if (response.data.status === 'sucess') {
          const transformedData: StatisticsData = {
            leftChartData: response.data.metadata.yearlyDetails.map((item) => ({
              month: `Tháng ${item.month}`,
              totalNewRecruiters: item.totalNewRecruiters
            })),
            rightChartData: response.data.metadata.yearlyDetails.map((item) => ({
              type: `Tháng ${item.month}`,
              value: item.totalNewRecruiters
            }))
          }

          setStatisticsData(transformedData)
        } else {
          // Hiển thị thông báo khi không có dữ liệu
          setStatisticsData({
            leftChartData: [],
            rightChartData: []
          })
        }
      } catch (error) {
        console.error('Error fetching recruiter statistics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [year])

  const handleYearChange = (value: number) => {
    setYear(value)
  }

  return (
    <>
      <h1 className='font-medium text-center'>Thống kê công ty</h1>
      <div className='flex flex-col w-full h-full gap-2 mt-1'>
        <div className='flex items-center justify-end'>
          <Select value={year} onChange={handleYearChange} style={{ width: 120 }}>
            <Option value={2023}>2023</Option>
            <Option value={2024}>2024</Option>
            <Option value={2025}>2025</Option>
          </Select>
        </div>
        <div className='flex items-center justify-center gap-2'>
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <Spin size='large' />
            </div>
          ) : statisticsData.leftChartData.length > 0 && statisticsData.rightChartData.length > 0 ? (
            <div className='flex items-center justify-center w-full gap-2'>
              <div className='w-2/3'>
                <LeftChart data={statisticsData.leftChartData} />
              </div>
              <div className='w-1/3'>
                <RightChart data={statisticsData.rightChartData} />
              </div>
            </div>
          ) : (
            <div className='flex items-center justify-center h-full'>
              <p>Không có dữ liệu để thống kê.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default StatisticsCompanyChart
