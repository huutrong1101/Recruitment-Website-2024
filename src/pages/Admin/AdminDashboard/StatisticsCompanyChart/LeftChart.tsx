import React from 'react'
import { Line } from '@ant-design/charts'

interface LeftChartProps {
  data: { month: string; totalNewRecruiters: number }[]
}

function LeftChart(props: LeftChartProps) {
  const { data } = props

  console.log(data)

  const config = {
    data,
    xField: 'month',
    yField: 'totalNewRecruiters',
    point: {
      size: 5,
      shape: 'diamond'
    },
    label: {
      style: {
        fill: '#aaa'
      }
    }
  }

  return <Line {...config} />
}

export default LeftChart
