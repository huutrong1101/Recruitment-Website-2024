import React from 'react'
import classNames from 'classnames'
import { Button, Input, Select } from 'antd'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { SearchOutlined } from '@ant-design/icons'

interface FilterJobsProps {
  dataSearch: {
    key: string
    selectedProvince: string
    selectedExperiences: string
    selectedActivity: string
    selectedLevelRequirements: string
    selectedGenderRequirements: string
    selectedJobTypes: string
  }
  // Update để chấp nhận các List mới thay vì chỉ vị trí và loại
  provinces: string[]
  experiences: string[]
  jobTypes: string[]
  levelRequirements: string[]
  genderRequirements: string[]
  activities: string[]
  resetToken: number
  handleSearch: (e: React.FormEvent) => void
  handleReset: () => void
  setDataSearch: React.Dispatch<
    React.SetStateAction<{
      key: string
      selectedProvince: string
      selectedExperiences: string
      selectedActivity: string
      selectedLevelRequirements: string
      selectedGenderRequirements: string
      selectedJobTypes: string
    }>
  >
}

const FilterJobs: React.FC<FilterJobsProps> = ({
  dataSearch,
  provinces,
  experiences,
  jobTypes,
  levelRequirements,
  genderRequirements,
  activities,
  handleSearch,
  handleReset,
  setDataSearch,
  resetToken
}) => {
  const optionsProvinces = provinces.map((option) => ({ value: option, label: option }))
  const optionsExperiences = experiences.map((option) => ({ value: option, label: option }))
  const optionsJobTypes = jobTypes.map((option) => ({ value: option, label: option }))
  const optionsLevelRequirements = levelRequirements.map((option) => ({ value: option, label: option }))
  const optionsGenderRequirements = genderRequirements.map((option) => ({ value: option, label: option }))
  const optionsActivities = activities.map((option) => ({ value: option, label: option }))

  const lowercase = (str: any) => str.toLowerCase()

  return (
    <div className='flex flex-col w-full gap-3 py-3'>
      <h1 className='mb-2 text-3xl font-bold leading-8 text-center text-green-600'>
        Tìm việc làm nhanh 24h, việc làm mới nhất trên toàn quốc.
      </h1>
      <form onSubmit={handleSearch}>
        <div className='flex items-center w-full gap-4'>
          <Input
            placeholder='Tìm kiếm theo tên'
            prefix={<UserCircleIcon />}
            className='w-full'
            value={dataSearch.key}
            onChange={(e) => setDataSearch({ ...dataSearch, key: e.target.value })}
            type='text'
            style={{ width: '100%' }}
          />

          <div className='flex items-center gap-2'>
            <Button type='primary' onClick={handleSearch} icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
            <Button danger onClick={handleReset} style={{ backgroundColor: 'transparent' }}>
              Xóa bộ lọc
            </Button>
          </div>
        </div>

        <div className={classNames('flex gap-4 mt-4')}>
          <div className={classNames('w-1/4')}>
            <Select
              key={resetToken.toString()}
              showSearch
              style={{ width: '100%' }}
              placeholder='Tỉnh/Thành phố'
              filterOption={(input, option) =>
                option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
              }
              options={optionsProvinces}
              onChange={(value) => setDataSearch({ ...dataSearch, selectedProvince: value })}
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              key={resetToken.toString()}
              showSearch
              style={{ width: '100%' }}
              placeholder='Kinh nghiệm'
              filterOption={(input, option) =>
                option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
              }
              options={optionsExperiences}
              onChange={(value) => setDataSearch({ ...dataSearch, selectedExperiences: value })}
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              key={resetToken.toString()}
              showSearch
              style={{ width: '100%' }}
              placeholder='Lĩnh vực'
              filterOption={(input, option) =>
                option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
              }
              options={optionsActivities}
              onChange={(value) => setDataSearch({ ...dataSearch, selectedActivity: value })}
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              key={resetToken.toString()}
              showSearch
              style={{ width: '100%' }}
              placeholder='Vị trí'
              filterOption={(input, option) =>
                option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
              }
              options={optionsLevelRequirements}
              onChange={(value) => setDataSearch({ ...dataSearch, selectedLevelRequirements: value })}
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              key={resetToken.toString()}
              showSearch
              style={{ width: '100%' }}
              placeholder='Yêu cầu giới tính'
              filterOption={(input, option) =>
                option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
              }
              options={optionsGenderRequirements}
              onChange={(value) => setDataSearch({ ...dataSearch, selectedGenderRequirements: value })}
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              key={resetToken.toString()}
              showSearch
              style={{ width: '100%' }}
              placeholder='Loại hình'
              filterOption={(input, option) =>
                option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
              }
              options={optionsJobTypes}
              onChange={(value) => setDataSearch({ ...dataSearch, selectedJobTypes: value })}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default FilterJobs
