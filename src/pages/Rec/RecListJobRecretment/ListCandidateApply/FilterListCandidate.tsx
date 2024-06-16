import React from 'react'
import { Button, Input, Select, AutoComplete } from 'antd'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { SearchOutlined } from '@ant-design/icons'
import { experiences, timeSubmits } from '../../../../utils/contanst'

const { Option } = Select

interface ActivityOption {
  value: string
  label: string
}

interface FilterPanelProps {
  candidateName: string | undefined
  setCandidateName: (value: string) => void
  workExperience: string | undefined
  setWorkExperience: (value: string) => void
  timeSubmit: string | undefined
  setTimeSubmit: (value: string) => void
  fieldOfStudy: string | undefined
  setFieldOfStudy: (value: string | undefined) => void
  resumeStatusSeleted: string | undefined
  setResumeStatusSeleted: (value: string) => void
  handleSearch: () => void
  handleResetFilters: () => void
  optionsResumeStatus: ActivityOption[]
  optionsMajors: ActivityOption[]
}

function FilterListCandidate({
  candidateName,
  setCandidateName,
  workExperience,
  setWorkExperience,
  timeSubmit,
  setTimeSubmit,
  fieldOfStudy,
  setFieldOfStudy,
  resumeStatusSeleted,
  setResumeStatusSeleted,
  handleSearch,
  handleResetFilters,
  optionsMajors,
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
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder='Kinh nghiệm làm việc'
              optionFilterProp='children'
              filterOption={(input, option) =>
                (option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
              }
              value={workExperience}
              onChange={setWorkExperience}
            >
              {experiences.map((experience) => (
                <Option key={experience.id} value={experience.name}>
                  {experience.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder='Thời gian nộp'
              optionFilterProp='children'
              filterOption={(input, option) =>
                (option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
              }
              value={timeSubmit}
              onChange={setTimeSubmit}
            >
              {timeSubmits.map((time) => (
                <Option key={time.id} value={time.name}>
                  {time.name}
                </Option>
              ))}
            </Select>
          </div>
          <div className={classNames('w-1/4')}>
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder='Ngành học'
              filterOption={(input, option) =>
                option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
              }
              options={optionsMajors}
              value={fieldOfStudy}
              onChange={setFieldOfStudy}
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
