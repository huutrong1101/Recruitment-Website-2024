import {
  ClockIcon,
  ComputerDesktopIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Logo from '../../../images/logo_FPT.png'
import moment from 'moment'
import { JobInterface } from '../../types/job.type'
import axiosInstance from '../../utils/AxiosInstance'
import { JOB_POSITION } from '../../utils/Localization'
import JobDescriptionWidget from '../JobDetail/JobDescriptionWidget'
import JobInformationCard from '../JobDetail/JobInformationCard'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'

export default function AdminJobDetail() {
  const [jobInformation, setJobInformation] = useState([{ icon: <UserIcon />, name: '', value: '' }])
  const { jobId } = useParams()
  const [job, setJob] = useState<JobInterface | null>(null)
  useEffect(() => {
    const getJobDetail = async () => {
      const response = await axiosInstance.get(`/jobs/${jobId}`) //Viết API cho BE viết lấy 1 job trong list job của reccer
      setJob(response.data.result)
    }
    getJobDetail()
  }, [jobId])

  useEffect(() => {
    if (job) {
      setJobInformation([
        {
          icon: <UserIcon />,
          name: 'Employee Type',
          value: JOB_POSITION[job.jobType]
        },
        {
          icon: <MapPinIcon />,
          name: 'Location',
          value: JOB_POSITION[job.location]
        },
        {
          icon: <ComputerDesktopIcon />,
          name: 'Position',
          value: JOB_POSITION[job.position.name]
        },
        {
          icon: <CurrencyDollarIcon />,
          name: 'Salary',
          value: job.salaryRange
        },
        {
          icon: <ClockIcon />,
          name: 'End At',
          value: moment(job.deadline).format('Do MMM, YYYY')
        }
      ])
    }
  }, [job])

  const navigate = useNavigate()

  const routeChange = () => {
    let path = `./edit`
    navigate(path)
  }
  const [open, setOpen] = React.useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <div className={classNames(`job-detail`, `flex flex-col gap-6 mt-5`)}>
        {job ? (
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
                  publishDate={moment(job.createdAt).format('Do MMM, YYYY').toString()}
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
                    <h1 className='text-2xl font-semibold'>Job description</h1>
                    <p>{job?.description}</p>
                  </div>
                  <div>
                    <h1 className='text-2xl font-semibold'>Requirement</h1>
                    <p>{job?.requirement}</p>
                  </div>
                  <div>
                    <h1 className='text-2xl font-semibold'>Benefit</h1>
                    <p>{job?.benefit}</p>
                  </div>
                  <div>
                    <h1 className='text-2xl font-semibold'>Skills Require</h1>
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
          </>
        ) : (
          <div className='flex justify-center mt-5'>
            <LoadSpinner className='text-3xl' />
          </div>
        )}
      </div>
    </>
  )
}
