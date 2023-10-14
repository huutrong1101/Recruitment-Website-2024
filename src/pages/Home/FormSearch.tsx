import { Fragment, useState } from 'react'
import classNames from 'classnames'
import { Menu, Transition } from '@headlessui/react'
import { CakeIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { data } from '../../data/fetchData'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { JobListConfig } from '../../types/product.type'
import useQueryParams from '../../hooks/useQueryParams'
import { isEmpty, isUndefined, omitBy } from 'lodash'
import { useAppSelector } from '../../hooks/hooks'
import { JOB_POSITION } from '../../utils/Localization'

export type QueryConfig = {
  [key in keyof JobListConfig]: string
}
export default function FormSearch() {
  const [type, setType] = useState('')
  const [search, setSearch] = useState('')
  const [showType, setShowType] = useState(false)
  const listType = useAppSelector((state) => state.Job.type)
  const navigate = useNavigate()
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 10,
      name: queryParams.name,
      position: queryParams.position
    },
    isUndefined
  )

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault()

      const searchParams = {
        ...queryConfig,
        page: '1',
        limit: '10',
        name: search,
        type: type
      }

      const filteredSearchParams = omitBy(searchParams, isEmpty)

      navigate({
        pathname: '/jobs',
        search: createSearchParams(filteredSearchParams).toString()
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form
      className={classNames('flex flex-col border rounded-md shadow-md md:shadow-lg md:flex-row p-3 gap-4 mt-[40px]')}
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className={classNames('flex w-full items-center flex-shrink-0 md:w-[49%] border-r-2')}>
        <MagnifyingGlassIcon className={classNames(`w-[20px] ml-1 md:ml-4`)} />
        <input
          type='text'
          placeholder='Search your Keywords'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={classNames('w-[85%] h-full text-[10px] md:text-[17px] ml-3 focus:outline-none')}
        />
      </div>

      <div className={classNames('flex items-center w-full gap-4 md:w-[27%] border-r-2')}>
        <CakeIcon className={classNames(`w-[20px] md:ml-4`)} />
        <Menu as='div' className={classNames('relative w-full')}>
          <Menu.Button className={classNames('w-full')}>
            <div
              className={classNames('text-[13px] cursor-pointer flex items-center justify-between')}
              onClick={() => setShowType(!showType)}
            >
              {JOB_POSITION[type] || 'TYPE OF JOB'}
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
            <Menu.Items className='absolute md:left-[-18px] w-full z-10 md:w-55 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='py-1'>
                {listType &&
                  listType.map((type, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <p
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm cursor-pointer'
                          )}
                          onClick={() => {
                            setType(type)
                            setShowType(false)
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

      <div className={classNames('w-full md:w-[24%] flex items-center justify-center')}>
        <button className='w-[50%] md:w-[80%] md:h-[56px] border rounded-md bg-emerald-700 shadow-md text-white'>
          Search
        </button>
      </div>
    </form>
  )
}
