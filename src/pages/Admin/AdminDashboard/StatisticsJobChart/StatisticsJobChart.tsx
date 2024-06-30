import React, { useEffect, useState } from 'react'
import LeftChart from './LeftChart'
import RightChart from './RightChart'
import axiosInstance from '../../../../utils/AxiosInstance'
import { Select, Spin, DatePicker } from 'antd'
import dayjs from 'dayjs'

const { Option } = Select
const { RangePicker } = DatePicker

interface StatisticsData {
  leftChartData: { month: string; totalJobs: number; accepted: number; rejected: number; waiting: number }[]
  rightChartData: { type: string; value: number }[]
}

interface APIResponse {
  message: string
  status: string
  statusCode: number
  metadata: any // Adjusted for flexibility
  options: any
}

interface DailyDetail {
  month: string
  totalJobs: number
  accepted: number
  rejected: number
  waiting: number
}

interface DualAxesData {
  time: string
  value: number
  type: 'Chờ duyệt' | 'Đã duyệt' | 'Không duyệt'
}

const StatisticsJobChart: React.FC = () => {
  const [statisticsData, setStatisticsData] = useState<StatisticsData>({ leftChartData: [], rightChartData: [] })
  const [filterType, setFilterType] = useState<'year' | 'month' | 'range'>('year')
  const [year, setYear] = useState(2024)
  const [month, setMonth] = useState(1)
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().startOf('month').toISOString(),
    dayjs().endOf('month').toISOString()
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [chartData, setChartData] = useState<DualAxesData[]>([])

  const fetchStatistics = async () => {
    setIsLoading(true)
    let endpoint = ''

    switch (filterType) {
      case 'year':
        endpoint = `/admin/statistic/job_statistic_by_year?year=${year}`
        break
      case 'month':
        endpoint = `/admin/statistic/job_statistic_by_month?month=${month}&year=${year}`
        break
      case 'range':
        const [startDate, endDate] = dateRange
        endpoint = `/admin/statistic/job_statistic?startDate=${startDate}&endDate=${endDate}`
        break
      default:
        break
    }

    try {
      const response = await axiosInstance.get<APIResponse>(endpoint)

      if (response.data.status === 'sucess') {
        let transformedData: StatisticsData

        if (filterType === 'year') {
          transformedData = {
            leftChartData: response.data.metadata.yearlyDetails.map((item: any) => ({
              month: `Tháng ${item.month}`,
              totalJobs: item.totalJobs,
              accepted: item.accepted,
              rejected: item.rejected,
              waiting: item.waiting
            })),
            rightChartData: [
              { type: 'Đã duyệt', value: response.data.metadata.totalAccepted },
              { type: 'Không duyệt', value: response.data.metadata.totalRejected },
              { type: 'Chờ duyệt', value: response.data.metadata.totalWaiting }
            ]
          }
        } else {
          const detailsKey = filterType === 'month' ? 'monthlyDetails' : 'dailyDetails'
          transformedData = {
            leftChartData: response.data.metadata[detailsKey].map((item: any) => ({
              month: filterType === 'month' ? `Ngày ${item.day}` : item.day,
              totalJobs: item.totalJobs,
              accepted: item.accepted,
              rejected: item.rejected,
              waiting: item.waiting
            })),
            rightChartData: [
              { type: 'Đã duyệt', value: response.data.metadata.totalAccepted },
              { type: 'Không duyệt', value: response.data.metadata.totalRejected },
              { type: 'Chờ duyệt', value: response.data.metadata.totalWaiting }
            ]
          }
        }

        setStatisticsData(transformedData)
      } else {
        setStatisticsData({ leftChartData: [], rightChartData: [] })
      }
    } catch (error) {
      console.error('Error fetching job statistics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [filterType, year, month, dateRange])

  useEffect(() => {
    const transformedData = transformDataForChart(statisticsData.leftChartData, year)
    setChartData(transformedData)
  }, [statisticsData, year])

  const handleYearChange = (value: number) => {
    setYear(value)
  }

  const handleMonthChange = (value: number) => {
    setMonth(value)
  }

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange([dateStrings[0], dateStrings[1]])
  }

  const transformDataForChart = (dailyDetails: DailyDetail[], year: number): DualAxesData[] => {
    const accepted = dailyDetails
      .filter((detail) => detail.accepted !== 0)
      .map((detail) => ({
        time: `${detail.month}`,
        value: detail.accepted,
        type: 'Đã duyệt' as 'Đã duyệt'
      }))

    const rejected = dailyDetails
      .filter((detail) => detail.rejected !== 0)
      .map((detail) => ({
        time: `${detail.month}`,
        value: detail.rejected,
        type: 'Không duyệt' as 'Không duyệt'
      }))

    const waiting = dailyDetails
      .filter((detail) => detail.waiting !== 0)
      .map((detail) => ({
        time: `${detail.month}`,
        value: detail.waiting,
        type: 'Chờ duyệt' as 'Chờ duyệt'
      }))

    const combinedData = [...accepted, ...rejected, ...waiting]
    return combinedData.sort((a, b) => dayjs(a.time).diff(dayjs(b.time)))
  }

  return (
    <>
      <h1 className='font-medium text-center'>Thống kê công việc</h1>
      <div className='flex flex-col w-full h-full gap-2 mt-1'>
        <div className='flex items-center justify-end'>
          <Select value={filterType} onChange={setFilterType} style={{ width: 150, marginRight: 10 }}>
            <Option value='year'>Theo năm</Option>
            <Option value='month'>Theo tháng</Option>
            <Option value='range'>Theo khoảng</Option>
          </Select>

          {filterType === 'year' && (
            <Select value={year} onChange={handleYearChange} style={{ width: 120 }}>
              <Option value={2023}>2023</Option>
              <Option value={2024}>2024</Option>
              <Option value={2025}>2025</Option>
            </Select>
          )}

          {filterType === 'month' && (
            <>
              <Select value={month} onChange={handleMonthChange} style={{ width: 120 }}>
                {Array.from({ length: 12 }, (_, i) => (
                  <Option key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</Option>
                ))}
              </Select>
              <Select value={year} onChange={handleYearChange} style={{ width: 120 }}>
                <Option value={2023}>2023</Option>
                <Option value={2024}>2024</Option>
                <Option value={2025}>2025</Option>
              </Select>
            </>
          )}

          {filterType === 'range' && (
            <RangePicker value={[dayjs(dateRange[0]), dayjs(dateRange[1])]} onChange={handleDateRangeChange} />
          )}
        </div>
        <div className='flex items-center justify-center gap-2'>
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <Spin size='large' />
            </div>
          ) : statisticsData.leftChartData.length > 0 && statisticsData.rightChartData.length > 0 ? (
            <div className='flex items-center justify-center w-full gap-2'>
              <div className='w-2/3'>
                <LeftChart data={chartData} />
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

export default StatisticsJobChart
