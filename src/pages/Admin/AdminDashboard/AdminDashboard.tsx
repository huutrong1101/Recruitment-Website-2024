import React, { useEffect } from 'react'
import { BriefcaseIcon, BuildingLibraryIcon, UserPlusIcon, ChartBarIcon } from '@heroicons/react/24/solid'
import { Tabs } from 'antd' // Import Tabs từ antd
import StatisticsCard from '../../../components/Card/StatisticsCard'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import StatisticsRevenueChart from './StatisticsRevenueChart'
import StatisticsApplicationChart from './StatisticsApplicationChart/StatisticsApplicationChart'
import StatisticsCompanyChart from './StatisticsCompanyChart/StatisticsCompanyChart'
import { AdminService } from '../../../services/AdminService'
import StatisticsJobChart from './StatisticsJobChart/StatisticsJobChart'

const { TabPane } = Tabs // Destructuring để lấy TabPane từ Tabs

interface StatisticsCardData {
  color: string
  icon: JSX.Element
  title: string
  value: string
}

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch()

  const totalCandidate = useAppSelector((state: any) => state.AdminSlice.totalCandidate)
  const totalRecruiter = useAppSelector((state: any) => state.AdminSlice.totalRecruiter)
  const totalJob = useAppSelector((state: any) => state.AdminSlice.totalJob)
  const totalBlog = useAppSelector((state: any) => state.AdminSlice.totalBlog)

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
      title: 'Số bài viết',
      value: `${totalBlog}`
    }
  ]

  useEffect(() => {
    AdminService.getTotalCandidate(dispatch)
    AdminService.getTotalRecruiter(dispatch)
    AdminService.getTotalJob(dispatch)
    AdminService.getTotalBlogs(dispatch)
  }, [])

  return (
    <div className='mt-1'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='flex-1 text-2xl font-semibold text-center'>Thống kê số liệu</h1>
      </div>
      <div className='grid mb-6 gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4'>
        {statisticsCardsData.map(({ icon, title, ...rest }) => (
          <StatisticsCard key={title} {...rest} title={title} icon={icon} />
        ))}
      </div>

      {/* Sử dụng Tabs ở đây */}
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Doanh thu' key='1'>
          <StatisticsRevenueChart />
        </TabPane>

        <TabPane tab='Công ty' key='2'>
          <StatisticsCompanyChart />
        </TabPane>

        <TabPane tab='Công việc' key='3'>
          <StatisticsJobChart />
        </TabPane>

        <TabPane tab='Ứng tuyển' key='4'>
          <StatisticsApplicationChart />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default AdminDashboard
