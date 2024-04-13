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
  const { jobId } = useParams()
  const dispatch = useAppDispatch()
  // const [job, setJob] = useState<JobInterface | null>(null);
  const jobs: JobInterface[] = useAppSelector((state) => state.Home.jobs)
  const { status } = useAppSelector((state) => state.JobDetail)
  const { job } = useAppSelector((state) => state.JobDetail.response)
  const { isApplied } = useAppSelector((state) => state.JobDetail.response)
  const { user } = useAppSelector((state) => state.Auth)

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

  const navigate = useNavigate()

  useEffect(() => {
    if (!jobId) {
      throw new Error(`The parameter jobId is undefined`)
    }

    dispatch(fetchJobDetail({ jobId }))
      .unwrap()
      .catch((message) => toast.error(message))

    if (user) {
      dispatch(checkApplyJob({ jobId }))
        .unwrap()
        .catch((message) => toast.error(message))
    }

    return () => {}
  }, [jobId])

  const handleBackToJobs = () => {
    navigate('/jobs')
  }

  useEffect(() => {
    if (job) {
      setJobInformation([
        {
          icon: <UserIcon />,
          name: 'Loại hình công việc',
          value: JOB_POSITION[job.jobType]
        },
        {
          icon: <MapPinIcon />,
          name: 'Địa điểm',
          value: JOB_POSITION[job.location]
        },
        {
          icon: <ComputerDesktopIcon />,
          name: 'Vị trí',
          value: JOB_POSITION[job.position]
        },
        {
          icon: <CurrencyDollarIcon />,
          name: 'Mức lương',
          value: job.salaryRange
        },
        {
          icon: <ClockIcon />,
          name: 'Hạn nộp hồ sợ',
          value: moment(job.deadline).format('DD-MM-YYYY').toString()
        }
      ])
    }
  }, [job])

  const otherJobs = jobs.filter((job) => job.jobId !== jobId)

  const shuffledJobs = [...otherJobs]
  let currentIndex = shuffledJobs.length
  let temporaryValue, randomIndex

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    temporaryValue = shuffledJobs[currentIndex]
    shuffledJobs[currentIndex] = shuffledJobs[randomIndex]
    shuffledJobs[randomIndex] = temporaryValue
  }

  const suggestedJobs = shuffledJobs.slice(0, 3)

  return (
    <Container>
      <div className={classNames(`job-detail`)}>
        {status.jobStatus === 'fulfill' ? (
          job ? (
            <>
              {/* Widgets */}
              <JobDescriptionWidget
                companyName='FPT Software'
                jobRole={job.name}
                quantity={job.quantity}
                publishDate={moment(job.createdAt).format('DD-MM-YYYY').toString()}
                logo={{ src: Logo, alt: 'image' }}
                jobId={jobId || ''}
              />

              <JobDetailWidget job={job} jobInformation={jobInformation} />

              {/* Footer */}
              <div className={classNames(`my-8 w-full`)}>
                <h1 className={classNames(`text-3xl font-semibold capitalize text-center mb-2`)}>
                  Công việc liên quan
                </h1>

                <div className='flex flex-wrap -mx-4 mt-[10px]'>
                  {/* <!-- Card --> */}
                  {suggestedJobs &&
                    suggestedJobs.map((data) => (
                      <div key={data.jobId} className='w-full px-3 mb-6 sm:w-1/2 lg:w-1/3'>
                        <JobCard job={data} isShow={false} />
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <NotFound />
          )
        ) : (
          <div className='flex justify-center items-center my-4 min-h-[70vh]'>
            <LoadSpinner className='text-4xl text-gray-400' />
          </div>
        )}
      </div>
    </Container>
  )
}
