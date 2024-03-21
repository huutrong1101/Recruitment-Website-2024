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
          Lastest Blog or News
        </h3>
        <p className={classNames('text-gray-400 text-center text-sm md:text-lg font-medium capitalize')}>
          Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over
          30000+ companies worldwide.
        </p>
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
        <Link to='/events' className={classNames('bg-emerald-700 text-white p-3 rounded-md flex')}>
          See More News
        </Link>
      </div>
    </div>
  )
}
