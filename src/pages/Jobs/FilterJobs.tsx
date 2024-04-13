import React, { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import { JOB_POSITION } from '../../utils/Localization'
import { Input, Select } from 'antd'
import { UserCircleIcon } from '@heroicons/react/24/outline'

interface FilterJobsProps {
  dataSearch: {
    key: string
    position: string
    location: string
    type: string
    selectedType: string
  }
  posistion: string[]
  location: string[]
  type: string[]
  resetToken: number
  handleSearch: (e: React.FormEvent) => void
  handleReset: () => void
  setDataSearch: React.Dispatch<
    React.SetStateAction<{
      key: string
      position: string
      location: string
      type: string
      selectedType: string
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
  setDataSearch,
  resetToken
}) => {
  const optionsType = type.map((option) => ({ value: option, label: JOB_POSITION[option] }))
  const optionsPosition = posistion.map((option) => ({ value: option, label: option }))
  const optionsLocation = location.map((option) => ({ value: option, label: JOB_POSITION[option] }))

  const lowercase = (str: any) => str.toLowerCase()

  return (
    <div className='flex flex-col w-full gap-3 py-3'>
      <h1 className='mb-2 text-3xl font-bold leading-8 text-center text-green-600'>
        Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc.
      </h1>
      <form onSubmit={handleSearch}>
        <div className='flex items-center gap-4 w-[97%]'>
          <Input
            size='large'
            placeholder='Tìm kiếm theo tên'
            prefix={<UserCircleIcon />}
            className='w-full'
            value={dataSearch.key}
            onChange={(e) => setDataSearch({ ...dataSearch, key: e.target.value })}
            type='text'
            style={{ width: '100%' }}
          />

          <div className='flex items-center gap-2'>
            <button
              type='submit'
              className='flex items-center justify-center flex-shrink-0 px-4 py-2 text-white rounded-md bg-emerald-500 hover:bg-emerald-700'
            >
              Tìm kiếm
            </button>
            <button
              type='submit'
              className='flex items-center justify-center flex-shrink-0 px-4 py-2 text-white rounded-md bg-emerald-500 hover:bg-emerald-700'
              onClick={() => {
                handleReset()
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        <div className={classNames('flex gap-4 mt-4')}>
          <div className={classNames('w-1/4')}>
            <Select
              key={resetToken.toString()}
              showSearch
              style={{ width: '100%' }}
              placeholder='Vị trí'
              optionFilterProp='children'
              filterOption={(input, option) => lowercase(option?.label ?? '').includes(lowercase(input))}
              filterSort={(optionA, optionB) =>
                lowercase(optionA?.label ?? '').localeCompare(lowercase(optionB?.label ?? ''))
              }
              options={optionsPosition}
              onChange={(value) =>
                setDataSearch({
                  ...dataSearch,
                  position: value
                })
              }
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              key={resetToken.toString()}
              showSearch
              style={{ width: '100%' }}
              placeholder='Địa điểm'
              optionFilterProp='children'
              filterOption={(input, option) => lowercase(option?.label ?? '').includes(lowercase(input))}
              filterSort={(optionA, optionB) =>
                lowercase(optionA?.label ?? '').localeCompare(lowercase(optionB?.label ?? ''))
              }
              options={optionsLocation}
              onChange={(value) =>
                setDataSearch({
                  ...dataSearch,
                  location: value
                })
              }
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              key={resetToken.toString()}
              showSearch
              style={{ width: '100%' }}
              placeholder='Loại công việc'
              optionFilterProp='children'
              filterOption={(input, option) => lowercase(option?.label ?? '').includes(lowercase(input))}
              filterSort={(optionA, optionB) =>
                lowercase(optionA?.label ?? '').localeCompare(lowercase(optionB?.label ?? ''))
              }
              options={optionsType}
              onChange={(value) =>
                setDataSearch({
                  ...dataSearch,
                  selectedType: value
                })
              }
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              key={resetToken.toString()}
              showSearch
              style={{ width: '100%' }}
              placeholder='Loại công việc'
              optionFilterProp='children'
              filterOption={(input, option) => lowercase(option?.label ?? '').includes(lowercase(input))}
              filterSort={(optionA, optionB) =>
                lowercase(optionA?.label ?? '').localeCompare(lowercase(optionB?.label ?? ''))
              }
              options={optionsType}
              onChange={(value) =>
                setDataSearch({
                  ...dataSearch,
                  selectedType: value
                })
              }
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              key={resetToken.toString()}
              showSearch
              style={{ width: '100%' }}
              placeholder='Loại công việc'
              optionFilterProp='children'
              filterOption={(input, option) => lowercase(option?.label ?? '').includes(lowercase(input))}
              filterSort={(optionA, optionB) =>
                lowercase(optionA?.label ?? '').localeCompare(lowercase(optionB?.label ?? ''))
              }
              options={optionsType}
              onChange={(value) =>
                setDataSearch({
                  ...dataSearch,
                  selectedType: value
                })
              }
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              key={resetToken.toString()}
              showSearch
              style={{ width: '100%' }}
              placeholder='Loại công việc'
              optionFilterProp='children'
              filterOption={(input, option) => lowercase(option?.label ?? '').includes(lowercase(input))}
              filterSort={(optionA, optionB) =>
                lowercase(optionA?.label ?? '').localeCompare(lowercase(optionB?.label ?? ''))
              }
              options={optionsType}
              onChange={(value) =>
                setDataSearch({
                  ...dataSearch,
                  selectedType: value
                })
              }
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default FilterJobs
