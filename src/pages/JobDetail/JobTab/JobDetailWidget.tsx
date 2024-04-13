import classNames from 'classnames'
import React from 'react'
import JobInformationCard from '../JobInformationCard'
import { JobInterface } from '../../../types/job.type'

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
            <p className='mt-2 whitespace-pre-line'>{job?.description}</p>
          </div>
          <div>
            <h1 className='text-2xl font-semibold capitalize'>Yêu cầu công việc</h1>
            <p className='mt-2 whitespace-pre-line'>{job?.requirement}</p>
          </div>
          <div>
            <h1 className='text-2xl font-semibold capitalize'>Quyền lợi</h1>
            <p className='mt-2 whitespace-pre-line'>{job?.benefit}</p>
          </div>
          <div>
            <h1 className='text-2xl font-semibold capitalize'>Kĩ năng yêu cầu</h1>
            <div className='flex flex-wrap px-2 py-4'>
              {job?.skills.map((item, index) => (
                <div key={index}>
                  <span key={index} className='rounded-lg bg-[#78AF9A] bg-opacity-40 p-2 mx-2 my-1 text-[#218F6E]'>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side description */}
      <div className={classNames(`w-full md:w-3/12 flex-1 relative`)}>
        <JobInformationCard cardData={jobInformation} jobId={job.jobId} />
      </div>
    </div>
  )
}

export default JobDetailWidget
