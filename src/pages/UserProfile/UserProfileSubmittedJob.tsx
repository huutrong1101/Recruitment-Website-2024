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

  const normalizeResponseResult = (result: any) => {
    return (
      result.content as {
        jobApplyId: string
        status: 'NOT_RECEIVED' | 'RECEIVED' | 'PASSED' | 'FAILED'
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
      // const size = prev.get("size") || "5";

      return {
        size: value.toString() || '5',
        index
      }
    })

    setPagination({ ...pagination, loading: true })
  }

  return (
    <div className={`px-4 py-2 bg-zinc-100 mt-2 rounded-xl flex flex-col gap-2 flex-1`}>
      {/* Header */}
      <div className={classnames(`flex flex-col gap-4`)}>
        <h1 className={classnames(`font-semibold text-2xl pt-2`)}>Submitted Jobs</h1>

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
        <Table
          rows={[
            {
              id: 'jobTitle',
              value: 'Job Title'
            },
            {
              id: 'date',
              value: 'Date'
            },
            {
              id: 'status',
              value: 'Status'
            }
          ]}
          data={applicants}
          isModal={false}
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
