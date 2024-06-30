import { Pie } from '@ant-design/charts'
import React from 'react'

interface RightChartProps {
  data: { type: string; value: number }[]
}

function RightChart(props: RightChartProps) {
  const { data } = props

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
        position: 'top',
        rowPadding: 5
      }
    },
    interactions: [{ type: 'pie-legend-active' as const }, { type: 'element-active' as const }]
  }

  return <Pie {...config} />
}

export default RightChart
