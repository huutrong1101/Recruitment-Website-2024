import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AdminService } from '../../../services/AdminService'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import JobDescriptionWidget from '../../JobDetail/JobDescriptionWidget'
import JobDetailWidget from '../../JobDetail/JobTab/JobDetailWidget'
import {
  AcademicCapIcon,
  BriefcaseIcon,
  ClockIcon,
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { Spin } from 'antd'

function AdminManageJobDetail() {
  const dispatch = useAppDispatch()
  const { jobId } = useParams()

  const { jobDetail } = useAppSelector((state) => state.AdminSlice)
  const [isLoading, setIsLoading] = useState(true)

  const [jobInformation, setJobInformation] = useState([
    { icon: <UserIcon />, name: 'Loại hình công việc', value: '' },
    { icon: <MapPinIcon />, name: 'Địa điểm', value: '' },
    {
      icon: <ComputerDesktopIcon />,
      name: 'Vị trí',
      value: 'Back-end Developer'
    },
    { icon: <BriefcaseIcon />, name: 'Experience', value: '2+ years' },
    { icon: <AcademicCapIcon />, name: 'Qualification', value: 'MCA' },
    {
      icon: <CurrencyDollarIcon />,
      name: 'Salary',
      value: '12 Mil (negotiable)'
    },
    {
      icon: <ClockIcon />,
      name: 'Posted at',
      value: new Date().toDateString()
    }
  ])

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true)
      try {
        if (jobId) {
          await AdminService.getJobDetail(dispatch, jobId)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetails()
  }, [dispatch, jobId])

  useEffect(() => {
    if (jobDetail) {
      setJobInformation([
        {
          icon: <UserIcon />,
          name: 'Loại hình công việc',
          value: jobDetail.type
        },
        {
          icon: <MapPinIcon />,
          name: 'Địa điểm',
          value: jobDetail.location
        },
        {
          icon: <ComputerDesktopIcon />,
          name: 'Vị trí',
          value: jobDetail.levelRequirement
        },
        {
          icon: <CurrencyDollarIcon />,
          name: 'Mức lương',
          value: formatSalary(jobDetail.salary)
        },
        {
          icon: <ClockIcon />,
          name: 'Hạn nộp hồ sợ',
          value: jobDetail.deadline
        }
      ])
    }
  }, [jobDetail])

  const formatNumber = (number: number): string => {
    return (number / 1000000).toLocaleString('vi-VN')
  }

  const formatSalary = (salary: string): string => {
    if (salary.toLowerCase() === 'thỏa thuận') {
      return 'Thỏa thuận'
    } else if (salary.includes('-')) {
      const [min, max] = salary.split('-').map((s) => parseInt(s, 10))
      return `${formatNumber(min)} triệu - ${formatNumber(max)} triệu`
    } else {
      const amount = parseInt(salary, 10)
      return `${formatNumber(amount)} triệu`
    }
  }

  return (
    <>
      {isLoading ? (
        <div className='flex justify-center items-center my-4 min-h-[70vh]'>
          <Spin size='large' />
        </div>
      ) : jobDetail ? (
        <>
          <JobDescriptionWidget job={jobDetail} role='admin' />
          <JobDetailWidget job={jobDetail} jobInformation={jobInformation} />
        </>
      ) : (
        <div className='flex items-center justify-center w-full'>
          <p>Không tìm thấy công việc phù hợp</p>
        </div>
      )}
    </>
  )
}

export default AdminManageJobDetail
