import React from 'react'
import { Button, Input, Select } from 'antd'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { SearchOutlined } from '@ant-design/icons'

interface ActivityOption {
  value: string
  label: string
}

interface FilterPanelProps {
  candidateName: string | undefined
  setCandidateName: (value: string) => void
  workExperience: string | undefined
  setWorkExperience: (value: string) => void
  careerGoal: string | undefined
  setCareerGoal: (value: string) => void
  fieldOfStudy: string | undefined
  setFieldOfStudy: (value: string) => void
  genderRequirementSelected: string | undefined
  setGenderRequirementSelected: (value: string) => void
  handleSearch: () => void
  handleResetFilters: () => void
  optionsGenderRequirements: ActivityOption[]
  optionsActivities: ActivityOption[]
}

function FilterListCandidate({
  candidateName,
  setCandidateName,
  workExperience,
  setWorkExperience,
  careerGoal,
  setCareerGoal,
  fieldOfStudy,
  setFieldOfStudy,
  genderRequirementSelected,
  setGenderRequirementSelected,
  handleSearch,
  handleResetFilters,
  optionsActivities,
  optionsGenderRequirements
}: FilterPanelProps) {
  return (
    <>
      <form>
        <div className='flex items-center w-full gap-4'>
          <Input
            placeholder='Họ tên ứng viên'
            prefix={<UserCircleIcon />}
            className='w-full'
            type='text'
            style={{ width: '100%' }}
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
          <div className='flex items-center gap-2'>
            <Button type='primary' icon={<SearchOutlined />} onClick={handleSearch}>
              Tìm kiếm
            </Button>
            <Button danger style={{ backgroundColor: 'transparent' }} onClick={handleResetFilters}>
              Xóa bộ lọc
            </Button>
          </div>
        </div>
        <div className={classNames('flex gap-4 mt-4')}>
          <div className={classNames('w-1/4')}>
            <Input
              placeholder='Kinh nghiệm làm việc'
              prefix={<UserCircleIcon />}
              className='w-full'
              type='text'
              style={{ width: '100%' }}
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Input
              placeholder='Mục tiêu nghề nghiệp'
              prefix={<UserCircleIcon />}
              className='w-full'
              type='text'
              style={{ width: '100%' }}
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder='Ngành học'
              filterOption={(input, option) =>
                option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
              }
              options={optionsActivities}
              value={fieldOfStudy}
              onChange={setFieldOfStudy}
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder='Yêu cầu giới tính'
              filterOption={(input, option) =>
                option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
              }
              options={optionsGenderRequirements}
              value={genderRequirementSelected}
              onChange={setGenderRequirementSelected}
            />
          </div>
        </div>
      </form>
    </>
  )
}

export default FilterListCandidate
