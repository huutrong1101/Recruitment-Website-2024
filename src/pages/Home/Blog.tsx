import React from 'react'
import { EventInterface } from '../../types/event.type'
import { useAppSelector } from '../../hooks/hooks'
import classNames from 'classnames'
import EventCard from '../../components/EventCard/EventCard'
import { Link } from 'react-router-dom'

function Blog() {
  const events: EventInterface[] = useAppSelector((state) => state.Home.events)

  return (
    <div className='mt-[80px]'>
      <div className={classNames('text-center')}>
        <h3 className={classNames('tracking-wider text-2xl font-bold text-center')}>TIN TỨC VÀ SỰ KIỆN</h3>
      </div>

      <div className='flex flex-wrap -mx-4 mt-[20px]'>
        {/* <!-- Card --> */}
        {events &&
          events.slice(0, 6).map((event, index) => (
            <div key={event.eventId} className='w-full px-4 mb-8 sm:w-1/2 lg:w-1/3'>
              <EventCard event={event} />
            </div>
          ))}
      </div>

      <div className={classNames('flex items-center justify-center')}>
        <Link to='/events' className={classNames('bg-emerald-500 text-white p-3 rounded-md flex')}>
          Xem thêm
        </Link>
      </div>
    </div>
  )
}

export default Blog
