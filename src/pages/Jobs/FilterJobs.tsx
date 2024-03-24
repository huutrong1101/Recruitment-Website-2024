import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import { JOB_POSITION } from '../../utils/Localization'

interface FilterJobsProps {
  dataSearch: {
    key: string
    position: string
    location: string
    type: string
  }
  posistion: string[]
  location: string[]
  type: string[]
  handleSearch: (e: React.FormEvent) => void
  handleReset: () => void
  setDataSearch: React.Dispatch<
    React.SetStateAction<{
      key: string
      position: string
      location: string
      type: string
    }>
  >
}

const FilterJobs: React.FC<FilterJobsProps> = ({
  dataSearch,
  posistion,
  location,
  type,
  handleSearch,
  handleReset,
  setDataSearch
}) => {
  return (
    <div
      className={classNames(
        'p-6 bg-white rounded-lg shadow-sm w-full lg:max-w-xs lg:w-1/3 lg:h-fit lg:sticky top-[25px] flex flex-col gap-3 border'
      )}
    >
      <form onSubmit={handleSearch}>
        <div>
          <h3 className={classNames('text-base font-semibold')}>Nội dung tìm kiếm</h3>
          <div
            className={classNames(
              'flex items-center flex-shrink-0 w-full p-2 border rounded-xl mt-2',
              'focus-within:border-orange text-base'
            )}
          >
            <MagnifyingGlassIcon className={classNames(`w-[20px]`)} />
            <input
              value={dataSearch.key}
              onChange={(e) => setDataSearch({ ...dataSearch, key: e.target.value })}
              type='text'
              placeholder='Tìm kiếm công việc'
              className={classNames('w-[85%] h-full text-[12px] ml-3 focus:outline-none text-base text-zinc-400')}
            />
          </div>
        </div>
        {/* Category  */}
        <div className={classNames('mt-4')}>
          <h3 className={classNames('text-base font-semibold capitalize')}>Vị trí công việc</h3>
          <Menu as='div' className={classNames('relative mt-2')}>
            <Menu.Button
              className={classNames('cursor-pointer flex items-center justify-between w-full p-2 border rounded-xl')}
            >
              <span className={classNames('ml-2 text-zinc-400')}>{JOB_POSITION[dataSearch.position] || 'Vị trí'}</span>
              <ChevronDownIcon className={classNames('w-[20px] ml-4')} />
              {/* Drop down  */}
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
              <Menu.Items className='absolute left-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  {posistion.map((pos, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <p
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                          onClick={() =>
                            setDataSearch({
                              ...dataSearch,
                              position: pos
                            })
                          }
                        >
                          {JOB_POSITION[pos]}
                        </p>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        {/* Location  */}
        <div className={classNames('mt-4')}>
          <h3 className={classNames('text-base font-semibold  capitalize')}>Địa điểm</h3>
          <Menu as='div' className={classNames('relative mt-2')}>
            <Menu.Button
              className={classNames('cursor-pointer flex items-center justify-between w-full p-2 border rounded-xl')}
            >
              <span className={classNames('ml-2 text-zinc-400')}>
                {JOB_POSITION[dataSearch.location] || 'Địa điểm'}
              </span>
              <ChevronDownIcon className={classNames('w-[20px] ml-4')} />
              {/* Drop down  */}
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
              <Menu.Items className='absolute left-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  {location.map((location, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <p
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                          onClick={() =>
                            setDataSearch({
                              ...dataSearch,
                              location: location
                            })
                          }
                        >
                          {JOB_POSITION[location]}
                        </p>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        {/* Jobs Type  */}
        <div className={classNames('mt-4')}>
          <h3 className={classNames('text-base font-semibold')}>Loại hình công việc</h3>
          <Menu as='div' className={classNames('relative mt-2')}>
            <Menu.Button
              className={classNames('cursor-pointer flex items-center justify-between w-full p-2 border rounded-xl')}
            >
              <span className={classNames('ml-2 text-zinc-400')}>{JOB_POSITION[dataSearch.type] || 'Loại'}</span>
              <ChevronDownIcon className={classNames('w-[20px] ml-4')} />
              {/* Drop down  */}
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
              <Menu.Items className='absolute left-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  {type.map((type, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <p
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                          onClick={() =>
                            setDataSearch({
                              ...dataSearch,
                              type: type
                            })
                          }
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
        {/* Button Search */}
        <div className={classNames('mt-6 flex gap-2 flex-col')}>
          <button
            type='submit'
            className={classNames(
              'bg-[#4eb848] hover:bg-[#368132] text-white p-3 rounded-md flex w-full text-center items-center justify-center'
            )}
          >
            Tìm kiếm
          </button>
        </div>
      </form>
      <button
        className={classNames(
          'bg-red-700 hover:bg-red-900 text-white p-3 rounded-md flex w-full text-center items-center justify-center'
        )}
        onClick={handleReset}
      >
        Xóa nội dung
      </button>
    </div>
  )
}

export default FilterJobs
