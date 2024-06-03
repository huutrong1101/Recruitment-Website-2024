import classNames from 'classnames'
import JobInformationCard from '../JobInformationCard'
import { AdminJobInterface, JobInterface } from '../../../types/job.type'
import parse from 'html-react-parser'

interface JobProps {
  job: JobInterface
  jobInformation: { icon: JSX.Element; name: string; value: string }[]
}

function JobDetailWidget({ job, jobInformation }: JobProps) {
  return (
    <div className={classNames(`flex flex-col md:flex-row gap-12`)}>
      {/* Left side description */}
      <div className={classNames(`w-full md:w-8/12`, `flex flex-col gap-6`)}>
        {/* Details */}
        <div
          className={classNames(
            `border bg-white shadow-sm rounded-xl flex flex-col gap-8`,
            `px-8 py-8`,
            `text-justify`
          )}
        >
          <div>
            <h1 className='text-2xl font-semibold capitalize'>Chi tiết công việc</h1>
            <p className='mt-2 whitespace-pre-line'>{parse(job?.description)}</p>
          </div>
          <div>
            <h1 className='text-2xl font-semibold capitalize'>Yêu cầu công việc</h1>
            <p className='mt-2 whitespace-pre-line'>{parse(job?.requirement)}</p>
          </div>
          <div>
            <h1 className='text-2xl font-semibold capitalize'>Quyền lợi</h1>
            <p className='mt-2 whitespace-pre-line'>{parse(job?.benefit)}</p>
          </div>
        </div>
      </div>

      {/* Right side description */}
      <div className={classNames(`w-full md:w-3/12 flex-1 relative`)}>
        <JobInformationCard cardData={jobInformation} jobId={job._id} />
      </div>
    </div>
  )
}

export default JobDetailWidget
