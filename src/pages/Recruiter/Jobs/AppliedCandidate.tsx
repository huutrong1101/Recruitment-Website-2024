import { Menu, Transition } from '@headlessui/react'
import {
  AdjustmentsHorizontalIcon,
  CalendarDaysIcon,
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Popover, PopoverContent, PopoverHandler } from '@material-tailwind/react'
import classNames from 'classnames'
import { isEqual, isUndefined, omitBy } from 'lodash'
import qs from 'query-string'
import { Fragment, useEffect, useState } from 'react'
import { Link, createSearchParams, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import useQueryParams from '../../../hooks/useQueryParams'
import axiosInstance from '../../../utils/AxiosInstance'
import { APPLY_STATUS } from '../../../utils/Localization'
import { StateService } from '../../../services/changeState'
import { AppliedCandidateListConfig } from '../../../types/services'
import CandidateStatusBadge from '../../Interviewer/Candidate/CandidateStatusBadge'

interface UserProps {
  candidateId: string
  jobId: string
  state: string
}

export type QueryConfig = {
  [key in keyof AppliedCandidateListConfig]: string
}

export default function Applied(num: any) {
  const { jobId } = useParams()

  const [applyCandidate, setApplyCandidate] = useState<any[]>([])

  const StateType = ['NOT_RECEIVED', 'RECEIVED', 'PASSED', 'FAILED']

  const [state, setState] = useState('')

  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = omitBy(
    {
      name: queryParams.name,
      state: queryParams.state
    },
    isUndefined
  )

  const [prevQueryConfig, setPrevQueryConfig] = useState<QueryConfig>(queryConfig)

  useEffect(() => {
    const getApplyCandidate = async () => {
      const response = await axiosInstance.get(`recruiter/jobs/${jobId}/candidates`)
      setApplyCandidate(response.data.result.content) // API get
    }
    getApplyCandidate()
  }, [state])

  useEffect(() => {
    const getApplyCandidate = async () => {
      const response = await axiosInstance.get(`recruiter/jobs/${jobId}/candidates`)
      setApplyCandidate(response.data.result.content) // API get
    }
    getApplyCandidate()
  }, [jobId])

  useEffect(() => {
    if (!isEqual(prevQueryConfig, queryConfig)) {
      const fetchApplyCandidate = async () => {
        try {
          const query = qs.stringify(queryConfig)
          const response = await axiosInstance(`/recruiter/jobs/${jobId}/candidates?${query}`)
          setApplyCandidate(response.data.result.content)
        } catch (error) {
          console.log(error)
        } finally {
        }
      }
      fetchApplyCandidate()
      setPrevQueryConfig(queryConfig)
    }
  }, [queryConfig, prevQueryConfig])

  let navigate = useNavigate()
  const routeChange = (userId: string) => {
    const countReceivedStates = applyCandidate?.map((data) => data.state).filter((state) => state === 'PASSED').length

    if (countReceivedStates < num.num) {
      let path = `interview-schedule/${userId}`
      navigate(path)
    } else toast.error(`This job already have enough candidates`)
  }

  const handlePass = (candidateId: string) => {
    const data = {
      candidateId: candidateId || '',
      jobId: jobId || '',
      state: 'PASS'
    }
    const countReceivedStates = applyCandidate?.map((data) => data.state).filter((state) => state === 'PASS').length

    if (countReceivedStates < num.num) {
      toast
        .promise(StateService.changeState(data), {
          pending: `Changing`,
          success: `The state was changed to pass`
        })
        .catch((error) => toast.error(error.response.data.result))
    } else toast.error(`This job already have enough candidates`)
    // console.log(countReceivedStates);
    // console.log(num.num);
  }

  const handleFail = (candidateId: string) => {
    const data = {
      candidateId: candidateId || '',
      jobId: jobId || '',
      state: 'FAIL'
    }
    toast
      .promise(StateService.changeState(data), {
        pending: `Changing`,
        success: `The state was changed to fail`
      })
      .catch((error) => toast.error(error.response.data.result))
  }

  const [sort, setSort] = useState('ASC')
  const sorting = (col: any) => {
    if (sort === 'ASC') {
      const sorted = [...applyCandidate].sort((a, b) => (a[col] > b[col] ? 1 : -1))
      setApplyCandidate(sorted)
      setSort('DSC')
    }
    if (sort === 'DSC') {
      const sorted = [...applyCandidate].sort((a, b) => (a[col] < b[col] ? 1 : -1))
      setApplyCandidate(sorted)
      setSort('ASC')
    }
  }

  console.log(applyCandidate)

  return (
    <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
      <div className='flex flex-row items-center'>
        <h1 className='flex-1 text-2xl font-semibold'>Applied Candidate</h1>
        <span className='text-base text-gray-700'>{applyCandidate && applyCandidate.length} applicant</span>
      </div>

      {applyCandidate && applyCandidate?.length > 0 ? (
        <div className='relative p-4 overflow-x-auto max-h-96 h-80'>
          <table className='w-full text-sm text-left text-gray-500'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
              <tr>
                <th scope='col' className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    Name
                    <ChevronUpDownIcon
                      className='w-5 h-5 cursor-pointer'
                      onClick={() => sorting('candidateFullName')}
                    />
                  </div>
                </th>
                <th scope='col' className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    Email
                    <ChevronUpDownIcon className='w-5 h-5 cursor-pointer' onClick={() => sorting('candidateEmail')} />
                  </div>
                </th>
                <th scope='col' className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    Interviewer's Name
                    <ChevronUpDownIcon className='w-5 h-5 cursor-pointer' onClick={() => sorting('candidateEmail')} />
                  </div>
                </th>
                <th scope='col' className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    Score
                    <ChevronUpDownIcon className='w-5 h-5 cursor-pointer' onClick={() => sorting('score')} />
                  </div>
                </th>
                <th scope='col' className='px-6 py-4'>
                  <Menu as='div' className={classNames('relative')}>
                    <Menu.Button
                      className={classNames(
                        'cursor-pointer flex items-center gap-3 w-full text-xs text-gray-700 uppercase bg-gray-50 '
                      )}
                    >
                      State
                      <AdjustmentsHorizontalIcon className='w-4 h-4' />
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
                      <Menu.Items className='absolute left-0 z-10 w-3/4 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        <div className='py-1'>
                          {StateType.map((state, index) => (
                            <Menu.Item key={index}>
                              {({ active }) => (
                                <Link
                                  to={{
                                    pathname: '',
                                    search: createSearchParams({
                                      ...queryConfig,
                                      state: state
                                    }).toString()
                                  }}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block px-4 py-2 text-[12px]'
                                  )}
                                >
                                  {state}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </th>
                <th scope='col' className='px-0 py-4'></th>
                <th className='py-4'></th>
              </tr>
            </thead>
            <tbody>
              {applyCandidate.map(
                (applyCandidate, index) =>
                  applyCandidate.blackList === false && (
                    <tr className='bg-white border-b ' key={index}>
                      <td scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                        {applyCandidate.candidateFullName}
                      </td>
                      <td className='px-6 py-4'>{applyCandidate.candidateEmail}</td>
                      <td className='px-6 py-4'>
                        {applyCandidate.interviewerFullNames && applyCandidate.interviewerFullNames.length === 0
                          ? 'None'
                          : applyCandidate.interviewerFullNames
                              .slice(0, 2)
                              .map((name: any, index: any) => <div key={index}>{name}</div>)}
                        {applyCandidate.interviewerFullNames && applyCandidate.interviewerFullNames?.length > 2 && (
                          <Popover>
                            <PopoverHandler>
                              <div className='hover:underline cursor-context-menu w-fit'>"Show all"</div>
                            </PopoverHandler>
                            <PopoverContent>
                              {applyCandidate.interviewerFullNames.map((name: any, index: any) => (
                                <div key={index} className='text-gray-500 font-small'>
                                  + {name}
                                </div>
                              ))}
                            </PopoverContent>
                          </Popover>
                        )}
                      </td>
                      <td className='px-6 py-4'>{applyCandidate.score ? applyCandidate.score : 'Pending'}</td>
                      <td className='p-2 px-4 py-4 mx-2 my-1 rounded-lg'>
                        {typeof applyCandidate?.state === 'string' && (
                          <CandidateStatusBadge
                            status={applyCandidate?.state as 'PENDING' | 'REVIEWING' | 'PASS' | 'FAIL'}
                          />
                        )}
                      </td>
                      <td>
                        {applyCandidate.state !== 'PENDING' ? (
                          applyCandidate.score !== null ? (
                            <div>
                              {
                                <button>
                                  <CheckIcon
                                    className='w-6 h-6 text-green-800'
                                    onClick={() => handlePass(applyCandidate.candidateId)}
                                  />
                                </button>
                              }

                              <button>
                                <XMarkIcon
                                  className='w-6 h-6 text-red-800'
                                  onClick={() => handleFail(applyCandidate.candidateId)}
                                />
                              </button>
                            </div>
                          ) : null
                        ) : (
                          <button>
                            <CalendarDaysIcon
                              className='w-6 h-6'
                              onClick={() => routeChange(applyCandidate.candidateId)}
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='text-center text-[1.1rem]'>This job has no one applied yet</div>
      )}
    </div>
  )
}
