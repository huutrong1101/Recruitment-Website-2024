import React, { useState, useEffect } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Card, Statistic, Row, Col, DatePicker, Spin, Empty } from 'antd'
import { RecService } from '../../../services/RecService'
import { Column, DualAxes } from '@ant-design/charts'
import dayjs from 'dayjs'

const { MonthPicker } = DatePicker

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

interface DualAxesData {
  time: string
  value: number
  type: 'CV tiếp nhận' | 'CV được chấp nhận' | 'CV bị từ chối'
}

type CvStatus = 'CV tiếp nhận' | 'CV được chấp nhận' | 'CV bị từ chối'

function RecStatistical() {
  const navigate = useNavigate()
  const [statistics, setStatistics] = useState<Statistics>({
    totalApplications: 0,
    totalSubmitted: 0,
    totalAccepted: 0,
    totalRejected: 0
  })
  const [chartData, setChartData] = useState<DualAxesData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs())

  const colorMapping: Record<CvStatus, string> = {
    'CV tiếp nhận': '#68D391',
    'CV được chấp nhận': '#63B3ED',
    'CV bị từ chối': '#FC8181'
  }

  const maxValue = chartData.reduce((max, item) => Math.max(max, item.value), 0)
  const domainMax = Math.ceil(maxValue + maxValue * 0.1) + 1

  const transformDataForChart = (dailyDetails: DailyDetail[], month: string, year: string): DualAxesData[] => {
    const submitted = dailyDetails
      .filter((detail) => detail.submitted !== 0)
      .map((detail) => ({
        time: `${year}-${month}-${detail.day.toString().padStart(2, '0')}`,
        value: detail.submitted,
        type: 'CV tiếp nhận' as 'CV tiếp nhận'
      }))

    const accepted = dailyDetails
      .filter((detail) => detail.accepted !== 0)
      .map((detail) => ({
        time: `${year}-${month}-${detail.day.toString().padStart(2, '0')}`,
        value: detail.accepted,
        type: 'CV được chấp nhận' as 'CV được chấp nhận'
      }))

    const rejected = dailyDetails
      .filter((detail) => detail.rejected !== 0)
      .map((detail) => ({
        time: `${year}-${month}-${detail.day.toString().padStart(2, '0')}`,
        value: detail.rejected,
        type: 'CV bị từ chối' as 'CV bị từ chối'
      }))

    const combinedData = [...submitted, ...accepted, ...rejected]
    return combinedData.sort((a, b) => dayjs(a.time).diff(dayjs(b.time)))
  }

  useEffect(() => {
    const initialDate = dayjs()
    fetchData(initialDate.month() + 1, initialDate.year())
    setSelectedDate(initialDate)
  }, [])

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      const month = date.month() + 1
      const year = date.year()
      setSelectedDate(date)
      fetchData(month, year)
    }
  }

  const fetchData = async (month: number, year: number) => {
    setLoading(true)
    try {
      const res = await RecService.getApplicationStatisticByMonth(month.toString(), year.toString())
      const response = res.data

      if (
        'status' in response &&
        (response.status === 'success' || response.status === 'sucess') &&
        response.metadata
      ) {
        setStatistics(response.metadata)
        const formattedData = transformDataForChart(
          response.metadata.monthlyDetails,
          response.metadata.month,
          response.metadata.year
        )
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
    xField: 'time',
    legend: {
      color: {
        itemMarker: 'round',
        itemMarkerSize: 14,
        position: 'top',
        layout: 'horizontal'
      }
    },
    children: [
      {
        data: chartData,
        type: 'interval',
        yField: 'value',
        stack: true,
        colorField: 'type',
        style: { maxWidth: 80 },
        label: { position: 'inside' },
        scale: { y: { domainMax: domainMax } },
        interaction: {
          elementHighlight: true,
          elementHighlightByColor: { background: true }
        }
      }
    ],
    tooltip: {
      formatter: (datum: DualAxesData) => ({
        name: datum.type,
        value: datum.value
      })
    },
    theme: { category10: ['#63B3ED', '#68D391', '#FC8181'] },
    geometryOptions: [
      {
        geometry: 'column',
        colorField: 'type',
        color: ({ type }: { type: string }) => {
          if (type === 'CV tiếp nhận') return '#68D391'
          if (type === 'CV được chấp nhận') return '#63B3ED'
          return '#FC8181'
        }
      }
    ]
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
                <MonthPicker
                  onChange={handleDateChange}
                  format='YYYY-MM'
                  className='float-right w-1/2'
                  value={selectedDate}
                />
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
              <div className='mt-2'>
                {chartData.length > 0 ? <DualAxes {...config} /> : <Empty description='Không có dữ liệu để hiển thị' />}
              </div>
            </div>
          </Spin>
        </div>
      </div>
    </div>
  )
}

export default RecStatistical
