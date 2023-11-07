import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { isEmpty, isEqual, isUndefined, omit, omitBy } from 'lodash'
import qs from 'query-string'
import { Fragment, useEffect, useState } from 'react'
import { BsFilterLeft } from 'react-icons/bs'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import LoadSpinner from '../../../components/LoadSpinner/LoadSpinner'
import Pagination from '../../../components/Pagination/Pagination'
import { useAppSelector } from '../../../hooks/hooks'
import axiosInstance from '../../../utils/AxiosInstance'
import { JOB_POSITION } from '../../../utils/Localization'
import { JobInterface, JobListConfig } from '../../../types/job.type'
import useQueryParams from '../../../hooks/useQueryParams'
import RecruiterJobCard from '../../../components/JobCard/RecruiterJobCard'

export type QueryConfig = {
  [key in keyof JobListConfig]: string
}

const ReccerJobManagement = () => {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 5,
      name: queryParams.name,
      type: queryParams.type,
      active: queryParams.active
    },
    isUndefined
  )

  const [prevQueryConfig, setPrevQueryConfig] = useState<QueryConfig>(queryConfig)

  const jobs: JobInterface[] = useAppSelector((state) => state.RecJobList.recjobsList)

  const totalJobs = useAppSelector((state) => state.RecJobList.recjobTotal)

  const [showType, setShowType] = useState(false)

  const listType = useAppSelector((state) => state.Job.type)

  const [pageSize, setPageSize] = useState(Math.ceil(totalJobs / Number(queryParams.limit ?? 10)))

  const [isLoading, setIsLoading] = useState(false)

  const [showJobs, setShowJobs] = useState(jobs)

  const [showDuration, setShowDuration] = useState(false)

  const [duration, setDuration] = useState('')

  const Duration = {
    listTypeJobs: ['On Going', 'Expired']
  }

  const [dataSearch, setDataSearch] = useState({
    key: '',
    type: '',
    active: ''
  })

  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosition = async () => {
      setIsLoading(true)
      try {
        if (queryConfig) {
          const query = qs.stringify(queryConfig)
          const response = await fetchJobWithQuery(query)
          setShowJobs(response.data.result.content)
          setPageSize(response.data.result.totalPages)
        }
        setDataSearch({
          ...dataSearch,
          key: queryConfig.name || '',
          type: queryConfig.type || '',
          active: queryConfig.active || ''
        })
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
          const response = await fetchJobWithQuery(query)

          // console.log(response.data.result.content)
          setShowJobs(response.data.result.content)
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
  // console.log(showJobs[0].isActive)
  const handleSearch = async () => {
    try {
      setIsLoading(true)

      const searchParams = {
        ...queryConfig,
        name: dataSearch.key,
        type: dataSearch.type,
        active: dataSearch.active,
        page: '1'
      }

      const filteredSearchParams = omitBy(searchParams, isEmpty)

      navigate({
        pathname: '../jobs',
        search: createSearchParams(filteredSearchParams).toString()
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchJobWithQuery = async (query: string) => {
    return await axiosInstance(`recruiter/jobs?${query}`)
  }

  const handleonClick = (data: any) => {
    const newData = data === 'Expired' ? false : true
    setDuration(data)
    setShowDuration(false)

    setDataSearch({
      ...dataSearch,
      active: newData.toString()
    })
  }

  const handleReset = () => {
    setDataSearch({
      key: '',
      type: '',
      active: ''
    })

    setDuration('')

    navigate({
      pathname: '../jobs',
      search: createSearchParams(omit(queryConfig, ['name', 'active', 'type', 'page', 'limit'])).toString()
    })
  }

  return (
    <>
      <div className='flex justify-center mt-4 item-center'>
        <div
          className={classNames(
            'flex items-center flex-shrink-0 w-[54.5%] h-1/2 p-2 mt-1 border rounded-lg ',
            'focus-within:border-emerald-700'
          )}
        >
          <div className={classNames('flex items-center w-full gap-4 md:w-[56%] border-r-2')}>
            <BsFilterLeft className={classNames(`w-[20px]  md:ml-4`)} />
            <Menu as='div' className={classNames('relative w-full')}>
              <Menu.Button className={classNames('w-full')}>
                <div
                  className={classNames('text-[13px] cursor-pointer flex items-center justify-between')}
                  onClick={() => setShowType(!showType)}
                >
                  {JOB_POSITION[dataSearch.type] || 'TYPE OF JOB'}
                  {showType && <ChevronUpIcon className={classNames('w-[20px] mr-4')} />}
                  {!showType && <ChevronDownIcon className={classNames('w-[20px] mr-4')} />}
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
                <Menu.Items className='absolute left-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  <div className='py-1'>
                    {listType.map((type, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <p
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                            onClick={() => {
                              setShowType(false)
                              setDataSearch({
                                ...dataSearch,
                                type: type
                              })
                            }}
                          >
                            {JOB_POSITION[type]}
                          </p>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
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

        <div className={classNames('gap-2 ml-10 items-center justify-center')}>
          <button
            className={classNames(
              'bg-[#05966A] hover:bg-emerald-700 text-white p-3 rounded-md flex w-full text-center items-center justify-center'
            )}
            onClick={() => handleSearch()}
          >
            Search
          </button>
        </div>

        <div className='items-center justify-center gap-2'>
          <div className='sm:w-[100px] h-[50px] relative'>
            <button
              className='w-[70%] h-full left-5 top-0 absolute bg-red-500 hover:bg-red-700 text-white rounded-lg'
              type='submit'
              onClick={() => handleReset()}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className='flex justify-center items-center 2 mt-[10px] '>
        {isLoading ? (
          <div className='flex justify-center my-4 min-h-[70vh] flex-col items-center'>
            <LoadSpinner className='text-3xl' />
          </div>
        ) : (
          <div className='flex flex-wrap w-3/4 justify-center items-center 2 mt-[10px]'>
            {/* <!-- Card --> */}
            {showJobs && showJobs.length > 0 ? (
              showJobs.map((job: any) => (
                <Link
                  to={`../jobdetail/${job.jobId}`}
                  key={job.jobId}
                  className='flex px-4 mb-8 lg:w-full md:w-1/3 sm:w-3/4'
                >
                  <RecruiterJobCard job={job} />
                </Link>
              ))
            ) : (
              <div className='flex justify-center w-full mb-10'>
                <span>No Job Found</span>
              </div>
            )}
          </div>
        )}
        {/* <!-- Card --> */}
      </div>

      <Pagination queryConfig={queryConfig} pageSize={pageSize} url='/recruiter/jobs' />

      <div className='fixed right-0 p-4 text-white bottom-4'>
        <div className='sm:w-[100px] h-[50px] relative'>
          <Link to='../addjob'>
            <button className='relative w-[50%] h-full text-3xl font-w bg-[#05966A] hover:bg-emerald-700 text-white rounded-full transition-all duration-300 hover:w-[100%] group'>
              <span className='absolute text-sm transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2 opacity-0 left-1/2 top-1/2 group-hover:opacity-100'>
                Add Job
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
export default ReccerJobManagement
