import classNames from 'classnames'
import { isEqual, isUndefined, omitBy } from 'lodash'
import qs from 'query-string'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import blog_image from '../../../images/blog_image.png'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import Pagination from '../../components/Pagination/Pagination'
import { useAppSelector } from '../../hooks/hooks'
import useQueryParams from '../../hooks/useQueryParams'
import axiosInstance from '../../utils/AxiosInstance'
import { EventInterface, EventListConfig } from '../../types/event.type'
import EventCard from '../../components/EventCard/EventCard'
import { AiOutlineBlock } from 'react-icons/ai'

export type QueryConfig = {
  [key in keyof EventListConfig]: string
}

export default function Events() {
  const events: EventInterface[] = useAppSelector((state) => state.Home.events)

  const totalEvents = useAppSelector((state) => state.Home.totalEvents)

  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 6
    },
    isUndefined
  )

  const [showEvents, setShowEvents] = useState(events)

  const [pageSize, setPageSize] = useState(Math.ceil(totalEvents / Number(queryParams.limit || 6)))

  const [isLoading, setIsLoading] = useState(false)

  const [prevQueryConfig, setPrevQueryConfig] = useState<QueryConfig>(queryConfig)

  useEffect(() => {
    const fetchPosition = async () => {
      setIsLoading(true)
      try {
        if (queryConfig) {
          const query = qs.stringify(queryConfig)
          const response = await axiosInstance(`/events?${query}`)
          setShowEvents(response.data.result.content)
          setPageSize(response.data.result.totalPages)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosition()
  }, [])

  useEffect(() => {
    if (!isEqual(prevQueryConfig, queryConfig)) {
      const fetchJobs = async () => {
        setIsLoading(true)
        try {
          const query = qs.stringify(queryConfig)
          const response = await axiosInstance(`/events?${query}`)
          setShowEvents(response.data.result.content)
          setPageSize(response.data.result.totalPages)
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchJobs()
      setPrevQueryConfig(queryConfig)
    }
  }, [queryConfig, prevQueryConfig])

  return (
    <div className={classNames('flex gap-5 mb-12')}>
      {/* List Blog  */}
      <div className={classNames('w-[70%]')}>
        {isLoading ? (
          <div className='flex justify-center items-center my-4 min-h-[50vh]'>
            <LoadSpinner className='text-3xl text-emerald-700' />
          </div>
        ) : (
          <>
            <div className='flex flex-wrap -mx-4'>
              {/* <!-- Card --> */}
              {showEvents.length > 0 ? (
                showEvents.map((event) => (
                  <div key={event.eventId} className='w-full px-4 mb-8 md:w-1/2'>
                    <EventCard event={event} />
                  </div>
                ))
              ) : (
                <div className='flex flex-col justify-center w-full mb-10 min-h-[70vh] items-center text-3xl gap-4'>
                  <span>
                    <AiOutlineBlock />
                  </span>
                  <span>There is no event available.</span>
                </div>
              )}
            </div>
            {/* Pagination  */}
            <Pagination queryConfig={queryConfig} pageSize={pageSize} url='/events' />
          </>
        )}
      </div>

      {/* Most Popular  */}
      <div className={classNames('w-[30%] p-6 bg-white rounded-lg shadow-lg h-fit sticky top-1 border')}>
        <h3
          className={classNames(
            'text-black text-base font-semibold leading-7 tracking-wider capitalize flex items-center justify-center'
          )}
        >
          Most popular
        </h3>
        <div className={classNames('flex flex-col gap-4 mt-2 pt-2 border-t-2')}>
          {events.slice(0, 3).map((event) => {
            return (
              <Link
                to={`/events/${event.eventId}`}
                className={classNames(
                  'flex flex-col w-full bg-gray-50 rounded-lg overflow-hidden cursor-pointer',
                  `border hover:border-emerald-700`
                )}
              >
                <div className={classNames('')}>
                  <img src={event.image.url || blog_image} alt='' className={classNames('object-cover aspect-video')} />
                </div>
                <div className={classNames('px-4 py-2')}>
                  <h3 className='text-xs font-medium text-black capitalize line-clamp-3'>{event.name}</h3>
                  {/* <p className="text-gray-500"></p> */}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
