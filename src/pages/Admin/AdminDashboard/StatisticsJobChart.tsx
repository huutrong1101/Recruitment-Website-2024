import React from 'react'
import { Pie } from '@ant-design/charts'

const StatisticsJobChart: React.FC = () => {
  // Sample data for the pie chart
  const data = [
    { type: 'Engineering', value: 27 },
    { type: 'Marketing', value: 25 },
    { type: 'Design', value: 18 },
    { type: 'Sales', value: 15 },
    { type: 'Support', value: 10 },
    { type: 'Others', value: 5 }
  ]

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
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
    }
  }

  return (
    <>
      <h1 className='font-medium text-center'>Thống kê công việc</h1>
      <div className='w-full h-full mt-1'>
        <Pie {...config} />
      </div>
    </>
  )
}

export default StatisticsJobChart
