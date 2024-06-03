import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../hooks/hooks'
import { JobInterface } from '../../types/job.type'
import JobCard from '../../components/JobCard/JobCard'

export default function LatestJob() {
  const jobs: JobInterface[] = useAppSelector((state) => state.Job.jobs)

  return (
    <div className='mt-[40px] md:mt-[80px]'>
      <div className={classNames('text-center')}>
        <h3 className={classNames('tracking-wider text-2xl font-bold text-center')}>VIỆC LÀM MỚI NHẤT</h3>
      </div>

      <div className='flex flex-wrap -mx-4 mt-[10px]'>
        {/* <!-- Card --> */}
        {jobs &&
          jobs.slice(0, 6).map((job) => (
            <div key={job._id} className='w-full px-3 mb-6 sm:w-1/2 lg:w-1/3'>
              <JobCard job={job} isShow={false} />
            </div>
          ))}
      </div>

      <div className={classNames('flex items-center justify-center')}>
        <Link to='/jobs' className={classNames('bg-emerald-500 text-white p-3 rounded-md flex')}>
          Xem thêm
        </Link>
      </div>
    </div>
  )
}
