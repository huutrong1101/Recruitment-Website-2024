import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { data } from '../../data/fetchData'
import JobCard from '../../components/JobCard/JobCard'
import { JobInterface } from '../../types/product.type'
import { useAppSelector } from '../../hooks/hooks'

export default function Jobs() {
  const jobs: JobInterface[] = useAppSelector((state) => state.Job.jobs)

  return (
    <div className='mt-[40px] md:mt-[80px]'>
      <div className={classNames('text-center')}>
        <h3 className={classNames('text-black text-xl md:text-2xl font-medium leading-7 tracking-wider capitalize')}>
          Popular Jobs
        </h3>
        <p className={classNames('text-gray-400 text-center text-sm md:text-lg font-medium capitalize')}>
          Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over
          30000+ companies worldwide.
        </p>
      </div>

      <div className='flex flex-wrap -mx-4 mt-[20px]'>
        {/* <!-- Card --> */}
        {jobs &&
          jobs.slice(0, 6).map((job) => (
            <div key={job.jobId} className='w-full px-4 mb-8 sm:w-1/2 lg:w-1/3'>
              <JobCard job={job} />
            </div>
          ))}
      </div>

      <div className={classNames('flex items-center justify-center')}>
        <Link to='/jobs' className={classNames('bg-emerald-700 text-white p-3 rounded-md flex')}>
          See more jobs
        </Link>
      </div>
    </div>
  )
}
