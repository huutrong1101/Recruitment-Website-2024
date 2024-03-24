import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { data } from '../../data/fetchData'
import JobCard from '../../components/JobCard/JobCard'
import { JobInterface } from '../../types/job.type'
import { useAppSelector } from '../../hooks/hooks'

export default function Jobs() {
  const jobs: JobInterface[] = useAppSelector((state) => state.Job.jobs)

  return (
    <div className='mt-[40px] md:mt-[80px]'>
      <div className={classNames('text-center')}>
        <h3 className={classNames('text-black text-xl md:text-2xl font-medium leading-7 tracking-wider capitalize')}>
          TIN TUYỂN DỤNG MỚI
        </h3>
      </div>

      <div className='flex flex-wrap -mx-4 mt-[10px]'>
        {/* <!-- Card --> */}
        {jobs &&
          jobs.slice(0, 6).map((job) => (
            <div key={job.jobId} className='w-full px-3 mb-6 sm:w-1/2 lg:w-1/3'>
              <JobCard job={job} />
            </div>
          ))}
      </div>

      <div className={classNames('flex items-center justify-center')}>
        <Link to='/jobs' className={classNames('bg-orange text-white p-3 rounded-md flex')}>
          Xem thêm
        </Link>
      </div>
    </div>
  )
}
