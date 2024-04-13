import { Listbox, Transition } from '@headlessui/react'
import classnames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { HiListBullet } from 'react-icons/hi2'
import Button from '../../components/Button/Button'
import Table from '../../components/Table/Table'

import moment from 'moment'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import JobStatusBadge from '../../components/Badge/JobStatusBadge'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import { getCandidateSubmittedJobs } from '../../services/CandidateService'
import Search, { SearchProps } from 'antd/es/input/Search'

export default function UserProfileSubmittedJob() {
  const [filterType, setFilterType] = useState<number>(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const { handleSubmit, register } = useForm()
  const onSubmit = (data: any) => {}
  const [applicants, setApplicants] = useState<object[]>([])
  const navigate = useNavigate()
  const [pagination, setPagination] = useState({
    loading: false,
    pageNumber: 1,
    pageSize: 10,
    totalElements: 10,
    totalPages: 1
  })

  useEffect(() => {
    const page = searchParams.get('page') || 1
    const limit = searchParams.get('limit') || 5
    setPagination({ ...pagination, loading: true })

    getCandidateSubmittedJobs({ page, limit })
      .then((response) => {
        const { result } = response.data
        const { pageNumber, pageSize, totalElements, totalPages } = result

        // Normalize the result onto a fitted table data
        // Set onto a data list for rendering
        setApplicants(normalizeResponseResult(result))
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

  const normalizeResponseResult = (result: any) => {
    return (
      result.content as {
        jobApplyId: string
        status: 'NOT_RECEIVED' | 'REVIEWING' | 'PASS' | 'FAIL' | 'PENDING'
        jobName: string
        applicationDate: Date
      }[]
    ).map((applicant) => {
      return {
        jobTitle: applicant.jobName,
        date: moment(applicant.applicationDate).format('DD/MM/yyyy'),
        status: <JobStatusBadge status={applicant.status} />
      }
    })
  }

  const handleNextPage = () => {
    setSearchParams((prev) => {
      const page = prev.get('page') || '1'
      const limit = prev.get('limit') || '5'

      return {
        limit,
        page: (Number.parseInt(page) + 1).toString()
      }
    })

    setPagination({ ...pagination, loading: true })
  }
  const handlePreviousPage = () => {
    setSearchParams((prev) => {
      const page = prev.get('page') || '1'
      const limit = prev.get('limit') || '5'

      return {
        limit,
        page: (Number.parseInt(page) - 1).toString()
      }
    })

    setPagination({ ...pagination, loading: true })
  }

  const handleChangeLimit = (value: number) => {
    setSearchParams((prev) => {
      const page = prev.get('page') || '1'

      return {
        limit: value.toString() || '5',
        page
      }
    })

    setPagination({ ...pagination, loading: true })
  }

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value)

  return (
    <div className={`px-4 py-2 bg-zinc-100 mt-2 rounded-xl flex flex-col gap-2 flex-1`}>
      {/* Header */}
      <div className={classnames(`flex flex-col gap-4`)}>
        <h1 className={classnames(`font-semibold text-2xl pt-2`)}>Danh sách ứng tuyển</h1>

        {/* Filter groups */}
        <div className={classnames(`flex flex-row items-center gap-4`)}>
          {/* <div className={classnames(`w-10/12`)}>
            <InputIcon
              icon={<HiMagnifyingGlass />}
              className={`text-base px-3 py-2 w-full outline-none`}
              placeholder="Search for the applicant"
              type={`text`}
              register={register}
              label={`search`}
            />
          </div> */}
          <div className='flex items-center justify-between w-full'>
            <Listbox value={searchParams.get('limit') || 5} onChange={handleChangeLimit} disabled={pagination.loading}>
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
                  <span>{searchParams.get('limit') || 5} dữ liệu</span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave='transition ease-in duration-100'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  <Listbox.Options className='absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
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
            <Search
              size='large'
              placeholder='Tìm kiếm'
              onSearch={onSearch}
              enterButton
              className='w-[35%]'
              style={{
                borderRadius: '4px' // Bo góc
              }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div>
        <Table
          rows={[
            {
              id: 'jobTitle',
              value: 'Tên'
            },
            {
              id: 'date',
              value: 'Ngày ứng tuyển'
            },
            {
              id: 'status',
              value: 'Trạng thái'
            }
          ]}
          data={applicants}
          isModal={false}
          responsiveColumns={['jobTitle', 'status']}
        />
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
