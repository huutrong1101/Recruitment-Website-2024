import React, { useState, useEffect } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Card, Statistic, Row, Col, DatePicker, Spin } from 'antd'
import { RecService } from '../../../services/RecService'
import { Line } from '@ant-design/charts'

const { RangePicker } = DatePicker

interface Statistics {
  totalApplications: number
  totalSubmitted: number
  totalAccepted: number
  totalRejected: number
}

interface DailyDetail {
  day: string
  totalApplications: number
  submitted: number
  accepted: number
  rejected: number
}

interface StatisticResponse {
  message: string
  status: string
  statusCode: number
  metadata: {
    startDate: string
    endDate: string
    totalApplications: number
    totalSubmitted: number
    totalAccepted: number
    totalRejected: number
    dailyDetails: DailyDetail[]
  }
  options: any
}

interface ChartData {
  day: string
  category: 'Total Applications' | 'Submitted' | 'Accepted' | 'Rejected'
  value: number
}

function RecStatistical() {
  const navigate = useNavigate()
  const [statistics, setStatistics] = useState<Statistics>({
    totalApplications: 0,
    totalSubmitted: 0,
    totalAccepted: 0,
    totalRejected: 0
  })
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const transformDataForChart = (dailyDetails: DailyDetail[]): ChartData[] => {
    return dailyDetails.flatMap((detail) => [
      { day: detail.day, category: 'Total Applications', value: detail.totalApplications },
      { day: detail.day, category: 'Submitted', value: detail.submitted },
      { day: detail.day, category: 'Accepted', value: detail.accepted },
      { day: detail.day, category: 'Rejected', value: detail.rejected }
    ])
  }

  useEffect(() => {
    fetchData('2024-05-10T17:00:00.000Z', '2024-06-15T17:00:00.000Z')
  }, [])

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    const [startDate, endDate] = dateStrings
    if (startDate && endDate) {
      setLoading(true)
      fetchData(startDate, endDate)
    }
  }

  const fetchData = async (startDate: string, endDate: string) => {
    setLoading(true)
    try {
      const res = await RecService.getApplicationStatistic(startDate, endDate)
      const response = res.data

      if (
        'status' in response &&
        (response.status === 'success' || response.status === 'sucess') &&
        response.metadata
      ) {
        setStatistics(response.metadata)
        const formattedData = transformDataForChart(response.metadata.dailyDetails)
        setChartData(formattedData)
      } else {
        console.error('Failed to fetch statistics')
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const config = {
    data: chartData,
    xField: 'day',
    yField: 'value',
    seriesField: 'category',
    legend: { position: 'top-left' },
    smooth: true,
    color: (name: string) => {
      // Định cấu hình màu sắc cụ thể cho từng 'category'
      switch (name) {
        case 'Total Applications':
          return '#3399FF' // Màu xanh dương cho Tổng số ứng tuyển
        case 'Submitted':
          return '#33CC33' // Màu xanh lá cho CV tiếp nhận
        case 'Accepted':
          return '#9966FF' // Màu tím cho CV được chấp nhận
        case 'Rejected':
          return '#FF5050' // Màu đỏ cho CV bị từ chối
        default:
          return '#D9D9D9' // Màu mặc định
      }
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='w-full border rounded-xl border-zinc-100'>
        <div className='flex items-center justify-center gap-5 p-2 rounded-tl-lg bg-slate-200 rounded-tr-xl'>
          <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer' }} className='font-bold' />
          <h6 className='flex-1 text-lg font-semibold uppercase'>THỐNG KÊ SỐ LIỆU</h6>
        </div>
        <div className='p-4'>
          <Spin spinning={loading}>
            <div className='flex flex-col gap-3'>
              <div className='w-full'>
                <RangePicker onChange={handleDateChange} format='YYYY-MM-DD' className='float-right w-1/2 ' />
              </div>
              <Row gutter={16}>
                <Col span={6}>
                  <Card style={{ backgroundColor: '#F6AD55' }}>
                    <Statistic
                      title={<span className='font-bold'>Tổng số ứng tuyển</span>}
                      value={statistics.totalApplications}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card style={{ backgroundColor: '#68D391' }}>
                    <Statistic
                      title={<span className='font-bold'>CV tiếp nhận</span>}
                      value={statistics.totalSubmitted}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card style={{ backgroundColor: '#63B3ED' }}>
                    <Statistic
                      title={<span className='font-bold'>CV được chấp nhận</span>}
                      value={statistics.totalAccepted}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card style={{ backgroundColor: '#FC8181' }}>
                    <Statistic
                      title={<span className='font-bold'>CV bị từ chối</span>}
                      value={statistics.totalRejected}
                    />
                  </Card>
                </Col>
              </Row>
              <Line {...config} />
            </div>
          </Spin>
        </div>
      </div>
    </div>
  )
}

export default RecStatistical
