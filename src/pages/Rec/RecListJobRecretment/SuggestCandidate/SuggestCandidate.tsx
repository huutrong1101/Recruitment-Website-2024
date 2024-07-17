import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined, FileExcelOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Pagination, Spin } from 'antd'

import * as XLSX from 'xlsx'
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks'
import { RecService } from '../../../../services/RecService'
import { checkRecUpgrade } from '../../../../redux/reducer/RecSlice'
import FilterListSuggestCandidate from './FilterListSuggestCandidate'
import ListSuggestCandidate from './ListSuggestCandidate'

function SuggestCandidate() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { jobid } = useParams()

  const { isUpgrade } = useAppSelector((state) => state.RecJobs)

  const [candidateName, setCandidateName] = useState('')
  const [workExperience, setWorkExperience] = useState<string | undefined>(undefined)
  const [educationLevel, setEducationLevel] = useState<string | undefined>(undefined)
  const [fieldOfStudy, setFieldOfStudy] = useState<string | undefined>(undefined)
  const [english, setEnglish] = useState<string | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalElement, setTotalElement] = useState(0)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [levelRequirement, setLevelRequirement] = useState('')
  const listEnglish = useAppSelector((state) => state.Job.english)

  const resumeStatus = useAppSelector((state) => state.RecJobs.listResumeStatus)
  const majors = useAppSelector((state) => state.Job.majors)
  const optionsEnglish = listEnglish.map((option) => ({ value: option, label: option }))

  const [listResume, setListResume] = useState([])

  const optionsResumeStatus = resumeStatus.map((option) => ({ value: option, label: option }))
  const optionsMajors = majors.map((option) => ({ value: option, label: option }))

  useEffect(() => {
    if (jobid) {
      RecService.getListResumeStatus(dispatch)
      RecService.getListExperienceJobApplication(dispatch, jobid)
      RecService.getEnglish(dispatch)
    }
  }, [])

  useEffect(() => {
    fetchListResume(currentPage, pageSize)
  }, [currentPage, pageSize])

  // Add useEffect to check for upgrade status
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(checkRecUpgrade()).unwrap()
      } catch (error) {
        console.error('Failed to check upgrade status:', error)
      }
    }

    fetchData()
  }, [dispatch])

  const fetchListResume = async (page: number, limit: number, searchParams = {}) => {
    setLoading(true)
    try {
      if (jobid) {
        const response = await RecService.getListSuggestRec(
          {
            ...searchParams,
            page,
            limit
          },
          jobid
        )
        if (response && response.data) {
          const data = response.data.metadata.listSuggestedCandidate
          const total = response.data.metadata.totalElement

          setListResume(data)
          setTotalElement(total)
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
    const searchParams = {
      candidateName,
      experience: workExperience,
      educationLevel: educationLevel,
      major: fieldOfStudy,
      english: english
    }

    console.log(searchParams)

    // fetchListResume(currentPage, pageSize, searchParams)
  }

  const handleResetFilters = () => {
    setFieldOfStudy(undefined)
    setCandidateName('')
    setWorkExperience(undefined)
    setEnglish(undefined)
    setEducationLevel(undefined)

    // fetchListResume(currentPage, pageSize, {})
  }

  const exportToExcel = () => {
    let data

    if (isUpgrade) {
      data = listResume.map((candidate: any) => ({
        'Họ tên': candidate.name,
        'Số điện thoại': candidate.phone,
        Email: candidate.email,
        'Học vấn': candidate.educationLevel,
        'Ngành học': candidate.major,
        'Kinh nghiệm': candidate.experience,
        'Cập nhật lần cuối': candidate.updatedAt
      }))
    } else {
      data = listResume.map((candidate: any) => ({
        'Họ tên': candidate.name,
        'Học vấn': candidate.educationLevel,
        'Ngành học': candidate.major,
        'Kinh nghiệm': candidate.experience,
        'Cập nhật lần cuối': candidate.updatedAt
      }))
    }

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ứng viên')
    XLSX.writeFile(wb, 'danh_sach_ung_vien.xlsx')
  }

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <Spin spinning={loading}>
        <div className='w-full border rounded-xl border-zinc-100'>
          <div className='flex items-center justify-center gap-5 p-2 rounded-tl-lg bg-slate-200 rounded-tr-xl'>
            <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer' }} className='font-bold' />
            <h6 className='flex-1 text-lg font-semibold uppercase'>Gợi ý ứng viên</h6>
            {isUpgrade && ( // Conditionally render the Export to Excel button
              <Button type='primary' className='flex items-center justify-center gap-2' onClick={exportToExcel}>
                <FileExcelOutlined />
                <p>Xuất file Excel</p>
              </Button>
            )}
          </div>

          <div className='p-2 mt-2'>
            <FilterListSuggestCandidate
              optionsEnglish={optionsEnglish}
              candidateName={candidateName}
              setCandidateName={setCandidateName}
              workExperience={workExperience}
              setWorkExperience={setWorkExperience}
              english={english}
              setEnglish={setEnglish}
              fieldOfStudy={fieldOfStudy}
              setFieldOfStudy={setFieldOfStudy}
              educationLevel={educationLevel}
              setEducationLevel={setEducationLevel}
              handleSearch={handleSearch}
              handleResetFilters={handleResetFilters}
              optionsMajors={optionsMajors}
              optionsResumeStatus={optionsResumeStatus}
            />
          </div>

          {jobid && listResume.length > 0 ? (
            <ListSuggestCandidate listResume={listResume} jobid={jobid} />
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
              showSizeChanger
              onShowSizeChange={(page, pageSize) => {
                setCurrentPage(page)
                setPageSize(pageSize)
                fetchListResume(page, pageSize)
              }}
              pageSizeOptions={['5', '10', '20', '30', '50']}
              locale={{ items_per_page: ' / trang' }}
            />
          </div>
        </div>
      </Spin>
    </div>
  )
}

export default SuggestCandidate
