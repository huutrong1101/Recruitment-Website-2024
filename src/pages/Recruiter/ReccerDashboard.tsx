import React from 'react'
import { Typography, Card, CardHeader, CardBody, CardFooter } from '@material-tailwind/react'
import PropTypes from 'prop-types'
import { BanknotesIcon, UserPlusIcon, UserIcon, ChartBarIcon } from '@heroicons/react/24/solid'
import StatisticsCard from '../../components/Card/StatisticsCard'
import chartsConfig from '../../configs/charts-config'
import { ClockIcon } from '@heroicons/react/24/outline'
import StatisticsChart from '../../components/Card/StatisticsChart'

const statisticsCardsData = [
  {
    color: 'bg-blue-500',
    icon: <BanknotesIcon className='w-6 h-6 text-white' />,
    title: "Today's Money",
    value: '$53k',
    footer: (
      <Typography className='font-normal text-blue-gray-600'>
        <strong className='text-green-500'>+55%</strong>&nbsp;than last week
      </Typography>
    )
  },
  {
    color: 'bg-pink-500',
    icon: <UserIcon className='w-6 h-6 text-white' />,
    title: "Today's Users",
    value: '2,300',
    footer: (
      <Typography className='font-normal text-blue-gray-600'>
        <strong className='text-green-500'>+3%</strong>&nbsp;than last month
      </Typography>
    )
  },
  {
    color: 'bg-green-500',
    icon: <UserPlusIcon className='w-6 h-6 text-white' />,
    title: 'New Clients',
    value: '3,462',
    footer: (
      <Typography className='font-normal text-blue-gray-600'>
        <strong className='text-red-500'>-2%</strong>&nbsp;than yesterday
      </Typography>
    )
  },
  {
    color: 'bg-orange-500',
    icon: <ChartBarIcon className='w-6 h-6 text-white' />,
    title: 'Sales',
    value: '$103,430',
    footer: (
      <Typography className='font-normal text-blue-gray-600'>
        <strong className='text-green-500'>+5%</strong>&nbsp;than yesterday
      </Typography>
    )
  }
]

const websiteViewsChart = {
  type: 'bar',
  height: 220,
  series: [
    {
      name: 'Views',
      data: [50, 20, 10, 22, 50, 10, 40]
    }
  ],
  options: {
    ...chartsConfig,
    colors: '#fff',
    plotOptions: {
      bar: {
        columnWidth: '16%',
        borderRadius: 5
      }
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    }
  }
}

const dailySalesChart = {
  type: 'line',
  height: 220,
  series: [
    {
      name: 'Sales',
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500]
    }
  ],
  options: {
    ...chartsConfig,
    colors: ['#fff'],
    stroke: {
      lineCap: 'round'
    },
    markers: {
      size: 5
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  }
}

const completedTasksChart = {
  ...dailySalesChart,
  series: [
    {
      name: 'Tasks',
      data: [50, 40, 300, 220, 500, 250, 400, 230, 500]
    }
  ]
}

export const statisticsChartsData = [
  {
    color: 'bg-blue-500',
    title: 'Website View',
    description: 'Last Campaign Performance',
    footer: 'campaign sent 2 days ago',
    chart: websiteViewsChart
  },
  {
    color: 'bg-pink-500',
    title: 'Daily Sales',
    description: '15% increase in today sales',
    footer: 'updated 4 min ago',
    chart: dailySalesChart
  },
  {
    color: 'bg-green-500',
    title: 'Completed Tasks',
    description: 'Last Campaign Performance',
    footer: 'just updated',
    chart: completedTasksChart
  }
]

export default function ReccerDashboard() {
  return (
    <div className='mt-12'>
      <div className='grid mb-12 gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4'>
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard key={title} {...rest} title={title} icon={icon} footer={footer} />
        ))}
      </div>
      <div className='grid grid-cols-1 mb-6 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3'>
        {statisticsChartsData.map((props) => (
          <StatisticsChart key={props.title} {...props} footer={props.footer} />
        ))}
      </div>
    </div>
  )
}
