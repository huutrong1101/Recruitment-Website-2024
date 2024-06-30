import React from 'react'
import { DualAxes } from '@ant-design/plots'

interface DualAxesData {
  time: string
  value: number
  type: 'Chờ duyệt' | 'Đã duyệt' | 'Không duyệt'
}

interface LeftChartProps {
  data: DualAxesData[]
}

const LeftChart: React.FC<LeftChartProps> = ({ data }) => {
  const groupedData = data.reduce(
    (acc, item) => {
      if (!acc[item.time]) {
        acc[item.time] = {
          'Chờ duyệt': 0,
          'Đã duyệt': 0,
          'Không duyệt': 0
        }
      }
      acc[item.time][item.type] += item.value
      return acc
    },
    {} as { [key: string]: { 'Chờ duyệt': number; 'Đã duyệt': number; 'Không duyệt': number } }
  )

  // Calculate the maximum value across all groups
  const maxValue = Object.values(groupedData).reduce((max, group) => {
    const total = group['Chờ duyệt'] + group['Đã duyệt'] + group['Không duyệt']
    return Math.max(max, total)
  }, 0)

  const domainMax = Math.ceil(maxValue + maxValue * 0.1) + 1

  const config = {
    xField: 'time',
    legend: {
      color: {
        itemMarker: 'round',
        itemMarkerSize: 14,
        position: 'top'
      }
    },
    children: [
      {
        data,
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
    theme: { category10: ['#63B3ED', '#FC8181', '#68D391'] }
  }

  return <DualAxes {...config} />
}

export default LeftChart
