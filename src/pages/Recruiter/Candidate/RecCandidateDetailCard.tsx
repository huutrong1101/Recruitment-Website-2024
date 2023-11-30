// import { avatar } from "@material-tailwind/react";
import classNames from 'classnames'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { GrDocumentText } from 'react-icons/gr'
import { HiOutlineDeviceMobile } from 'react-icons/hi'
import { MdOutlineCalendarMonth, MdOutlineEmail, MdOutlineLocationOn } from 'react-icons/md'
import { toast } from 'react-toastify'
import ThumbnailCover from '../../../../images/cover2.jpg'
import LoadSpinner from '../../../components/LoadSpinner/LoadSpinner'
import InterviewHistory from '../../../components/RecCandidateManageCard/InterviewHistory'
import RecCandidateinfoCard from '../../../components/RecCandidateManageCard/RecCandidateInfoCard'

export default function RecCandidateDetailCard(props: any) {
  const candidate = props.candidate

  const [CandidateInformaiton, setCandidateInformation] = useState([
    { icon: <MdOutlineEmail />, name: '', value: '' },
    { icon: <MdOutlineCalendarMonth />, name: '', value: '' },
    { icon: <MdOutlineLocationOn />, name: '', value: '' },
    { icon: <HiOutlineDeviceMobile />, name: '', value: '' }
  ])

  useEffect(() => {
    if (candidate) {
      setCandidateInformation([
        { icon: <MdOutlineEmail />, name: 'Email', value: candidate?.candidateEmail },
        {
          icon: <MdOutlineCalendarMonth />,
          name: 'D.O.B',
          value: moment(candidate?.dateOfBirth).format('Do MMM, YYYY')
        },
        {
          icon: <MdOutlineLocationOn />,
          name: 'Address',
          value: candidate.address
        },
        {
          icon: <HiOutlineDeviceMobile />,
          name: 'Phone',
          value: formatPhoneNumber(candidate?.phone)
        }
      ])
    }
  }, [candidate])

  function formatPhoneNumber(phoneNumber: any) {
    if (phoneNumber == null) {
      return
    }
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '')
    if (cleanedPhoneNumber.length === 10) {
      return cleanedPhoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
    }
    return phoneNumber
  }

  const handleEdit = () => {
    window.open(candidate?.resumeDetailDTO?.resumeUpload, '_blank')
  }
  const handleLink = (url: string) => {
    url ? window.open(url) : toast.error('Not Available ')
  }

  const handleDate = (inputDate: any) => {
    return moment(inputDate).format('DD-MM-YYYY')
  }

  console.log(candidate)

  return (
    <div>
      {candidate ? (
        <>
          <section className='relative'>
            <div className=''>
              <div className='relative w-full shrink-0'>
                <img src={ThumbnailCover} className='object-cover w-full h-64 shadow lg:rounded-xl ' />
              </div>
              <div className='-mt-12 md:flex ms-4'>
                <div className='md:w-full'>
                  <div className='relative flex items-end'>
                    <img src={candidate.avatar} className='rounded-full h-28 w-28 ring-4 ring-slate-50' />
                    <div className='ms-4 mb-7 mt-7'>
                      <p className='text-2xl font-semibold'>{candidate?.candidateFullName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className='relative pb-10 mt-12 md:pb-15'>
            <div className='grid md:grid-cols-12 grid-cols-1 gap-[30px]'>
              <div className='lg:col-span-8 md:col-span-7'>
                <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
                  <h1 className='text-2xl font-semibold'>Description</h1>
                  {/* <p className='mt-3 text-lg text-zinc-600'>{candidate?.about}</p> */}
                  <p>{candidate?.about}</p>
                </div>
                <div className='grid grid-cols-1 gap-6 mt-4 lg:grid-cols-1'>
                  <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
                    <div className='text-2xl font-semibold'>Skill</div>
                    <div>
                      {candidate.information?.skills?.map((skill: any, index: any) => (
                        <p
                          key={index}
                          className='inline-flex gap-2 px-4 py-2 mb-2 ml-2 text-white rounded-md bg-emerald-600 hover:bg-emerald-700 border-emerald-600'
                        >
                          {skill.label}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
                    <div className='text-2xl font-semibold'>Education</div>
                    <div className='flex flex-wrap gap-4'>
                      {candidate.information?.education?.map((edu: any, index: any) => (
                        <>
                          <div
                            key={index}
                            className='px-2 py-2 mt-3 text-lg border rounded-lg shadow text-zinc-600 w-fit bg-emerald-50'
                          >
                            <p>School: {edu.school}</p>
                            <p>Major: {edu.major}</p>
                            <p>Graduated Year: {handleDate(edu.graduatedYear)}</p>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                  <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
                    <div className='text-2xl font-semibold'>Project</div>
                    <div className='flex flex-wrap gap-4'>
                      {candidate.information?.project?.map((edu: any, index: any) => (
                        <div>
                          <div
                            key={index}
                            className='px-2 py-2 mt-3 text-lg border rounded-t-lg shadow text-zinc-600 w-fit bg-emerald-50'
                          >
                            <p>Project: {edu.name}</p>
                            <p>Description: {edu.description}</p>
                            {/* <p>Link: {edu.url}</p> */}
                          </div>
                          <button
                            className='w-full p-1 text-center text-white border rounded-b-lg shadow bg-emerald-500 hover:bg-emerald-700 border-emerald-600'
                            onClick={() => handleLink(edu.url)}
                          >
                            View Project
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
                    <div className='text-2xl font-semibold'>Experience</div>
                    <div className='flex flex-wrap gap-4'>
                      {candidate.information?.experience?.map((edu: any, index: any) => (
                        <>
                          <div
                            key={index}
                            className='px-2 py-2 mt-3 text-lg border rounded-lg shadow text-zinc-600 w-fit bg-emerald-50'
                          >
                            <p>Company Name: {edu.companyName}</p>
                            <p>Position: {edu.position}</p>
                            <p>From: {handleDate(edu.dateFrom) + ' to ' + handleDate(edu.dateTo)}</p>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                  <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
                    <div className='text-2xl font-semibold'>Certificate</div>
                    <div className='flex flex-wrap gap-4'>
                      {candidate.information?.certificate?.map((edu: any, index: any) => (
                        <div>
                          <div
                            key={index}
                            className='px-2 py-2 mt-3 text-lg border rounded-t-lg shadow text-zinc-600 w-fit bg-emerald-50'
                          >
                            <p>Title: {edu.name}</p>
                            <p>Id: {edu.id}</p>
                            <p>Received Date: {handleDate(edu.receivedDate)}</p>
                            {/* <p>Link: {edu.url}</p> */}
                          </div>
                          <button
                            className='w-full p-1 text-center text-white border rounded-b-lg shadow bg-emerald-500 hover:bg-emerald-700 border-emerald-600'
                            onClick={() => handleLink(edu.url)}
                          >
                            View Project
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className='lg:col-span-4 md:col-span-5'>
                <div
                  className={classNames(
                    `w-full bg-gray-200 drop-shadow-md px-4 py-6 rounded-xl border sticky top-20`,
                    `flex flex-col gap-4`
                  )}
                >
                  <RecCandidateinfoCard cardData={CandidateInformaiton} />
                  <div className='flex items-center justify-center w-full p-3 mt-3 bg-white rounded-md shadow '>
                    {candidate?.resumeDetailDTO ? (
                      <div className='flex items-center justify-center'>
                        <GrDocumentText />
                        <span className='font-medium cursor-pointer ms-2 hover:underline' onClick={handleEdit}>
                          {candidate?.resumeDetailDTO?.name}
                        </span>
                      </div>
                    ) : (
                      'No resume available'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className=''>
            <InterviewHistory />
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center w-full h-[50px] text-[13px] mt-30 mb-30'>
          <LoadSpinner className='text-2xl ' />
        </div>
      )}
    </div>
  )
}

interface JobInformationCardItemProps {
  icon: React.ReactElement
  name: string
  value: string
}

function JobInformationCardItem({ icon, name, value }: JobInformationCardItemProps) {
  return (
    <div className={classNames(`flex flex-row items-center gap-4`)}>
      <div className={classNames(`w-1/12 mx-2 text-3xl`)}>{icon}</div>
      <div className={classNames(`flex flex-col flex-1`)}>
        <span>{name}</span>
        <span className={classNames(`text-teal-700`)}>{value}</span>
      </div>
    </div>
  )
}
