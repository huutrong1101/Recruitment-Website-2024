import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { JobInterface, JobListConfig } from '../../types/job.type'
import { useLocation, useNavigate } from 'react-router-dom'
import JobCard from '../../components/JobCard/JobCard'
import FilterJobs from './FilterJobs'
import Container from '../../components/Container/Container'
import { JobService } from '../../services/JobService'
import { Spin, Pagination } from 'antd'
import classNames from 'classnames'
import qs from 'query-string'

export type QueryConfig = {
  [key in keyof JobListConfig]: string
}

export default function Jobs() {
  const dispatch = useAppDispatch()
  const jobs: JobInterface[] = useAppSelector((state) => state.Job.jobs)
  const totalJobs = useAppSelector((state) => state.Job.totalJobs)
  const provinces = useAppSelector((state) => state.Job.province)
  const experiences = useAppSelector((state) => state.Job.experience)
  const jobTypes = useAppSelector((state) => state.Job.type)
  const levelRequirement = useAppSelector((state) => state.Job.levelRequirement)
  const genderRequirement = useAppSelector((state) => state.Job.genderRequirement)
  const activities = useAppSelector((state) => state.Job.activities)

  const location = useLocation()
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [isLoading, setIsLoading] = useState(false)

  const [resetToken, setResetToken] = useState(Date.now())

  const [dataSearch, setDataSearch] = useState({
    name: '',
    province: '',
    experience: '',
    field: '',
    levelRequirement: '',
    genderRequirement: '',
    type: ''
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const name = searchParams.get('name') || ''
    const province = searchParams.get('province') || ''
    const experience = searchParams.get('experience') || ''
    const field = searchParams.get('field') || ''
    const type = searchParams.get('type') || ''
    const levelRequirement = searchParams.get('levelRequirement') || ''
    const genderRequirement = searchParams.get('genderRequirement') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)

    setDataSearch({
      name,
      province,
      experience,
      field,
      type,
      levelRequirement,
      genderRequirement
    })
    setCurrentPage(page)

    fetchJobs({
      name,
      province,
      experience,
      field,
      type,
      levelRequirement,
      genderRequirement,
      page,
      limit: pageSize
    })
  }, [location.search, currentPage, pageSize])

  const fetchJobs = async (params: any) => {
    try {
      setIsLoading(true)
      await JobService.getJobs(dispatch, {
        ...params,
        page: params.page || 1, // Ensuring page is set
        limit: pageSize // Keeping limit only in fetchJobs and not in the URL
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: any) => {
    e.preventDefault()
    const params = {
      name: dataSearch.name,
      province: dataSearch.province,
      type: dataSearch.type,
      levelRequirement: dataSearch.levelRequirement,
      experience: dataSearch.experience,
      field: dataSearch.field,
      genderRequirement: dataSearch.genderRequirement
    }

    // Filter out empty values
    const filteredParams: any = Object.fromEntries(Object.entries(params).filter(([key, value]) => value))

    if (currentPage > 1) {
      filteredParams.page = String(currentPage) // Convert the page to a string
    }

    navigate({
      pathname: '/jobs',
      search: qs.stringify(filteredParams)
    })
    fetchJobs(filteredParams)
  }

  const handleReset = () => {
    setDataSearch({
      name: '',
      province: '',
      experience: '',
      field: '',
      levelRequirement: '',
      genderRequirement: '',
      type: ''
    })

    setResetToken(Date.now()) // Reset token to refresh FormSearch

    navigate('/jobs') // Navigate back to the jobs page without params

    fetchJobs({
      page: 1
    })
    setCurrentPage(1) // Set the current page back to 1
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params: any = {
      ...dataSearch,
      page: String(page) // Convert page to a string
    }

    // Filter out empty values
    const filteredParams: any = Object.fromEntries(Object.entries(params).filter(([key, value]) => value))

    // Remove `page` if it is 1
    if (page === 1) {
      delete filteredParams.page
    }

    navigate({
      pathname: '/jobs',
      search: qs.stringify(filteredParams)
    })

    fetchJobs(params)
  }

  return (
    <Container className='mb-12'>
      <div className={classNames('flex flex-col gap-5 ')}>
        {/* Sidebar Search  */}
        <FilterJobs
          dataSearch={dataSearch}
          provinces={provinces}
          experiences={experiences}
          jobTypes={jobTypes}
          levelRequirements={levelRequirement}
          genderRequirements={genderRequirement}
          activities={activities}
          handleSearch={handleSearch}
          handleReset={handleReset}
          setDataSearch={setDataSearch}
          resetToken={resetToken}
        />

        {/* List Jobs  */}
        <div className={classNames('w-full')}>
          {isLoading ? (
            <div className='flex justify-center my-4 min-h-[70vh]'>
              <Spin size='large' />
            </div>
          ) : (
            <div className='flex flex-wrap -mx-4'>
              {jobs.length > 0 ? (
                <>
                  {jobs.map((job) => (
                    <div className='w-full px-4 mb-8 md:w-1/2' key={job._id}>
                      <JobCard job={job} isShow={true} />
                    </div>
                  ))}
                </>
              ) : (
                <div className='flex flex-col justify-center w-full mb-10 min-h-[70vh] items-center text-3xl gap-4'>
                  <img
                    src='https://cdni.iconscout.com/illustration/premium/thumb/error-404-4344461-3613889.png'
                    alt=''
                    className='h-[300px]'
                  />
                  <span>Không tìm thấy công việc phù hợp.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className='flex justify-center p-4'>
        <Pagination current={currentPage} onChange={handlePageChange} total={totalJobs} pageSize={pageSize} />
      </div>
    </Container>
  )
}
