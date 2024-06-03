import React from 'react'
import { Button, Input, Select, AutoComplete } from 'antd'
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
  resumeStatusSeleted: string | undefined
  setResumeStatusSeleted: (value: string) => void
  handleSearch: () => void
  handleResetFilters: () => void
  optionsResumeStatus: ActivityOption[]
  optionsResumeExperience: ActivityOption[]
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
  resumeStatusSeleted,
  setResumeStatusSeleted,
  handleSearch,
  handleResetFilters,
  optionsResumeExperience,
  optionsResumeStatus
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
            <AutoComplete
              style={{ width: '100%' }}
              placeholder='Kinh nghiệm'
              options={optionsResumeExperience}
              value={workExperience}
              onChange={setWorkExperience}
              filterOption={(inputValue, option) =>
                option?.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
              }
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
            <Input
              placeholder='Ngành học'
              prefix={<UserCircleIcon />}
              className='w-full'
              type='text'
              style={{ width: '100%' }}
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
            />
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder='Trạng thái hồ sơ'
              options={optionsResumeStatus}
              filterOption={(input, option) => option?.label.toLowerCase().includes(input.toLowerCase()) ?? false}
              value={resumeStatusSeleted}
              onChange={setResumeStatusSeleted}
            />
          </div>
        </div>
      </form>
    </>
  )
}

export default FilterListCandidate
