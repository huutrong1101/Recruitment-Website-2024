import classNames from 'classnames'
import he from 'he'
import moment from 'moment'
import { useEffect } from 'react'
import { HiCalendarDays } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import blog_image from '../../../images/blog_image.png'

export default function RecruiterEventCard({ event }: any) {
  useEffect(() => {
    console.log(event)
  }, [event])
  return (
    <Link to={`/recruiter/events/${event.eventId}`}>
      <div className='flex flex-col bg-white border rounded-lg shadow-lg cursor-pointer rounded-t-xl hover:border-emerald-700'>
        {/* Header thumbnail */}
        <div className='flex justify-center w-full'>
          <img src={event.img || blog_image} className='object-center shadow-sm aspect-video rounded-t-xl' />
        </div>

        <div className='flex flex-col gap-3 px-6 py-4'>
          {/* Times and dates */}
          <div className='grid grid-rows-none gap-2 text-xs text-gray-500 md:grid-rows-3 md:grid-cols-0'>
            <div className='flex items-center gap-1'>
              <HiCalendarDays />
              <p>{moment(event.startAt).format('DD/MM/YY')}</p>
            </div>
            <div className='flex items-center gap-1'>
              {/* <HiClock /> */}
              <p>{moment(event.time, 'HH:mm:ss').format('HH:mm')}</p>
            </div>
            <div className='text-xs opacity-60'>
              {moment().isAfter(event.deadline) ? (
                <span className={classNames(`bg-red-700 text-red-100 px-2 py-1 rounded-md`)}>Finished</span>
              ) : moment().isSame(event.deadline, 'day') ? (
                <span className={classNames(`bg-yellow-700 text-yellow-100 px-2 py-1 rounded-md`)}>Ending</span>
              ) : (
                <span className={classNames(`text-emerald-100 bg-emerald-800 px-2 py-1 rounded-md`)}>Progress</span>
              )}
            </div>
          </div>

          {/* Title */}
          <div className='text-base'>
            <h1 className='font-semibold break-words line-clamp-2'>
              {/* {event.title.length > 25
              ? event.title.substring(0, 15) + "  ..."
              : event.title} */}
              {he.decode(event.title)}
            </h1>
          </div>

          <div className={classNames(`line-clamp-2 text-sm text-gray-500 text-justify leading-4`)}>
            {he.decode(event.description)}
          </div>
        </div>
      </div>
    </Link>
  )
}
