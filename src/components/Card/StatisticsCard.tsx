import React from 'react'
import { Col, Row, Statistic } from 'antd'
import { StatisticProps } from 'antd/lib'
import CountUp from 'react-countup'

interface StatisticsCardProps {
  color: string
  icon: React.ReactElement
  title: string
  value: string
}

const formatter: StatisticProps['formatter'] = (value) => <CountUp end={value as number} separator=',' />

export default function StatisticsCard({ color, icon, title, value }: StatisticsCardProps) {
  return (
    <div className={`flex items-center justify-between border rounded-xl shadow-md`}>
      <div className={`ab rounded-lg grid w-16 h-16 ml-4 -mt-4 place-items-center ${color}`}>{icon}</div>
      <div className='p-4 text-right'>
        <p className='font-normal text-blue-gray-600'>{title}</p>

        <h4 color='blue-gray'>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic value={value} formatter={formatter} />
            </Col>
          </Row>
        </h4>
      </div>
    </div>
  )
}
