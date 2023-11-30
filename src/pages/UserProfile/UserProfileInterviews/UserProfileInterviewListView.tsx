import { Listbox, Transition } from '@headlessui/react'
import classnames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { HiListBullet } from 'react-icons/hi2'

import UserProfileInterviewListViewTable from '../../../components/Table/Table'

import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import Button from '../../../components/Button/Button'
import LoadSpinner from '../../../components/LoadSpinner/LoadSpinner'
import { getCandidateInterviews } from '../../../services/InterviewService'

const INTERVIEW_STATUS = ['Any', 'Pending', 'Finished']

// export default function UserProfileInterviewListView() {
//   const { register, handleSubmit } = useForm();
export interface TableRow {
  id: string
  value: any
}

export interface TableProps<T> {
  rows: TableRow[]
  data: T[]
}

interface InterviewData {
  interviewId: string
  interviewLink: string
  interviewerNames: string[]
  jobId: string
  jobName: string
  time: string
}

export default function UserProfileInterviewListView<T>({ rows, data }: TableProps<T>) {
  const [filterType, setFilterType] = useState<number>(0)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = () => {}

  const [interviews, setInterviews] = useState<object[]>([])

  const [searchParams, setSearchParams] = useSearchParams()

  const [pagination, setPagination] = useState({
    loading: false,
    pageNumber: 1,
    pageSize: 10,
    totalElements: 10,
    totalPages: 1
  })

  useEffect(() => {
    const index = searchParams.get('index') || 1
    const size = searchParams.get('size') || 5
    setPagination({ ...pagination, loading: true })

    getCandidateInterviews({ index, size })
      .then((response) => {
        const { result } = response.data
        const { pageNumber, pageSize, totalElements, totalPages } = result
        // Normalize the result onto a fitted table data
        // Set onto a data list for rendering
        setInterviews(normalizeResponseResult(result))
        setPagination({
          ...pagination,
          pageNumber,
          pageSize,
          totalElements,
          totalPages,
          loading: false
        })
      })
      .catch(() => {
        // toast.error(``)
      })
  }, [searchParams])

  const handleNextPage = () => {
    setSearchParams((prev) => {
      const index = prev.get('index') || '1'
      const size = prev.get('size') || '5'

      return {
        size,
        index: (Number.parseInt(index) + 1).toString()
      }
    })

    setPagination({ ...pagination, loading: true })
  }
  const handlePreviousPage = () => {
    setSearchParams((prev) => {
      const index = prev.get('index') || '1'
      const size = prev.get('size') || '5'

      return {
        size,
        index: (Number.parseInt(index) - 1).toString()
      }
    })

    setPagination({ ...pagination, loading: true })
  }

  const handleChangeLimit = (value: number) => {
    setSearchParams((prev) => {
      const index = prev.get('index') || '1'

      return {
        size: value.toString() || '5',
        index
      }
    })

    setPagination({ ...pagination, loading: true })
  }

  const normalizeResponseResult = (result: any) => {
    return (
      result.content as {
        interviewLink: string
        interviewersName: string[]
        jobName: string
        time: string
      }[]
    ).map((interviews) => {
      return {
        jobName: interviews.jobName,
        time: interviews.time,
        interviewerNames: interviews.interviewersName,
        interviewLink: interviews.interviewLink
      }
    })
  }

  return (
    <div className={`px-4 py-2 bg-zinc-100 mt-2 rounded-xl flex flex-col gap-2`}>
      {/* Header */}
      <div className={classnames(`flex flex-col gap-4`)}>
        <h1 className={classnames(`font-semibold text-2xl pt-2`)}>Interview Recent</h1>

        {/* Filter groups */}
        <div className={classnames(`flex flex-row items-center gap-4`)}>
          <div className='w-40'>
            <Listbox value={searchParams.get('size') || 5} onChange={handleChangeLimit} disabled={pagination.loading}>
              <div className={classnames(`relative`)}>
                <Listbox.Button
                  className={classnames(
                    `bg-white px-3 py-2 border rounded-md w-full`,
                    `text-left flex flex-row items-center gap-4`,
                    filterType !== 0 ? `text-emerald-600` : `text-zinc-500`,
                    `disabled:bg-gray-200 disabled:border disabled:animate-pulse`
                  )}
                >
                  <span>
                    <HiListBullet />
                  </span>
                  <span>{searchParams.get('size') || 5} applicants</span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                    {/* {APPLICANT_STATUS.map((status, personIdx) => (
                      <Listbox.Option
                        key={status}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-emerald-100 text-emerald-900"
                              : "text-zinc-600"
                          }`
                        }
                        value={personIdx}
                      >
                        {({ selected }: any) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {status}
                            </span>
                          </>
                        )}
                      </Listbox.Option>
                    ))} */}
                    {[...new Array(10)].map((_, idx) => {
                      const _value = (idx + 1) * 5
                      return (
                        <Listbox.Option
                          key={_value}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-emerald-100 text-emerald-900' : 'text-zinc-600'
                            }`
                          }
                          value={_value}
                        >
                          {({ selected }: any) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {_value}
                              </span>
                            </>
                          )}
                        </Listbox.Option>
                      )
                    })}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>
      </div>

      {/* Body */}
      <div>
        <UserProfileInterviewListViewTable rows={rows} data={interviews} isModal={true} />
      </div>

      {/* Footer */}
      <div className={classnames(`flex mb-4 flex-row px-2 text-zinc-500 text-sm items-center gap-4`)}>
        <div>
          {pagination.loading ? (
            <LoadSpinner />
          ) : (
            <>
              Page {pagination.pageNumber} of {pagination.totalPages}
            </>
          )}
        </div>
        <div className={classnames(`flex flex-row-reverse flex-1 gap-4`)}>
          <Button
            text='Next'
            className={classnames(``)}
            size='sm'
            disabled={pagination.pageNumber >= pagination.totalPages}
            onClick={handleNextPage}
          />

          <Button
            text='Previous'
            className={classnames(``)}
            size='sm'
            disabled={pagination.pageNumber === 1}
            onClick={handlePreviousPage}
          />
        </div>
      </div>
    </div>
  )
}
