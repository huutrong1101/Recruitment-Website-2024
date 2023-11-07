import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { isEqual, isUndefined, omitBy } from 'lodash'
import qs from 'query-string'
import { useEffect, useState, Fragment } from 'react'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import LoadSpinner from '../../../components/LoadSpinner/LoadSpinner'
import Pagination from '../../../components/Pagination/Pagination'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'
import { useAppSelector } from '../../../hooks/hooks'
import useQueryParams from '../../../hooks/useQueryParams'
import axiosInstance from '../../../utils/AxiosInstance'
import { EventInterface, EventListConfig } from '../../../types/event.type'
import RecruiterEventCard from '../../../components/EventCard/RecruiterEventCard'
import { BsFilterLeft } from 'react-icons/bs'
import { Menu, Transition } from '@headlessui/react'

export type QueryConfig = {
  [key in keyof EventListConfig]: string
}

export default function ReccerEventManagement() {
  const events: EventInterface[] = useAppSelector((state) => state.Home.events)

  const totalEvents = useAppSelector((state) => state.Home.totalEvents)

  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 8,
      state: queryParams.state || true,
      name: queryParams.name || ''
    },
    isUndefined
  )

  const [showEvents, setShowEvents] = useState(events)

  const [pageSize, setPageSize] = useState(Math.ceil(totalEvents / Number(queryParams.limit || 8)))

  const [isLoading, setIsLoading] = useState(false)

  const [prevQueryConfig, setPrevQueryConfig] = useState<QueryConfig>(queryConfig)

  const [showDuration, setShowDuration] = useState(false)

  const [duration, setDuration] = useState('')

  const Duration = {
    listTypeJobs: ['On Going', 'Expired']
  }

  const fetchEventWithQuery = async (query: string) => {
    return await axiosInstance(`/events?${query}`, {
      headers: { Authorization: null }
    })
  }

  useEffect(() => {
    const fetchPosition = async () => {
      setIsLoading(true)
      try {
        if (queryConfig) {
          const query = qs.stringify(queryConfig)
          const response = await fetchEventWithQuery(query)
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
          const response = await fetchEventWithQuery(query)
          setShowEvents(response.data.result.content)
          setPageSize(response.data.result.totalPages)
          console.log(response.data.result.content)
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

  // Search
  const navigate = useNavigate()
  const [dataSearch, setDataSearch] = useState({
    key: ''
  })

  const handleonClick = (data: any) => {
    const newData = data === 'Expired' ? false : true
    setDuration(data)
    setShowDuration(false)

    setDataSearch({
      ...dataSearch
      // active: newData.toString()
    })
  }

  const handleSearch = async (e: any) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      navigate({
        pathname: '/recruiter/events',
        search: createSearchParams({
          ...queryConfig,
          index: '1',
          name: dataSearch.key
        }).toString()
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div>
        <div className={classNames('flex justify-center mt-4 item-center gap-5')}>
          {/* <form onSubmit={(e) => handleSearch(e)} className={classNames(`flex flex-row gap-2 items-center`)}>
            <div
              className={classNames(
                'flex justify-center items-center w-full border rounded-xl',
                'focus-within:border-emerald-400 w-full'
              )}
            >
              <div className='flex items-center p-3 rounded-xl'>
                <MagnifyingGlassIcon className='w-5 h-5 mx-2 mr-4' />
                <input
                  type='text'
                  placeholder='Search for events'
                  className='w-full h-full text-base bg-transparent text-zinc-400 focus:outline-none'
                  value={dataSearch.key}
                  onChange={(e) => setDataSearch({ ...dataSearch, key: e.target.value })}
                />
              </div>
            </div>

            <div>
              <PrimaryButton type='submit' text={`Search`} className={`w-4`} />
            </div>
          </form> */}
          <div
            className={classNames(
              'flex items-center flex-shrink-0 w-[54.5%] h-1/2 p-2 mt-1 border rounded-lg',
              'focus-within:border-emerald-700'
            )}
          >
            <div className={classNames('flex items-center w-full mr-5 gap-4 md:w-[50%] border-r-2')}>
              <BsFilterLeft className={classNames(`w-[20px]  md:ml-4`)} />
              <Menu as='div' className={classNames('relative w-full')}>
                <Menu.Button className={classNames('w-full')}>
                  <div
                    className={classNames('text-[13px] cursor-pointer flex items-center justify-between')}
                    onClick={() => setShowDuration(!showDuration)}
                  >
                    {duration === '' ? 'DURATION' : duration}

                    {showDuration && <ChevronUpIcon className={classNames('w-[20px] mr-5')} />}
                    {!showDuration && <ChevronDownIcon className={classNames('w-[20px] mr-4')} />}
                  </div>
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute md:left-[-18px] w-full z-10 md:w-55 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='py-1'>
                      {Duration.listTypeJobs.map((data, index) => (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <div>
                              <p
                                className={classNames(
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                  'block px-4 py-2 text-sm'
                                )}
                                onClick={() => handleonClick(data)}
                              >
                                {data}
                              </p>
                            </div>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            <MagnifyingGlassIcon className={classNames(`w-[20px]`)} />
            <input
              value={dataSearch.key}
              onChange={(e) => setDataSearch({ ...dataSearch, key: e.target.value })}
              type='text'
              placeholder='Search your Keywords'
              className={classNames(
                'w-[85%] h-full text-[12px] ml-3 focus:outline-none text-base text-zinc-400 bg-transparent'
              )}
            />
          </div>

          <div className={classNames('flex items-center flex-shrink-0 gap-2')}>
            <PrimaryButton text='Search' className='bg-[#05966A] hover:bg-emerald-700' />

            <PrimaryButton text='Reset' className='bg-red-600 hover:bg-red-700' />
          </div>
        </div>

        {/* Content */}
        <div>
          {isLoading ? (
            <div className='flex justify-center my-4 min-h-[70vh] flex-col items-center'>
              <LoadSpinner className='text-3xl ' />
            </div>
          ) : (
            <div className='sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 grid mt-[50px] '>
              {/* <!-- Card --> */}
              {showEvents && showEvents.length > 0 ? (
                showEvents.map((event) => <RecruiterEventCard event={event} key={event.eventId} />)
              ) : (
                <div className='flex justify-center w-full mb-10'>
                  <span>No results were found. Please check again</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='flex flex-col mt-6'>
          {/* Pagination  */}
          <Pagination queryConfig={queryConfig} pageSize={pageSize} url='/recruiter/events' />
        </div>
      </div>
      {/* Add Event */}
      <div className='absolute right-0 p-4 text-white bottom-4'>
        <div className='sm:w-[100px] h-[50px] relative'>
          <Link to='../addevent'>
            <button className='relative w-[50%] h-full text-3xl font-w bg-[#05966A] hover:bg-emerald-700 text-white rounded-full transition-all duration-300 hover:w-[100%] group'>
              <span className='absolute text-sm transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2 opacity-0 left-1/2 top-1/2 group-hover:opacity-100'>
                Add Event
              </span>
              <span className='absolute transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2 opacity-100 left-1/2 top-1/2 group-hover:opacity-0'>
                +
              </span>
            </button>{' '}
          </Link>
        </div>
      </div>
    </>
  )
}
