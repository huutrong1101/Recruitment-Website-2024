import React, { useState } from 'react'
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Pagination } from 'antd'
import classNames from 'classnames'
import { useAppSelector } from '../../../../hooks/hooks'
import FilterListCandidate from './FilterListCandidate'
import ListCandidate from './ListCandidate'

function ListCandidateApply() {
  const navigate = useNavigate()

  const [candidateName, setCandidateName] = useState('')
  const [workExperience, setWorkExperience] = useState('')
  const [careerGoal, setCareerGoal] = useState('')
  const [fieldOfStudy, setFieldOfStudy] = useState<string | undefined>(undefined)
  const [genderRequirementSelected, setGenderRequirementSelected] = useState<string | undefined>(undefined)

  const genderRequirement = useAppSelector((state) => state.Job.genderRequirement)
  const activities = useAppSelector((state) => state.Job.activities)

  const optionsGenderRequirements = genderRequirement.map((option) => ({ value: option, label: option }))
  const optionsActivities = activities.map((option) => ({ value: option, label: option }))

  const handleBack = () => {
    navigate(-1)
  }

  const handleSearch = () => {
    console.log('Họ tên ứng viên:', candidateName)
    console.log('Kinh nghiệm làm việc:', workExperience)
    console.log('Mục tiêu nghề nghiệp:', careerGoal)
    console.log('Ngành học:', fieldOfStudy)
    console.log('Yêu cầu giới tính:', genderRequirementSelected)

    // Logic gửi dữ liệu đi hoặc lọc kết quả tại đây...
  }

  const handleResetFilters = () => {
    setFieldOfStudy(undefined)
    setGenderRequirementSelected(undefined)
    setCandidateName('')
    setWorkExperience('')
    setCareerGoal('')
  }

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='w-full border rounded-xl border-zinc-100'>
        <div className='flex items-center justify-center gap-5 p-2 rounded-tl-lg bg-slate-200 rounded-tr-xl'>
          <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer' }} className='font-bold' />
          <h6 className='flex-1 text-lg font-semibold uppercase'>Hồ sơ ứng tuyển</h6>
        </div>
        <div className='p-2'>
          <p className='text-base'>
            Đã có <span>1</span> CV ứng tuyển vào vị trí ... cho công việc ...
          </p>
        </div>
        <div className='p-2'>
          <FilterListCandidate
            candidateName={candidateName}
            setCandidateName={setCandidateName}
            workExperience={workExperience}
            setWorkExperience={setWorkExperience}
            careerGoal={careerGoal}
            setCareerGoal={setCareerGoal}
            fieldOfStudy={fieldOfStudy}
            setFieldOfStudy={setFieldOfStudy}
            genderRequirementSelected={genderRequirementSelected}
            setGenderRequirementSelected={setGenderRequirementSelected}
            handleSearch={handleSearch}
            handleResetFilters={handleResetFilters}
            optionsGenderRequirements={optionsGenderRequirements}
            optionsActivities={optionsActivities}
          />
        </div>
        <ListCandidate />
        <div className='flex justify-end w-full p-2 my-2'>
          <Pagination defaultCurrent={1} total={50} />
        </div>
      </div>
    </div>
  )
}

export default ListCandidateApply
