import React from 'react'
import { Button, Input, Select, AutoComplete } from 'antd'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { SearchOutlined } from '@ant-design/icons'
import { educationLevels, experiences, timeSubmits } from '../../../../utils/contanst'

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
  english: string | undefined
  setEnglish: (value: string) => void
  fieldOfStudy: string | undefined
  setFieldOfStudy: (value: string | undefined) => void
  educationLevel: string | undefined
  setEducationLevel: (value: string) => void
  handleSearch: () => void
  handleResetFilters: () => void
  optionsResumeStatus: ActivityOption[]
  optionsMajors: ActivityOption[]
  optionsEnglish: ActivityOption[]
}

function FilterListSuggestCandidate({
  candidateName,
  setCandidateName,
  workExperience,
  setWorkExperience,
  english,
  setEnglish,
  fieldOfStudy,
  setFieldOfStudy,
  educationLevel,
  setEducationLevel,
  handleSearch,
  handleResetFilters,
  optionsMajors,
  optionsEnglish
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
              placeholder='Học vấn'
              optionFilterProp='children'
              filterOption={(input, option) =>
                (option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
              }
              value={educationLevel}
              onChange={setEducationLevel}
            >
              {educationLevels.map((level) => (
                <Option key={level.id} value={level.name}>
                  {level.name}
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
            <AutoComplete
              options={optionsEnglish}
              placeholder='Trình độ ngoại ngữ'
              value={english}
              onChange={(value) => setEnglish(value)} // chỉ cần truyền 'value' thẳng vào 'setEnglish'
              style={{ width: '100%', textAlign: 'left' }}
              filterOption={(inputValue, option) =>
                !!option && option.label.toUpperCase().includes(inputValue.toUpperCase())
              }
            />
          </div>
        </div>
      </form>
    </>
  )
}

export default FilterListSuggestCandidate
