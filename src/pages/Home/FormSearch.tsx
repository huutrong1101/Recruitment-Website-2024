import { useState } from 'react'
import classNames from 'classnames'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/hooks'
import { Button, Select } from 'antd'
import qs from 'query-string'

export default function FormSearch() {
  const navigate = useNavigate()
  const provinces = useAppSelector((state) => state.Job.province)
  const [search, setSearch] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')

  const optionsProvinces = provinces.map((option) => ({ value: option, label: option }))

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const params: any = {
      name: search,
      province: selectedProvince
    }

    // Filter out empty values
    const filteredParams = Object.fromEntries(Object.entries(params).filter(([key, value]) => value))

    navigate({
      pathname: '/jobs',
      search: qs.stringify(filteredParams)
    })
  }

  return (
    <div
      className={classNames(
        'flex flex-col border rounded-md shadow-md md:shadow-lg md:flex-row py-4 gap-4 mt-[40px] bg-white'
      )}
    >
      <div className={classNames('flex w-full items-center flex-shrink-0 md:w-[49%] border-r-2')}>
        <MagnifyingGlassIcon className={classNames(`w-[20px] ml-1 md:ml-4`)} />
        <input
          type='text'
          placeholder='Tìm kiếm theo tên, lương khởi điểm, kĩ năng làm việc'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={classNames('w-[85%] h-full text-[10px] md:text-[17px] ml-3 focus:outline-none')}
        />
      </div>

      <div className={classNames('flex items-center w-full gap-4 md:w-[27%] border-r-2')}>
        <Select
          showSearch
          style={{ width: '95%' }}
          placeholder='Tỉnh/Thành phố'
          filterOption={(input, option) =>
            option ? (option.label as string).toLowerCase().includes(input.toLowerCase()) : false
          }
          options={optionsProvinces}
          onChange={(value) => setSelectedProvince(value)}
        />
      </div>

      <div className={classNames('w-full md:w-[24%] flex items-center justify-center')}>
        <Button type='primary' size='large' className={'w-full mr-4'} onClick={handleSubmit}>
          Tìm kiếm
        </Button>
      </div>
    </div>
  )
}
