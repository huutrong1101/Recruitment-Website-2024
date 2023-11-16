import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { RecCandidateInterface, RecCandidateList } from '../../../types/services'
import { fetchCandidateList, fetchCandidateSkill } from '../../../redux/reducer/CandidateListSlice'
import useQueryParams from '../../../hooks/useQueryParams'
import { isEqual, isUndefined, omitBy, isEmpty } from 'lodash'
import axiosInstance from '../../../utils/AxiosInstance'
import qs from 'query-string'
import { createSearchParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import LoadSpinner from '../../../components/LoadSpinner/LoadSpinner'
import RecCandidateCard from '../../../components/RecCandidateManageCard/RecCandidateManageCard'
import { data } from '../../../data/fetchData'

export type QueryConfig = {
  [key in keyof RecCandidateList]: string
}

const ReccerCandidateManagement = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCandidateList())
    dispatch(fetchCandidateSkill())
  }, [])

  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      index: queryParams.index || '1',
      size: queryParams.size || 8,
      name: queryParams.name,
      skill: queryParams.skill
    },
    isUndefined
  )

  const [prevQueryConfig, setPrevQueryConfig] = useState<QueryConfig>(queryConfig)

  const candidates: RecCandidateInterface[] = useAppSelector((state) => state.CandidateList.candidatesList)
  const totalCandidates = useAppSelector((state) => state.CandidateList.candidateTotal)

  const [pageSize, setPageSize] = useState(Math.ceil(totalCandidates / Number(queryParams.size ?? 3)))

  const [isLoading, setIsLoading] = useState(false)

  const [showCandidates, setshowCandidates] = useState([])

  const [dataSearch, setDataSearch] = useState({
    key: '',
    skill: ''
  })

  const navigate = useNavigate()

  const [showSkill, setShowSkill] = useState(false)
  // console.log(showSkill)
  const [skill, setCandidateskillList] = useState('')
  // console.log(skill);
  const listSkills = useAppSelector((state) => state.CandidateList.skill)
  // console.log(listSkills)

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true)
      try {
        if (queryConfig) {
          const query = qs.stringify(queryConfig)
          const response = await axiosInstance(`/recruiter/applied-candidates?${query}`)
          setshowCandidates(response.data.result)
          setPageSize(response.data.result.totalPages)
        }
        setDataSearch({
          ...dataSearch,
          key: queryConfig.name || '',
          skill: queryConfig.skill || ''
        })
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSkills()
  }, [])

  useEffect(() => {
    if (!isEqual(prevQueryConfig, queryConfig)) {
      const fetchCandidates = async () => {
        setIsLoading(true)
        try {
          const query = qs.stringify(queryConfig)
          const response = await axiosInstance(`/recruiter/applied-candidates?${query}`)
          setshowCandidates(response.data.result)
          setPageSize(response.data.result.totalPages)
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchCandidates()
      setPrevQueryConfig(queryConfig)
    }
  }, [queryConfig, prevQueryConfig])

  const handleSearch = async (e: any) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      const searchParams = {
        ...queryConfig,
        name: dataSearch.key,
        skill: dataSearch.skill,
        index: '1'
      }

      const filteredSearchParams = omitBy(searchParams, isEmpty)

      navigate({
        pathname: '',
        search: createSearchParams(filteredSearchParams).toString()
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  console.log(showCandidates)

  return (
    <>
      <form className='flex justify-center mt-6 item-center' onSubmit={handleSearch}>
        {/* Input */}
        <div
          className={classNames(
            'flex items-center flex-shrink-0 w-1/2 p-2 border-[2px] rounded-lg',
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
              'w-full h-full text-[12px] ml-3 focus:outline-none text-base text-zinc-400 bg-transparent'
            )}
          />
        </div>
        {/* Button */}
        <div className={classNames('gap-2 ml-10 items-center justify-center')}>
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
      <>
        {isLoading ? (
          <div className='flex justify-center my-4 min-h-[70vh] flex-col items-center'>
            <LoadSpinner className='text-3xl' />
          </div>
        ) : (
          <div className='flex flex-wrap justify-center items-center mt-[20px] '>
            {/* <!-- Card --> */}
            {showCandidates && showCandidates.length > 0 ? (
              showCandidates.map((candidate: any) => (
                <div key={candidate.candidateId} className='px-3 mb-8 lg:w-1/4 md:w-1/3 sm:w-3/4'>
                  <RecCandidateCard candidate={candidate} />
                </div>
              ))
            ) : (
              <div className='flex justify-center w-full mb-10'>
                <span>No Result Found</span>
              </div>
            )}
          </div>
        )}
      </>
    </>
  )
}

export default ReccerCandidateManagement
