import React from 'react'
import { Link } from 'react-router-dom'

interface CandidateCardProps {
  jobid: string
  candidate: {
    _id: string
    status: string
    name: string
    avatar: string
    educationLevel: string
    experience: string
    updatedAt: string
  }
}

interface StatusClasses {
  [key: string]: string
}

function CandidateCard({ candidate, jobid }: CandidateCardProps) {
  const statusClasses: StatusClasses = {
    'Đã nhận': 'bg-emerald-500 text-white',
    'Không nhận': 'bg-red-500 text-white',
    'Đã nộp': 'bg-gray-500 text-white'
  }

  const candidateStatusClass = statusClasses[candidate.status] || 'bg-gray-300 text-emerald-700'

  return (
    <Link
      to={`/recruiter/profile/jobsPosted/listCandidate/${jobid}/candidateDetail/${candidate._id}`}
      className='flex items-start justify-start p-4 border rounded-xl'
    >
      <div className='flex w-3/4 gap-3'>
        <div className='w-1/4'>
          <img className='object-cover w-full h-full' src={candidate.avatar} alt='' />
        </div>
        <div className='flex flex-col w-3/4 gap-2'>
          <p className='text-base font-medium text-black md:text-sm'>
            <span className='font-bold'>{candidate.name}</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Học vấn:</span>{' '}
            <span className='hover:text-emerald-500'>{candidate.educationLevel}</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Ngành:</span>{' '}
            <span className='hover:text-emerald-500'>{candidate.educationLevel}</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Loại hình công việc:</span>{' '}
            <span className='hover:text-emerald-500'>{candidate.educationLevel}</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Kinh nghiệm làm việc:</span>{' '}
            <span className='hover:text-emerald-500'>{candidate.experience}</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Cập nhật lần cuối:</span>{' '}
            <span className='hover:text-emerald-500'>{candidate.updatedAt}</span>
          </p>
        </div>
      </div>
      <div className='flex justify-end w-1/4'>
        <div className={`block w-1/2 p-3 text-center border rounded-xl ${candidateStatusClass}`}>
          {candidate.status}
        </div>
      </div>
    </Link>
  )
}

export default CandidateCard
