import {
  AcademicCapIcon,
  BriefcaseIcon,
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
import Logo from '../../../../images/logo_FPT.png'
import { JOB_POSITION } from '../../../utils/Localization'
import moment from 'moment'
import { toast } from 'react-toastify'
import LoadSpinner from '../../../components/LoadSpinner/LoadSpinner'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { fetchRecJobDetail } from '../../../redux/reducer/RecJobDetailSlice'
import JobDescriptionWidget from '../../JobDetail/JobDescriptionWidget'
import NotFound from '../../../components/NotFound/NotFound'
import RecJobInformationCard from './ReccerJobInformationCard'
import Modal from '../../../components/Modal/Modal'
import { JobService } from '../../../services/JobService'
import Suggested from './SuggestedCandidate'
import Applied from './AppliedCandidate'

export default function ReccerJobDetail() {
  const [jobInformation, setJobInformation] = useState([
    { icon: <UserIcon />, name: 'Employee Type', value: '' },
    { icon: <MapPinIcon />, name: 'Location', value: '' },
    {
      icon: <ComputerDesktopIcon />,
      name: 'Position Type',
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

  const { jobId } = useParams()

  const dispatch = useAppDispatch()

  const { status } = useAppSelector((state) => state.RecJobDetail)

  const { job } = useAppSelector((state) => state.RecJobDetail.response)

  useEffect(() => {
    if (!jobId) {
      throw new Error(`The parameter jobId is undefined`)
    }

    dispatch(fetchRecJobDetail({ jobId }))
      .unwrap()
      .catch((message) => toast.error(message))
    return () => {}
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
          value: JOB_POSITION[job.position]
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

  // const deleteJob = async () => {
  //   toast
  //     .promise(JobService.deleteJob(job?.jobId), {
  //       pending: `Delete Job`,
  //       success: `The Job was deleted`
  //     })
  //     .catch((error) => toast.error(error.response.data.result))
  //   navigate({
  //     pathname: '/recruiter/jobs'
  //   })
  // }

  const routeChange = () => {
    let path = `./edit`
    navigate(path)
  }

  let [isOpen, setIsOpen] = useState(false)

  const handleClickOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleDelete = () => {
    if (job) {
      toast
        .promise(JobService.deleteJob(job?.jobId), {
          pending: `Delete Job`,
          success: `The Job was deleted`
        })
        .catch((error) => toast.error(error.response.data.result))
      navigate({
        pathname: '/recruiter/jobs'
      })
    }
  }

  return (
    <>
      <div className={classNames(`job-detail`, `flex flex-col gap-6`)}>
        {status.jobStatus === 'fulfill' ? (
          job ? (
            <>
              <div className={classNames(`flex flex-col md:flex-row gap-12`)}>
                {/* Left side description */}
                <div className={classNames(`w-full md:w-8/12`, `flex flex-col gap-6 mt-3`)}>
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
                  {/* Function */}
                  <div className={classNames(`flex px-1 py-1`)}>
                    <div className={classNames(`text-justify`)}>
                      <button
                        className='rounded-lg bg-[#059669] hover:bg-green-900 px-4 py-2 mx-2 my-1 text-white'
                        onClick={routeChange}
                      >
                        Edit Job
                      </button>
                    </div>
                    <div className={classNames(`text-justify`)}>
                      <button
                        className='px-4 py-2 mx-2 my-1 text-white bg-red-700 rounded-lg hover:bg-red-900'
                        // onClick={deleteJob}
                        onClick={handleClickOpen}
                      >
                        Delete Job
                      </button>
                      <Modal
                        isOpen={isOpen}
                        onClose={handleClose}
                        title='Delete Job'
                        titleClass='text-xl font-bold leading-7 text-center text-red-600'
                        cancelTitle='No'
                        successClass='text-green-900 bg-green-100 hover:bg-green-200 focus-visible:ring-green-500'
                        successTitle='Yes'
                        size='max-w-xl'
                        handleSucces={handleDelete}
                      >
                        <div className='flex items-center justify-center gap-5 mt-2'>
                          <div className='w-full'>
                            <h1 className='mb-2 text-lg font-semibold text-center'>
                              Are you sure you want to delete{' '}
                              <span className={classNames('text-red-500')}>{job.name}</span>?
                            </h1>
                            <div className='text-center'>
                              This action cannot be undone, the deleted item cannot be restored.
                            </div>
                          </div>
                        </div>
                      </Modal>
                    </div>
                  </div>
                </div>
                {/* Right side description */}
                <div className={classNames(`w-full md:w-3/12 flex-1 relative`)}>
                  <RecJobInformationCard cardData={jobInformation} />
                </div>
              </div>

              {/* /Applied Candidate */}
              <Applied num={job?.quantity} />

              {/* Suggested Candidate*/}
              <Suggested />
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
    </>
  )
}
