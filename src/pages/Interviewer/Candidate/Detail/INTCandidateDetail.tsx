import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks'

// Component & Icon
import { AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

// Function from Slice
import { fetchINTCandidatesByID } from '../../../../redux/reducer/INTCandidatesSlice'

// Status
import LoadSpinner from '../../../../components/LoadSpinner/LoadSpinner'
import { STATUS } from '../../../../utils/contanst'
import moment from 'moment'
import NOT_AVATAR from '../../../../../images/not_avatar.jpg'

export const formatDDMMYY = (date: any) => {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())
  return `${day}-${month}-${year}`
}

const INTCandidateDetail = () => {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { INTSingleCandidate, INTSingleCandidateStatus, INTCandidates } = useAppSelector(
    (state: any) => state.INTCandidates
  )

  useEffect(() => {
    dispatch(fetchINTCandidatesByID(id))
  }, [])

  console.log(INTSingleCandidate)

  if (INTSingleCandidateStatus === STATUS.LOADING) {
    return (
      <div className='flex justify-center'>
        <LoadSpinner className='w-8 h-8 mt-8' />
      </div>
    )
  } else if (INTSingleCandidateStatus === STATUS.IDLE) {
    return (
      <div className='INTCandidateDetail'>
        <div className='px-6 py-6 mt-8 border-2 shadow-xl rounded-xl'>
          <div className='mb-4 text-2xl font-semibold '>Profile Candidate</div>
          <div className='flex'>
            <div className='w-5/12'>
              <div className='flex items-center pl-[1.5rem]'>
                {!INTSingleCandidate?.avatar || INTSingleCandidate?.avatar === null ? (
                  <img src={NOT_AVATAR} className=' w-[180px] h-[180px] border-4 ' />
                ) : (
                  <img src={INTSingleCandidate?.avatar} className=' w-[180px] h-[180px] border-4 ' />
                )}
              </div>
            </div>
            <div className='w-7/12'>
              <div className='flex'>
                <div className='mr-4 text-xl'>{INTSingleCandidate?.name}</div>
              </div>
              <div className='mt-5 text-sm text-gray-400 '>Contacts</div>
              <div className='ml-4'>
                <div className='mt-2 text-base'>
                  Phone: <span className='ml-2 text-sm'>{INTSingleCandidate?.phone}</span>
                </div>
                <div className='text-base'>
                  Address: <span className='ml-2 text-sm'>{INTSingleCandidate?.address}</span>
                </div>
                <div className='text-base'>
                  Birtday: <span className='ml-2 text-sm'>{formatDDMMYY(INTSingleCandidate?.dateOfBirth)}</span>
                </div>
                <div className='text-base'>
                  Email: <span className='ml-2 text-sm'>{INTSingleCandidate?.email}</span>
                </div>
              </div>
            </div>
          </div>
          <hr className='my-[2rem] ' />
          <div className='flex'>
            <div className='w-5/12 pl-[2rem]'>
              <div className='text-gray-400'>Educations</div>
              {INTSingleCandidate?.information &&
                INTSingleCandidate?.information?.education?.map((item: any) => (
                  <div className='ml-4'>
                    <div className='flex items-center mt-2 text-sm'>
                      <AcademicCapIcon className='w-[15px] h-[15px] mt-[3px] mr-1' />
                      {item.school}
                    </div>
                    <div className='text-gray-500 text-xs flex ml-[19px]'>
                      {item.major} - {item.graduatedYear}
                    </div>
                  </div>
                ))}
              <div className='mt-3 mb-2 text-gray-400'>Experiences</div>
              {INTSingleCandidate?.information &&
                INTSingleCandidate?.information?.experience?.map((item: any) => (
                  <div className='ml-4'>
                    <div className='flex mt-2 text-sm'>
                      <BriefcaseIcon className='w-[15px] h-[15px] mt-[3px] mr-1' />
                      {item.companyName}
                    </div>
                    <div className='text-gray-500 text-xs flex ml-[19px]'>{item.position}</div>
                    <div className='text-gray-500 text-xs flex ml-[19px]'>
                      {moment(item.dateFrom).format('DD/MM/YYYY')} - {moment(item.dateTo).format('DD/MM/YYYY')};
                    </div>
                  </div>
                ))}

              <div className='mt-3 mb-2 text-gray-400'>Skills</div>
              <div className='flex'>
                {INTSingleCandidate?.information?.skills?.map((item: any) => (
                  <div className='px-2 py-1 mr-2 text-sm text-white bg-green-600 hover:bg-green-800 rounded-xl'>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
            <div className='w-7/12'>
              <div className='mt-2 text-gray-400'>Description</div>
              <div className='mt-2 ml-4'>
                <p>{INTSingleCandidate?.about}</p>
              </div>
              <div className='mt-2 text-gray-400'>Projects</div>
              {INTSingleCandidate?.information &&
                INTSingleCandidate?.information?.project?.map((item: any) => (
                  <div className='ml-4'>
                    <div className='flex mt-2 text-sm'>
                      <BriefcaseIcon className='w-[15px] h-[15px] mt-[3px] mr-1' />
                      {item.name}
                    </div>
                    <div className='text-gray-500 text-xs flex ml-[19px]'>{item.description}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  } else if (INTSingleCandidateStatus === STATUS.ERROR500) {
    // return <Error errorCode={STATUS.ERROR500} />
  } else if (INTSingleCandidateStatus === STATUS.ERROR404) {
    // return <Error errorCode={STATUS.ERROR404} />
  }
}

export default INTCandidateDetail
