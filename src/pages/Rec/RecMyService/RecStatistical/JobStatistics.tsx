import React, { useState, useEffect } from 'react'
import { Card, Statistic, Row, Col, Select, DatePicker, Spin, Empty } from 'antd'
import { RecService } from '../../../../services/RecService'
import { Column, DualAxes } from '@ant-design/charts'
import dayjs from 'dayjs'
import axiosInstance from '../../../../utils/AxiosInstance'

const { Option } = Select
const { RangePicker } = DatePicker

interface APIResponse {
  message: string
  status: string
  statusCode: number
  metadata: any // Adjusted for flexibility
  options: any
}

interface StatisticsData {
  leftChartData: { month: string; totalApplications: number; waiting: number; accepted: number; rejected: number }[]
  rightChartData: { type: string; value: number }[]
}

interface DailyDetail {
  month: string
  totalApplications: number
  waiting: number
  accepted: number
  rejected: number
}

interface DualAxesData {
  time: string
  value: number
  type: 'Tổng' | 'Đã tạo' | 'Bị khóa'
}

const JobStatistics: React.FC = () => {
  const [statisticsData, setStatisticsData] = useState<StatisticsData>({ leftChartData: [], rightChartData: [] })
  const [chartData, setChartData] = useState<DualAxesData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [filterType, setFilterType] = useState<'year' | 'month' | 'range'>('year')
  const [year, setYear] = useState<number>(dayjs().year())
  const [month, setMonth] = useState<number>(dayjs().month() + 1)
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ])

  const maxValue = chartData.reduce((max, item) => Math.max(max, item.value), 0)
  const domainMax = Math.ceil(maxValue + maxValue * 0.1) + 1

  const transformDataForChart = (dailyDetails: DailyDetail[], year: number): DualAxesData[] => {
    const accepted = dailyDetails
      .filter((detail) => detail.accepted > 0)
      .map((detail) => ({
        time: `${detail.month}`,
        value: detail.accepted,
        type: 'Đã tạo' as 'Đã tạo'
      }))

    const rejected = dailyDetails
      .filter((detail) => detail.rejected > 0)
      .map((detail) => ({
        time: `${detail.month}`,
        value: detail.rejected,
        type: 'Bị khóa' as 'Bị khóa'
      }))

    const combinedData = [...accepted, ...rejected]
    return combinedData.sort((a, b) => dayjs(a.time).diff(dayjs(b.time)))
  }

  const handleYearChange = (value: number) => {
    setYear(value)
  }

  const handleMonthChange = (value: number) => {
    setMonth(value)
  }

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange([dates[0], dates[1]])
    }
  }

  const fetchData = async () => {
    setLoading(true)
    let endpoint = ''

    switch (filterType) {
      case 'year':
        endpoint = `/recruiter/statistic/job_statistic_by_year?year=${year}`
        break
      case 'month':
        endpoint = `/recruiter/statistic/job_statistic_by_month?month=${month}&year=${year}`
        break
      case 'range':
        const [startDate, endDate] = dateRange
        endpoint = `/recruiter/statistic/job_statistic?startDate=${startDate}&endDate=${endDate}`
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
              totalApplications: item.totalJobs,
              accepted: item.accepted,
              rejected: item.rejected
            })),
            rightChartData: [
              { type: 'Tổng', value: response.data.metadata.totalJobs },
              { type: 'Đã tạo', value: response.data.metadata.totalAccepted },
              { type: 'Bị khóa', value: response.data.metadata.totalRejected }
            ]
          }
        } else {
          const detailsKey = filterType === 'month' ? 'monthlyDetails' : 'dailyDetails'
          transformedData = {
            leftChartData: response.data.metadata[detailsKey].map((item: any) => ({
              month: filterType === 'month' ? `Ngày ${item.day}` : item.day,
              totalApplications: item.totalJobs || 0,
              accepted: item.accepted,
              rejected: item.rejected
            })),
            rightChartData: [
              { type: 'Tổng', value: response.data.metadata.totalJobs },
              { type: 'Đã tạo', value: response.data.metadata.totalAccepted },
              { type: 'Bị khóa', value: response.data.metadata.totalRejected }
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
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterType, year, month, dateRange])

  useEffect(() => {
    const transformedData = transformDataForChart(statisticsData.leftChartData, year)
    setChartData(transformedData)
  }, [statisticsData, year])

  const config = {
    xField: 'time',
    children: [
      {
        data: chartData,
        type: 'interval',
        yField: 'value',
        colorField: 'type',
        stack: true,
        style: { maxWidth: 80 },
        scale: { y: { domainMax: domainMax } },
        interaction: { elementHighlightByColor: { background: true } },
        label: {
          position: 'inside',
          offset: 5,
          formatter: (params: DualAxesData) => `${params}`
        }
      }
    ],
    theme: { category10: ['#63B3ED', '#FC8181'] }
  }

  const renderDateFilters = () => {
    return (
      <div className='flex items-center justify-end'>
        <Select
          value={filterType}
          onChange={(value: any) => setFilterType(value)}
          style={{ width: 150, marginRight: 10 }}
        >
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
          <div className='flex gap-2'>
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
          </div>
        )}

        {filterType === 'range' && (
          <RangePicker value={[dateRange[0], dateRange[1]]} onChange={handleDateRangeChange} />
        )}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      {renderDateFilters()}
      {loading ? (
        <div className='flex items-center justify-center h-full'>
          <Spin size='large' />
        </div>
      ) : statisticsData.leftChartData.length > 0 && statisticsData.rightChartData.length > 0 ? (
        <div className='flex flex-col gap-3'>
          <Row gutter={16}>
            {statisticsData.rightChartData.map((data, index) => (
              <Col key={index} span={8}>
                <Card
                  style={
                    [{ backgroundColor: '#F6AD55' }, { backgroundColor: '#63B3ED' }, { backgroundColor: '#FC8181' }][
                      index
                    ]
                  }
                >
                  <Statistic title={<span className='font-bold'>{data.type}</span>} value={data.value} />
                </Card>
              </Col>
            ))}
          </Row>
          <div className='mt-2'>
            {chartData.length > 0 ? <DualAxes {...config} /> : <Empty description='Không có dữ liệu để thống kê' />}
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-center h-full'>
          <p>Không có dữ liệu để thống kê.</p>
        </div>
      )}
    </div>
  )
}

export default JobStatistics
