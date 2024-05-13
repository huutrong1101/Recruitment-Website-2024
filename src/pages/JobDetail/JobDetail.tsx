import {
  AcademicCapIcon,
  BriefcaseIcon,
  ClockIcon,
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import classNames from 'classnames'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import JobCard from '../../components/JobCard/JobCard'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import NotFound from '../../components/NotFound/NotFound'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { JOB_POSITION } from '../../utils/Localization'
import Logo from './../../../images/logo_FPT.png'
import JobDescriptionWidget from './JobDescriptionWidget'
import JobInformationCard from './JobInformationCard'
import { JobInterface } from '../../types/job.type'
import { checkApplyJob, fetchJobDetail } from '../../redux/reducer/JobDetailSlice'
import axiosInstance from '../../utils/AxiosInstance'
import Container from '../../components/Container/Container'
import { Tabs } from 'antd'
import JobDetailWidget from './JobTab/JobDetailWidget'
import CompanyInfoWidget from './JobTab/CompanyInfoWidget '
import OtherJobsWidget from './JobTab/OtherJobsWidget'

const { TabPane } = Tabs

export default function JobDetail() {
  const dispatch = useAppDispatch()
  const { jobId } = useParams()

  const jobDetail = useAppSelector((state) => state.JobDetail.response.job)

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
          icon: <CurrencyDollarIcon />,
          name: 'Mức lương',
          value: jobDetail.salary
        },
        {
          icon: <ClockIcon />,
          name: 'Hạn nộp hồ sợ',
          value: jobDetail.deadline
        }
      ])
    }
  }, [jobDetail])

  useEffect(() => {
    dispatch(fetchJobDetail({ jobId }))
      .unwrap()
      .catch((message) => toast.error(message))
  }, [jobId])

  console.log(jobDetail)

  return (
    <Container>
      {jobDetail ? (
        <>
          <JobDescriptionWidget job={jobDetail} role='user' />
          <JobDetailWidget job={jobDetail} jobInformation={jobInformation} />

          <div className={classNames(`flex flex-col gap-2 items-center justify-center my-12`)}>
            <h1 className={classNames(`text-3xl font-semibold capitalize`)}>Công việc liên quan</h1>

            <div className={classNames(`flex flex-col md:flex-row gap-6`)}>
              {/* {suggestedJobs.map((data) => {
                return <JobCard job={data} />
              })} */}
            </div>
          </div>
        </>
      ) : (
        <div className='flex justify-center items-center my-4 min-h-[70vh]'>Loading</div>
      )}
    </Container>
  )
}
