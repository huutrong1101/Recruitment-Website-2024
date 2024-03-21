import classNames from 'classnames'
import { isEmpty, isEqual, isUndefined, omit, omitBy } from 'lodash'
import qs from 'query-string'
import { useEffect, useState } from 'react'
import { AiOutlineBlock } from 'react-icons/ai'
import { createSearchParams, useNavigate } from 'react-router-dom'
import JobCard from '../../components/JobCard/JobCard'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import Pagination from '../../components/Pagination/Pagination'
import { useAppSelector } from '../../hooks/hooks'
import useQueryParams from '../../hooks/useQueryParams'
import axiosInstance from '../../utils/AxiosInstance'
import { JobInterface, JobListConfig } from '../../types/job.type'
import FilterJobs from './FilterJobs'

export type QueryConfig = {
  [key in keyof JobListConfig]: string
}

export default function Jobs() {
  const jobs: JobInterface[] = useAppSelector((state) => state.Job.jobs)

  const posistion = useAppSelector((state) => state.Job.postion)

  const location = useAppSelector((state) => state.Job.location)

  const type = useAppSelector((state) => state.Job.type)

  const totalJobs = useAppSelector((state) => state.Job.totalJobs)

  const [dataSearch, setDataSearch] = useState({
    key: '',
    position: '',
    location: '',
    type: ''
  })

  const navigate = useNavigate()

  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 10,
      name: queryParams.name,
      location: queryParams.location,
      position: queryParams.position,
      type: queryParams.type
    },
    isUndefined
  )

  const [prevQueryConfig, setPrevQueryConfig] = useState<QueryConfig>(queryConfig)

  const [showJobs, setShowJobs] = useState(jobs)

  const [pageSize, setPageSize] = useState(Math.ceil(totalJobs / Number(queryParams.limit || 10)))

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchPosition = async () => {
      setIsLoading(true)
      try {
        if (queryConfig) {
          const query = qs.stringify(queryConfig)
          const response = await fetchJobWithQuery(query)
          setShowJobs(response.data.result.content)
          setPageSize(response.data.result.totalPages)

          setDataSearch({
            ...dataSearch,
            key: queryConfig.name || '',
            type: queryConfig.type || ''
          })
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
          const response = await fetchJobWithQuery(query)

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

  const fetchJobWithQuery = async (query: string) => {
    return await axiosInstance(`/jobs?${query}`, {
      headers: { Authorization: null }
    })
  }

  const handleSearch = async (e: any) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      const searchParams = {
        ...queryConfig,
        page: '1',
        limit: '10',
        name: dataSearch.key,
        position: dataSearch.position,
        location: dataSearch.location,
        type: dataSearch.type
      }

      const filteredSearchParams = omitBy(searchParams, isEmpty)

      navigate({
        pathname: '/jobs',
        search: createSearchParams(filteredSearchParams).toString()
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setDataSearch({
      key: '',
      position: '',
      location: '',
      type: ''
    })

    navigate({
      pathname: '/jobs',
      search: createSearchParams(
        omit(queryConfig, ['name', 'position', 'size', 'location', 'type', 'page', 'limit'])
      ).toString()
    })
  }

  return (
    <>
      <div className={classNames('flex flex-col lg:flex-row gap-5 mb-12')}>
        {/* Sidebar Search  */}
        <FilterJobs
          dataSearch={dataSearch}
          posistion={posistion}
          location={location}
          type={type}
          handleSearch={handleSearch}
          handleReset={handleReset}
          setDataSearch={setDataSearch}
        />

        {/* List Jobs  */}

        <div className={classNames('w-full lg:max-w-full lg:w-2/3')}>
          {isLoading ? (
            <div className='flex justify-center my-4 min-h-[70vh] flex-col items-center'>
              <LoadSpinner className='text-3xl text-emerald-500' />
            </div>
          ) : (
            <div className='flex flex-wrap -mx-4'>
              {/* <!-- Card --> */}
              {showJobs.length > 0 ? (
                <>
                  {showJobs.map((job) => (
                    <div className='w-full px-4 mb-8 md:w-1/2' key={job.jobId}>
                      <JobCard job={job} />
                    </div>
                  ))}
                </>
              ) : (
                <div className='flex flex-col justify-center w-full mb-10 min-h-[70vh] items-center text-3xl gap-4'>
                  <span>
                    <AiOutlineBlock />
                  </span>
                  <span>There is no job available.</span>
                </div>
              )}
            </div>
          )}
          {/* Pagination  */}
          <Pagination queryConfig={queryConfig} pageSize={pageSize} url='/jobs' />
        </div>
      </div>
    </>
  )
}
