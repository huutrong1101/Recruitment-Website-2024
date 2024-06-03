import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined, FileExcelOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Pagination, Spin } from 'antd'
import * as XLSX from 'xlsx'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { RecService } from '../../../services/RecService'
import FilterListCandidate from '../RecListJobRecretment/ListCandidateApply/FilterListCandidate'
import ListCandidate from '../RecListJobRecretment/ListCandidateApply/ListCandidate'

function RecFindCandidate() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { jobid } = useParams()

  const [candidateName, setCandidateName] = useState('')
  const [workExperience, setWorkExperience] = useState<string | undefined>(undefined)
  const [careerGoal, setCareerGoal] = useState('')
  const [fieldOfStudy, setFieldOfStudy] = useState<string | undefined>(undefined)
  const [resumeStatusSeleted, setResumeStatusSeleted] = useState<string | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalElement, setTotalElement] = useState(0)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [levelRequirement, setLevelRequirement] = useState('')
  const [numOfCVs, setNumOfCVs] = useState(0)

  const resumeStatus = useAppSelector((state) => state.RecJobs.listResumeStatus)
  const resumeExperience = useAppSelector((state) => state.RecJobs.listExperienceJobApplication)
  const [listResume, setListResume] = useState([])

  const optionsResumeExperience = resumeExperience.map((option) => ({ value: option, label: option }))
  const optionsResumeStatus = resumeStatus.map((option) => ({ value: option, label: option }))

  useEffect(() => {
    if (jobid) {
      RecService.getListResumeStatus(dispatch)
      RecService.getListExperienceJobApplication(dispatch, jobid)
    }
  }, [])

  console.log(listResume)

  useEffect(() => {
    fetchListResume(currentPage, pageSize)
  }, [currentPage, pageSize])

  const fetchListResume = async (page: number, limit: number, searchParams = {}) => {
    setLoading(true) // Bắt đầu tải dữ liệu, set loading là true
    try {
      if (jobid) {
        const response = await RecService.getListResumeOfRec(
          {
            ...searchParams,
            page,
            limit
          },
          jobid
        )
        if (response && response.data) {
          const data = response.data.metadata.listApplication
          const total = response.data.metadata.totalElement
          const name = response.data.metadata.name
          const levelRequirement = response.data.metadata.levelRequirement
          setListResume(data)
          setTotalElement(total)
          setName(name)
          setLevelRequirement(levelRequirement)
        }
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
      // Bạn có thể thêm xử lý lỗi tại đây nếu muốn
    } finally {
      setLoading(false) // Hoàn thành tải dữ liệu, set loading là false
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleSearch = () => {
    console.log('Họ tên ứng viên:', candidateName)
    console.log('Kinh nghiệm làm việc:', workExperience)
    console.log('Mục tiêu nghề nghiệp:', careerGoal)
    console.log('Ngành học:', fieldOfStudy)

    const searchParams = {
      candidateName,
      experience: workExperience,
      status: resumeStatusSeleted,
      major: fieldOfStudy,
      goal: careerGoal
    }

    fetchListResume(currentPage, pageSize, searchParams)
  }

  const handleResetFilters = () => {
    setFieldOfStudy(undefined)
    setCandidateName('')
    setWorkExperience('')
    setCareerGoal('')
    setResumeStatusSeleted(undefined)

    fetchListResume(currentPage, pageSize, {})
  }

  console.log(listResume)

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <Spin spinning={loading}>
        <div className='w-full border rounded-xl border-zinc-100'>
          <div className='flex items-center justify-center gap-5 p-2 rounded-tl-lg bg-slate-200 rounded-tr-xl'>
            <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer' }} className='font-bold' />
            <h6 className='flex-1 text-lg font-semibold uppercase'>TÌM KIẾM ỨNG VIÊN</h6>
          </div>
          <div className='p-2 mt-2'>
            <FilterListCandidate
              candidateName={candidateName}
              setCandidateName={setCandidateName}
              workExperience={workExperience}
              setWorkExperience={setWorkExperience}
              careerGoal={careerGoal}
              setCareerGoal={setCareerGoal}
              fieldOfStudy={fieldOfStudy}
              setFieldOfStudy={setFieldOfStudy}
              resumeStatusSeleted={resumeStatusSeleted}
              setResumeStatusSeleted={setResumeStatusSeleted}
              handleSearch={handleSearch}
              handleResetFilters={handleResetFilters}
              optionsResumeExperience={optionsResumeExperience}
              optionsResumeStatus={optionsResumeStatus}
            />
          </div>

          {jobid && listResume.length > 0 ? (
            <ListCandidate listResume={listResume} jobid={jobid} />
          ) : (
            <div className='flex items-center justify-center p-4'>
              <p className='text-lg text-gray-500'>Không tìm thấy hồ sơ ứng tuyển phù hợp.</p>
            </div>
          )}
          <div className='flex justify-end w-full p-2 my-2'>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalElement}
              onChange={(page, pageSize) => {
                setCurrentPage(page)
                setPageSize(pageSize)
                fetchListResume(page, pageSize)
              }}
            />
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default RecFindCandidate
