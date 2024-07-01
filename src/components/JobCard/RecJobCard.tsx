import { CurrencyDollarIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import React from 'react'
import { HiHeart } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import { JobInterface } from '../../types/job.type'

interface RecJobCardProps {
  job: JobInterface
}

function RecJobCard({ job }: RecJobCardProps) {
  const calculateDaysLeft = (deadline: string) => {
    // Chuyển đổi định dạng DD/MM/YYYY sang YYYY-MM-DD
    const parts = deadline.split('/')
    const convertedDeadline = `${parts[2]}-${parts[1]}-${parts[0]}`

    const deadlineDate = new Date(convertedDeadline)
    const currentDate = new Date()
    const timeDiff = deadlineDate.getTime() - currentDate.getTime()
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24))
    return daysLeft
  }

  // Sử dụng giả sử deadline có dạng DD/MM/YYYY
  const daysLeft = calculateDaysLeft(job.deadline)

  return (
    <Link
      to={`/jobs/${job._id}`}
      className={classNames(
        `px-4 py-2 bg-white rounded-lg shadow-sm border hover:border-emerald-500`,
        `ease-in-out duration-75 hover:shadow-md`,
        `flex flex-col md:flex-col`,
        `transition-all ease-in-out duration-75`,
        `cursor-pointer`
      )}
    >
      <div className='flex items-center gap-5'>
        <div className='w-1/6'>
          <img className='object-cover w-[120px] h-[120px]' src={job.companyLogo} alt={`${job.companyName} logo`} />
        </div>

        <div className='flex flex-col w-5/6 gap-4'>
          <div className='flex justify-between'>
            <div className='flex flex-col gap-2'>
              <h3 className='text-lg font-semibold leading-6 text-black hover:text-emerald-500'>{job.name}</h3>

              <p className='text-base font-normal leading-5 text-gray-700 truncate'>{job.companyName}</p>
            </div>
            <div className='flex gap-1 text-emerald-500'>
              <CurrencyDollarIcon className='w-6 h-6' />
              <p>Thỏa thuận</p>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <button className='inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md'>
                {job.province}
              </button>
              <button className='inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md'>
                Còn {daysLeft} ngày để ứng tuyển
              </button>
            </div>
            <div className='flex items-center gap-3'>
              <button className='px-2 py-1 text-sm text-white rounded-md bg-emerald-500'>Ởng tuyển</button>
              <HiHeart className='w-6 h-6 text-emerald-500' />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RecJobCard
