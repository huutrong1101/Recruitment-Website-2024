import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { fetchRecInterviewerList, fetchRecInterviewerSkill } from '../../../redux/reducer/RecInterviewerSilce'
import { RecInterviewerInterface, RecInterviewerListConfig } from '../../../types/services'
import useQueryParams from '../../../hooks/useQueryParams'
import { isEqual, isUndefined, omitBy, isEmpty } from 'lodash'
import qs from 'query-string'
import axios from 'axios'
import { createSearchParams, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import LoadSpinner from '../../../components/LoadSpinner/LoadSpinner'
import RecInterviewerManageCard from '../../../components/RecInterviewerManageCard/RecInterviewerManageCard'
import axiosInstance from '../../../utils/AxiosInstance'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'

export type QueryConfig = {
  [key in keyof RecInterviewerListConfig]: string
}

const ReccerInterviewerManagement = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchRecInterviewerList())
    dispatch(fetchRecInterviewerSkill())
  }, [])

  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      size: queryParams.size || 8,
      name: queryParams.name,
      skill: queryParams.skill
    },
    isUndefined
  )

  const [prevQueryConfig, setPrevQueryConfig] = useState<QueryConfig>(queryConfig)

  const interviewers: RecInterviewerInterface[] = useAppSelector((state) => state.RecInterviewerList.recInterviewerList)
  const totalInterviewers = useAppSelector((state) => state.RecInterviewerList.recInterviewerTotal)

  const [pageSize, setPageSize] = useState(Math.ceil(totalInterviewers / Number(queryParams.size ?? 10)))

  const [isLoading, setIsLoading] = useState(false)
  const [showinterviewers, setshowinterviewers] = useState(interviewers)

  const [dataSearch, setDataSearch] = useState({
    key: '',
    skill: ''
  })

  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosition = async () => {
      setIsLoading(true)
      try {
        if (queryConfig) {
          const query = qs.stringify(queryConfig)
          const response = await fetchIntervieWithQuery(query)
          setshowinterviewers(response.data.result.content)
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
    fetchPosition()
  }, [])

  useEffect(() => {
    if (!isEqual(prevQueryConfig, queryConfig)) {
      const fetchInterviewers = async () => {
        setIsLoading(true)
        try {
          const query = qs.stringify(queryConfig)
          const response = await fetchIntervieWithQuery(query)
          setshowinterviewers(response.data.result.content)
          setPageSize(response.data.result.totalPages)
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchInterviewers()
      setPrevQueryConfig(queryConfig)
    }
  }, [queryConfig, prevQueryConfig])

  const fetchIntervieWithQuery = async (query: string) => {
    return await axiosInstance(`/recruiter/interviewers?${query}`)
  }

  const handleSearch = async (e: any) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      const searchParams = {
        ...queryConfig,
        //Dưới đây là cái parameter ở URL
        name: dataSearch.key,
        skill: dataSearch.skill,
        page: '1'
      }

      const filteredSearchParams = omitBy(searchParams, isEmpty)

      navigate({
        pathname: '../interviewers',
        search: createSearchParams(filteredSearchParams).toString()
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  console.log(showinterviewers)

  return (
    <>
      <form onSubmit={handleSearch} className='flex justify-center mt-6 item-center'>
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
          <PrimaryButton type='submit' text='Search' className='bg-[#05966A] hover:bg-emerald-700' />
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
            {showinterviewers && showinterviewers.length > 0 ? (
              showinterviewers.map((interviewer: any) => (
                <div key={interviewer.interviewerId} className='px-3 mb-8 lg:w-1/4 md:w-1/3 sm:w-3/4'>
                  <RecInterviewerManageCard interviewer={interviewer} />
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

export default ReccerInterviewerManagement
