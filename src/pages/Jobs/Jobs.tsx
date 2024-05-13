import classNames from 'classnames'
import { isEmpty, isEqual, isUndefined, omit, omitBy } from 'lodash'
import qs from 'query-string'
import { useEffect, useState } from 'react'
import { AiOutlineBlock } from 'react-icons/ai'
import { createSearchParams, useNavigate } from 'react-router-dom'
import JobCard from '../../components/JobCard/JobCard'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import Pagination from '../../components/Pagination/Pagination'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import useQueryParams from '../../hooks/useQueryParams'
import axiosInstance from '../../utils/AxiosInstance'
import { JobInterface, JobListConfig } from '../../types/job.type'
import FilterJobs from './FilterJobs'
import Container from '../../components/Container/Container'
import { JobService } from '../../services/JobService'
import { data } from '../../data/fetchData'

export type QueryConfig = {
  [key in keyof JobListConfig]: string
}

export default function Jobs() {
  const dispatch = useAppDispatch()
  const jobs: JobInterface[] = useAppSelector((state) => state.Job.jobs)

  const provinces = useAppSelector((state) => state.Job.province)
  const experiences = useAppSelector((state) => state.Job.experience)
  const jobTypes = useAppSelector((state) => state.Job.type)
  const levelRequirement = useAppSelector((state) => state.Job.levelRequirement)
  const genderRequirement = useAppSelector((state) => state.Job.genderRequirement)
  const activities = useAppSelector((state) => state.Job.activities)
  const [resetToken, setResetToken] = useState(Date.now())

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    JobService.getJobs(dispatch)
  }, [])

  const [dataSearch, setDataSearch] = useState({
    key: '',
    selectedProvince: '',
    selectedExperiences: '',
    selectedActivity: '',
    selectedLevelRequirements: '',
    selectedGenderRequirements: '',
    selectedJobTypes: ''
  })

  const handleSearch = async (e: any) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      const params = {
        name: dataSearch.key,
        province: dataSearch.selectedProvince,
        type: dataSearch.selectedJobTypes,
        levelRequirement: dataSearch.selectedLevelRequirements,
        experience: dataSearch.selectedExperiences,
        field: dataSearch.selectedActivity,
        genderRequirement: dataSearch.selectedGenderRequirements
      }

      JobService.getJobs(dispatch, params)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setDataSearch({
      key: '',
      selectedProvince: '',
      selectedExperiences: '',
      selectedActivity: '',
      selectedLevelRequirements: '',
      selectedGenderRequirements: '',
      selectedJobTypes: ''
    })

    setResetToken(Date.now())

    try {
      JobService.getJobs(dispatch)
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Error fetching jobs:', error)
    }
  }

  return (
    <Container>
      <div className={classNames('flex flex-col gap-5 mb-12')}>
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
            <div className='flex justify-center my-4 min-h-[70vh] flex-col items-center'>
              <LoadSpinner className='text-3xl text-emerald-500' />
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
    </Container>
  )
}
