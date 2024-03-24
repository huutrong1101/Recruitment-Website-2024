import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { data } from '../../data/fetchData'
import EventCard from '../../components/EventCard/EventCard'
import { EventInterface } from '../../types/event.type'
import { useAppSelector } from '../../hooks/hooks'

export default function Events() {
  const events: EventInterface[] = useAppSelector((state) => state.Home.events)

  return (
    <div className='mt-[80px]'>
      <div className={classNames('text-center')}>
        <h3 className={classNames('text-black text-xl md:text-2xl font-medium leading-7 tracking-wider capitalize')}>
          TIN TỨC VÀ SỰ KIỆN
        </h3>
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
        <Link to='/events' className={classNames('bg-orange text-white p-3 rounded-md flex')}>
          Xem thêm
        </Link>
      </div>
    </div>
  )
}
