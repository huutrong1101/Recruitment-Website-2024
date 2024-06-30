import {
  AcademicCapIcon,
  BriefcaseIcon,
  ClockIcon,
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import JobDescriptionWidget from './JobDescriptionWidget'
import { checkApplyJob, checkFavoriteJob, fetchJobDetail } from '../../redux/reducer/JobDetailSlice'
import Container from '../../components/Container/Container'
import JobDetailWidget from './JobTab/JobDetailWidget'
import axios from 'axios'
import axiosInstance from '../../utils/AxiosInstance'
import JobCard from '../../components/JobCard/JobCard'
import { Spin } from 'antd'

export default function JobDetail() {
  const dispatch = useAppDispatch()
  const { jobId } = useParams()

  const jobDetail = useAppSelector((state) => state.JobDetail.response.job)
  const { user } = useAppSelector((state) => state.Auth)
  const [relatedJobs, setRelatedJobs] = useState([])
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
          icon: <UsersIcon />,
          name: 'Số lượng',
          value: jobDetail.quantity.toString()
        },
        {
          icon: <ClockIcon />,
          name: 'Hạn nộp hồ sợ',
          value: jobDetail.deadline
        }
      ])

      const fetchRelatedJobs = async () => {
        try {
          // Gọi API để lấy danh sách công việc liên quan
          const response = await axiosInstance.get(`/jobs/${jobDetail._id}/related_jobs`)

          if (response && response.data) {
            setRelatedJobs(response.data.metadata.listJob)
          }
        } catch (err: any) {
          toast.error(`${err.message}`)
          throw err
        }
      }

      fetchRelatedJobs()
    }
  }, [jobDetail])

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true) // bắt đầu loading

      try {
        if (!jobId) {
          throw new Error(`The parameter jobId is undefined`)
        }

        await dispatch(fetchJobDetail({ jobId })).unwrap()

        if (user) {
          await Promise.all([
            // Đồng bộ kiểm tra
            dispatch(checkApplyJob({ jobId })).unwrap(),
            dispatch(checkFavoriteJob({ jobId })).unwrap()
          ])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetails()
  }, [jobId, dispatch, user])

  return (
    <Container>
      {isLoading ? (
        <div className='flex justify-center items-center my-4 min-h-[70vh]'>
          <Spin size='large' />
        </div>
      ) : jobDetail ? (
        <>
          <JobDescriptionWidget job={jobDetail} role='user' />
          <JobDetailWidget job={jobDetail} jobInformation={jobInformation} />

          <div className={classNames(`flex flex-col gap-2 items-center justify-center my-12`)}>
            <h1 className={classNames(`text-3xl font-semibold capitalize`)}>Công việc liên quan</h1>

            <div className='flex flex-wrap -mx-4 mt-[10px] w-full'>
              {relatedJobs && relatedJobs.length > 0 ? (
                relatedJobs.slice(0, 3).map((job) => (
                  <div key={job} className='w-full px-3 mb-6 sm:w-1/2 lg:w-1/3'>
                    <JobCard job={job} isShow={false} inNews={false} />
                  </div>
                ))
              ) : (
                <div className='flex items-center justify-center w-full'>
                  <p>Hiện chưa có công việc nào liên quan</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center w-full'>
          <p>Không tìm thấy công việc phù hợp</p>
        </div>
      )}
    </Container>
  )
}
