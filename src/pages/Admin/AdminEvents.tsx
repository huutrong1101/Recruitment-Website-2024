import { ChevronDownIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useEffect, useState, Fragment } from 'react'
import { isEmpty, isUndefined, omitBy } from 'lodash'
import { useAppSelector } from '../../hooks/hooks'
import useQueryParams from '../../hooks/useQueryParams'
import classNames from 'classnames'
import { isEqual } from 'lodash'
import qs from 'query-string'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { AdminJobListConfig } from '../../types/services'
import { JobInterface } from '../../types/job.type'
import { BsFilterLeft } from 'react-icons/bs'
import { Menu, Transition } from '@headlessui/react'
import { Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip } from '@material-tailwind/react'
import { PencilIcon } from '@heroicons/react/24/solid'
import { formatDay } from '../../utils/utils'
import { EventInterface } from '../../types/event.type'

const TABLE_HEAD = ['Name', 'Date Created', 'Deadline', 'Recruiter', 'Actions']

const listRecruiter = ['Nguyen Huu Trong', 'Le Bui Thao Duyen']

export type QueryConfig = {
  [key in keyof AdminJobListConfig]: string
}

const AdminEvents = () => {
  const events: EventInterface[] = useAppSelector((state) => state.Home.events)
  const totalEvents = useAppSelector((state) => state.Home.totalEvents)

  const [currentPage, setCurrentPage] = useState(1)

  const queryParams: QueryConfig = useQueryParams()
  const [isLoading, setIsLoading] = useState(false)

  const [dataSearch, setDataSearch] = useState({
    key: '',
    field: ''
  })

  const queryConfig: QueryConfig = omitBy(
    {
      limit: queryParams.limit || 5,
      page: queryParams.page || '1'
    },
    isUndefined
  )
  const [prevQueryConfig, setPrevQueryConfig] = useState<QueryConfig>(queryConfig)
  const [pageSize, setPageSize] = useState(Math.ceil(totalEvents / Number(queryParams.limit || 5)))
  const [showEventLists, setAdminManagerEventList] = useState(events)

  const fetchEventWithQuery = async (query: string) => {
    return await axiosInstance(`/events?${query}`, {
      headers: { Authorization: null }
    })
  }

  useEffect(() => {
    if (!isEqual(prevQueryConfig, queryConfig)) {
      const fetchJobs = async () => {
        try {
          const query = qs.stringify(queryConfig)
          const response = await fetchEventWithQuery(query)
          setAdminManagerEventList(response.data.result.content)
          setPageSize(response.data.result.totalPages)
        } catch (error) {
          console.log(error)
        }
      }
      fetchJobs()
      setPrevQueryConfig(queryConfig)
    }
  }, [queryConfig, prevQueryConfig])

  useEffect(() => {
    const fetchPosition = async () => {
      setIsLoading(true)
      try {
        if (queryConfig) {
          const query = qs.stringify(queryConfig)
          const response = await fetchEventWithQuery(query)
          setAdminManagerEventList(response.data.result.content)
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

  //
  // Search
  const navigate = useNavigate()

  const handleSearch = async (e: any) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      navigate({
        pathname: '/admin/jobs',
        search: createSearchParams({
          ...queryConfig,
          name: dataSearch.key
        }).toString()
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePagination = (page: number) => {
    setCurrentPage(page)
    const searchParams = {
      ...queryConfig,
      page: page.toString(),
      limit: '5'
    }

    const filteredSearchParams = omitBy(searchParams, isEmpty)

    navigate({
      pathname: '/admin/events',
      search: createSearchParams(filteredSearchParams).toString()
    })
  }

  const handleNext = () => {
    const newPage = currentPage + 1
    setCurrentPage(newPage)
    const searchParams = {
      ...queryConfig,
      page: newPage.toString(),
      limit: '5'
    }

    const filteredSearchParams = omitBy(searchParams, isEmpty)

    navigate({
      pathname: '/admin/events',
      search: createSearchParams(filteredSearchParams).toString()
    })
  }

  const handlePrev = () => {
    const newPage = currentPage - 1
    setCurrentPage(newPage)
    const searchParams = {
      ...queryConfig,
      page: newPage.toString(),
      limit: '5'
    }

    const filteredSearchParams = omitBy(searchParams, isEmpty)

    navigate({
      pathname: '/admin/events',
      search: createSearchParams(filteredSearchParams).toString()
    })
  }

  return (
    <>
      {/* Search */}
      <form onSubmit={handleSearch} className='flex justify-center my-5 item-center'>
        <div
          className={classNames(
            'flex items-center flex-shrink-0 w-1/4 p-2 border rounded-lg mr-5 gap-2',
            'focus-within:border-emerald-700'
          )}
        >
          <BsFilterLeft className={classNames(`w-[20px] ml-4`)} />
          <Menu as='div' className='relative w-full'>
            <Menu.Button className='flex items-center justify-between w-full p-2 border cursor-pointer rounded-xl'>
              <span className='ml-2 text-zinc-400'>{dataSearch.field || 'All'}</span>
              <ChevronDownIcon className='w-5 ml-4' />
              {/* Drop down  */}
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
              <Menu.Items className='absolute left-0 z-10 w-full mt-1 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  {listRecruiter.map((name, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <p
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                          onClick={() =>
                            setDataSearch({
                              ...dataSearch,
                              field: name
                            })
                          }
                        >
                          {name}
                        </p>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <div
          className={classNames(
            'flex items-center flex-shrink-0 w-1/3 p-2 border rounded-lg',
            'focus-within:border-emerald-700'
          )}
        >
          <MagnifyingGlassIcon className={classNames(`w-[20px]`)} />
          <input
            value={dataSearch.key}
            onChange={(e) => setDataSearch({ ...dataSearch, key: e.target.value })}
            type='text'
            placeholder='Search your Keywords'
            className={classNames(
              'w-full h-full text-[12px] ml-3 focus:outline-none text-base text-zinc-400 bg-slate-50'
            )}
          />
        </div>
        {/* Button */}
        <div className={classNames('gap-2 ml-5 w-1/8 items-center justify-center')}>
          <button
            className={classNames(
              'bg-[#05966A] hover:bg-emerald-700 text-white p-3 rounded-md flex w-full text-center items-center justify-center'
            )}
            type='submit'
          >
            Search
          </button>
        </div>
      </form>

      <div className='relative flex-col justify-center bg-white'>
        <Card className='w-full h-full'>
          <CardBody className='px-0 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left table-auto min-w-max'>
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th key={head} className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                        <Typography variant='small' color='blue-gray' className='font-normal leading-none opacity-70'>
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {showEventLists.map((event, index) => {
                    const isLast = index === events.length - 1
                    const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'
                    return (
                      <tr key={event.eventId}>
                        <td className={classes}>
                          <div className='flex items-center gap-3'>
                            <Typography variant='small' color='blue-gray' className='font-bold'>
                              {event.name}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            {formatDay(event.startAt)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            {formatDay(event.deadline)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            Nguyen Huu Trong
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            <button>
                              <Link to={`${event.eventId}`} onClick={() => {}}>
                                <Tooltip content='Read Detail'>
                                  <PencilIcon className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg' />
                                </Tooltip>
                              </Link>
                            </button>
                          </Typography>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
          <CardFooter className='flex items-center justify-between p-4 border-t border-blue-gray-50'>
            <Button variant='outlined' size='sm' onClick={handlePrev}>
              Previous
            </Button>
            <div className='flex items-center gap-2'>
              {Array(pageSize)
                .fill(0)
                .map((_, index) => {
                  const pageNumber = index + 1

                  return (
                    <IconButton
                      variant='outlined'
                      size='sm'
                      className={pageNumber === currentPage ? 'border-cyan-500' : 'border-transparent'}
                      onClick={() => handlePagination(pageNumber)}
                    >
                      {pageNumber}
                    </IconButton>
                  )
                })}
            </div>
            <Button variant='outlined' size='sm' onClick={handleNext}>
              Next
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
export default AdminEvents
