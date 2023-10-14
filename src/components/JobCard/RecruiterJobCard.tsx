import classnames from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import logo_FPT from '../../../images/logo_FPT.png'
import { JobService } from '../../services/JobService'
import { JOB_POSITION } from '../../utils/Localization'

export default function RecruiterJobCard({ job }: any) {
  const now = moment()
  const created = moment(job.createdAt)
  const duration = moment.duration(now.diff(created))
  const days = duration.asDays()

  const currentDate = moment(new Date()).format('Do MMMM, YYYY') // Get the current date and time
  const targetDate = moment(job.deadline).format('Do MMMM, YYYY') // Replace this with your target date
  const currentDateMoment = moment(currentDate, 'Do MMMM, YYYY')
  const targetDateMoment = moment(targetDate, 'Do MMMM, YYYY')

  const temp = { ...job, isActive: false }
  // Compare dates
  if (currentDateMoment.isBefore(targetDateMoment)) {
    console.log('Current date is before the target date.')
  } else if (currentDateMoment.isSame(targetDateMoment)) {
    console.log('Current date is the same as the target date.')
  } else {
    JobService.editJob(temp, job?.jobId)
  }
  const handleActive = (data: boolean) => {
    var temp = ''
    if (data === true) {
      temp = 'On Going'
    } else {
      temp = 'Expired'
    }
    return temp
  }

  return (
    <>
      <div
        className={`relative w-full overflow-hidden transition-all duration-500 bg-white border rounded-md shadow group hover:shadow-lg h-fit `}
      >
        <div className='p-6'>
          <div className='flex items-center'>
            <div className='w-14 h-14 min-w-[56px] flex items-center justify-center bg-white shadow  rounded-md'>
              <img className='w-12 my-3 h-110' src={logo_FPT} />
            </div>

            <div className={classnames('ml-4 items-center leading-7 tracking-wider')}>
              <h1 className={classnames('text-black text-lg font-semibold ')}>
                {job.name}
                <span className='ml-5 text-sm font-semibold text-gray-400 '>
                  {days >= 1 ? `${Math.floor(days)} days` : `${Math.abs(duration.asHours()).toFixed(0)} hours`} ago
                </span>
              </h1>
              <button
                className={classnames(
                  'text-[#05966A] text-center text-xs font-semibold bg-[#C6DED5] p-1 rounded-full px-2 hover:bg-[#05966A] hover:text-white'
                )}
              >
                {JOB_POSITION[job.jobType]}
              </button>
              <span className='ml-3 text-sm font-semibold text-gray-400 '>Salary: {job.salaryRange}</span>
              <span
                className={`ml-3 text-sm font-semibold ${job?.isActive === true ? 'text-green-700' : 'text-red-600'} `}
              >
                {handleActive(job?.isActive)}
              </span>
            </div>
          </div>
          <div className={classnames('flex items-start mt-4 overflow-hidden')}>
            <div className='w-[70%] text-black inline-flex text-center text-sm font-semibold leading-7 tracking-wider capitalize overflow-hidden'>
              Decription:
              <p className='ml-1 overflow-hidden font-normal text-gray-400 whitespace-nowrap overflow-ellipsis'>
                {job.description}
              </p>
            </div>
          </div>
          {job.skills.map((skill: any) => (
            <span
              className={classnames(
                'bg-gray-300 hover:bg-gray-400  inline-block text-slate-900 text-xs px-2.5 py-0.5 font-semibold rounded-full me-1'
              )}
              key={skill}
            >
              {skill}
            </span>
          ))}
          <div></div>
        </div>
        <div className='items-center justify-between px-6 py-3 bg-gray-200 lg:flex'>
          <div className='flex justify-between lg:inline-block'></div>
          <ul className='flex flex-wrap items-center mt-3 text-sm font-semibold text-gray-500 sm:mt-0'>
            <li>
              <Link
                to={`../jobdetail/${job.jobId}/edit`}
                className='w-full px-5 py-2 mt-4 text-white btn btn-sm rounded-2xl bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 md:ms-2 lg:w-auto lg:mt-0 '
              >
                Edit
              </Link>
            </li>
            {/* <li>
                     <Link
                        to="../interview-schedule/"
                        className="w-full px-2 py-2 mt-4 text-white rounded-2xl bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 md:ms-4 lg:w-auto lg:mt-0"
                     >
                        Create Schedule
                     </Link>
                  </li> */}
          </ul>
        </div>
        <a className='absolute top-0 m-3 rounded-full btn btn-icon bg-emerald-600/5 hover:bg-emerald-600 border-emerald-600/10 hover:border-emerald-600 text-emerald-600 hover:text-white end-0'></a>
      </div>
    </>
  )
}
