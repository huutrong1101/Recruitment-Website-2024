import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { Button, Tooltip } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

interface CandidateCardProps {
  jobid: string
  candidate: {
    avatar: string
    educationLevel: string
    email: string
    experience: string
    goal: string
    major: string
    name: string
    phone: string
    status: string
    updatedAt: string
    _id: string
  }
}

interface StatusClasses {
  [key: string]: string
}

function SuggestCandidateCard({ candidate, jobid }: CandidateCardProps) {
  const statusClasses: StatusClasses = {
    'Đã nhận': 'text-emerald-500',
    'Không nhận': 'text-red-500',
    'Đã nộp': 'text-gray-500'
  }

  const candidateStatusClass = statusClasses[candidate.status] || 'bg-gray-300 text-emerald-700'

  return (
    <div
      // to={``}
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
            <span className='font-bold'>Ngành:</span> <span className='hover:text-emerald-500'>{candidate.major}</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Loại hình công việc:</span>{' '}
            <span className='hover:text-emerald-500'>{candidate.major}</span>
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
        <Tooltip placement='topRight' title='Xem chi tiết'>
          <Link to={`/recruiter/profile/jobsPosted/suggestCandidate/${jobid}/candidateDetail/${candidate._id}`}>
            <Button type='primary'>
              <PencilSquareIcon className='w-4 h-4' />
            </Button>
          </Link>
        </Tooltip>
      </div>
    </div>
  )
}

export default SuggestCandidateCard
