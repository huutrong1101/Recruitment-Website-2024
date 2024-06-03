import React, { useEffect, useState } from 'react'
import { Typography, Card, CardHeader, CardBody, CardFooter } from '@material-tailwind/react'
import PropTypes from 'prop-types'
import { BanknotesIcon, UserPlusIcon, UserIcon, ChartBarIcon, BriefcaseIcon } from '@heroicons/react/24/solid'
import StatisticsCard from '../../components/Card/StatisticsCard'
import chartsConfig from '../../configs/charts-config'
import { ClockIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import StatisticsChart from '../../components/Card/StatisticsChart'
import axiosInstance from '../../utils/AxiosInstance'

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

interface StatisticsData {
  jobCount: number
  eventCount: number
  blackListCount: number
  candidatePassCount: number
}

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState<StatisticsData>()

  const statisticsCardsData = [
    {
      color: 'bg-blue-500',
      icon: <BriefcaseIcon className='w-6 h-6 text-white' />,
      title: 'Total Jobs',
      value: `${statistics?.jobCount}`
    },
    {
      color: 'bg-pink-500',
      icon: <EnvelopeIcon className='w-6 h-6 text-white' />,
      title: 'Total events',
      value: `${statistics?.eventCount}`
    },
    {
      color: 'bg-green-500',
      icon: <UserPlusIcon className='w-6 h-6 text-white' />,
      title: 'Total blacklist',
      value: `${statistics?.blackListCount}`
    },
    {
      color: 'bg-orange-500',
      icon: <ChartBarIcon className='w-6 h-6 text-white' />,
      title: 'Total candidates pass',
      value: `${statistics?.candidatePassCount}`
    }
  ]

  return (
    <div className='mt-12'>
      <div className='grid mb-12 gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4'>
        {statisticsCardsData.map(({ icon, title, ...rest }) => (
          <StatisticsCard key={title} {...rest} title={title} icon={icon} />
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
