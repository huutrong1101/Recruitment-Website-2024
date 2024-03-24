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
              {' '}
              <div className={classNames(`flex flex-col md:flex-row gap-12`)}>
                {/* Left side description */}
                <div className={classNames(`w-full md:w-8/12`, `flex flex-col gap-6`)}>
                  {/* Widgets */}
                  <JobDescriptionWidget
                    companyName='FPT Software'
                    jobRole={job.name}
                    quantity={job.quantity}
                    publishDate={moment(job.createdAt).format('DD-MM-YYYY').toString()}
                    logo={{ src: Logo, alt: 'image' }}
                  />
                  {/* Details */}
                  <div
                    className={classNames(
                      `border bg-white shadow-sm rounded-xl flex flex-col gap-8`,
                      `px-8 py-8`,
                      `text-justify`
                    )}
                  >
                    <div>
                      <h1 className='text-2xl font-semibold capitalize'>Chi tiết công việc</h1>
                      <p className='mt-2 whitespace-pre-line'>{job?.description}</p>
                    </div>
                    <div>
                      <h1 className='text-2xl font-semibold capitalize'>Yêu cầu công việc</h1>
                      <p className='mt-2 whitespace-pre-line'>{job?.requirement}</p>
                    </div>
                    <div>
                      <h1 className='text-2xl font-semibold capitalize'>Quyền lợi</h1>
                      <p className='mt-2 whitespace-pre-line'>{job?.benefit}</p>
                    </div>
                    <div>
                      <h1 className='text-2xl font-semibold capitalize'>Kĩ năng yêu cầu</h1>
                      <div className='flex flex-wrap px-2 py-4'>
                        {job?.skills.map((item, index) => (
                          <div key={index}>
                            <span
                              key={index}
                              className='rounded-lg bg-[#78AF9A] bg-opacity-40 p-2 mx-2 my-1 text-[#218F6E]'
                            >
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side description */}
                <div className={classNames(`w-full md:w-3/12 flex-1 relative`)}>
                  <JobInformationCard cardData={jobInformation} jobId={jobId} />
                </div>
              </div>
              {/* Footer */}
              <div className={classNames(`flex flex-col gap-2 items-center justify-center my-12`)}>
                <h1 className={classNames(`text-3xl font-semibold capitalize`)}>Công việc liên quan</h1>

                <div className={classNames(`flex flex-col md:flex-row gap-6`)}>
                  {/* TODO: add job fetch data */}
                  {suggestedJobs.map((data) => {
                    return <JobCard job={data} />
                  })}
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
