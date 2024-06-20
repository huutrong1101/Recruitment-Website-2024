import React from 'react'
import { BriefcaseIcon, BuildingLibraryIcon, UserPlusIcon, ChartBarIcon } from '@heroicons/react/24/solid'
import StatisticsCard from '../../../components/Card/StatisticsCard'
import { useAppSelector } from '../../../hooks/hooks'
import StatisticsRevenueChart from './StatisticsRevenueChart'
import StatisticsJobChart from './StatisticsJobChart'
import StatisticsApplicationChart from './StatisticsApplicationChart'

interface StatisticsCardData {
  color: string
  icon: JSX.Element
  title: string
  value: string
}

const AdminDashboard: React.FC = () => {
  const totalCandidate = useAppSelector((state: any) => state.AdminSlice.totalCandidate)
  const totalRecruiter = useAppSelector((state: any) => state.AdminSlice.totalRecruiter)
  const totalJob = useAppSelector((state: any) => state.AdminSlice.totalJob)

  const statisticsCardsData: StatisticsCardData[] = [
    {
      color: 'bg-blue-500',
      icon: <BriefcaseIcon className='w-6 h-6 text-white' />,
      title: 'Số công việc',
      value: `${totalJob}`
    },
    {
      color: 'bg-pink-500',
      icon: <BuildingLibraryIcon className='w-6 h-6 text-white' />,
      title: 'Số công ty',
      value: `${totalRecruiter}`
    },
    {
      color: 'bg-green-500',
      icon: <UserPlusIcon className='w-6 h-6 text-white' />,
      title: 'Số ứng viên',
      value: `${totalCandidate}`
    },
    {
      color: 'bg-orange-500',
      icon: <ChartBarIcon className='w-6 h-6 text-white' />,
      title: 'Total candidates pass',
      value: `14`
    }
  ]

  return (
    <div className='mt-1'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='flex-1 text-2xl font-semibold text-center'>Thống kê số liệu</h1>
      </div>
      <div className='grid mb-12 gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4'>
        {statisticsCardsData.map(({ icon, title, ...rest }) => (
          <StatisticsCard key={title} {...rest} title={title} icon={icon} />
        ))}
      </div>

      <div className='flex w-full gap-5'>
        <div className='w-3/5'>
          <StatisticsRevenueChart />
        </div>
        <div className='flex flex-col w-2/5 gap-5'>
          <div className={`flex flex-col border rounded-xl shadow-md p-4 w-full h-1/2`}>
            <StatisticsJobChart />
          </div>
          <div className={`flex flex-col border rounded-xl shadow-md p-4 w-full h-1/2`}>
            <StatisticsApplicationChart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
