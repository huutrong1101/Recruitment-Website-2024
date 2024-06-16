import React, { useEffect, useState } from 'react'
import { RecService } from '../../../services/RecService'
import { Button, Pagination, Spin } from 'antd'
import RecResumeCard from './RecResumeCard'
import FilterListResume from './FilterListResume'
import { ResumeResponse } from '../../../types/resume.type'
import { Dispatch, SetStateAction } from 'react'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'
import jsPDF from 'jspdf'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import moment from 'moment'
import ResumeTemp1 from '../../UserProfile/UserResume/UserResumeAdd/PreviewResume/ResumeTemp1'
import ResumeTemp2 from '../../UserProfile/UserResume/UserResumeAdd/PreviewResume/ResumeTemp2'
import ResumeTemp3 from '../../UserProfile/UserResume/UserResumeAdd/PreviewResume/ResumeTemp3'
import html2canvas from 'html2canvas'
import ReactDOM from 'react-dom'

interface ActivityOption {
  value: string
  label: string
}

interface ResumePDF {
  name: string
  blob: Blob
}

interface RecFavoriteResumeProps {
  listResume: ResumeResponse[]
  setListResume: Dispatch<SetStateAction<ResumeResponse[]>>

  currentPage: number
  pageSize: number
  totalElement: number
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  fetchDataByTab: (activeKey: string, currentPage: number, pageSize: number) => void
  activeTabKey: string

  loading: boolean
  searchText: string | undefined
  setSearchText: (value: string) => void
  title: string | undefined
  setTitle: (value: string) => void
  english: string | undefined
  setEnglish: (value: string | undefined) => void
  jobType: string | undefined
  setJobType: (value: string | undefined) => void
  experience: string | undefined
  setExperience: (value: string | undefined) => void
  educationLevel: string | undefined
  setEducationLevel: (value: string | undefined) => void
  major: string | undefined
  setMajor: (value: string | undefined) => void
  homeTown: string | undefined
  setHomeTown: (value: string | undefined) => void

  handleSearch: () => void
  handleResetFilters: () => void
  optionsProvinces: ActivityOption[]
  optionsMajors: ActivityOption[]
  optionsEnglish: ActivityOption[]
  isAdvancedSearchModalVisible: boolean
  toggleAdvancedSearchModal: () => void
}

function RecListFavoriteResume({
  listResume,
  setListResume,
  currentPage,
  pageSize,
  totalElement,
  setCurrentPage,
  setPageSize,
  fetchDataByTab,
  activeTabKey,
  loading,
  searchText,
  setSearchText,
  title,
  setTitle,
  english,
  setEnglish,
  experience,
  setExperience,
  educationLevel,
  setEducationLevel,
  jobType,
  setJobType,
  major,
  setMajor,
  homeTown,
  setHomeTown,
  handleSearch,
  handleResetFilters,
  optionsMajors,
  optionsProvinces,
  optionsEnglish,
  isAdvancedSearchModalVisible,
  toggleAdvancedSearchModal
}: RecFavoriteResumeProps) {
  const [isModalDeleteAllVisible, setIsModalDeleteAllVisible] = useState(false)

  const handlePageChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize
    setCurrentPage(page)
    setPageSize(newPageSize)
    fetchDataByTab(activeTabKey, page, newPageSize)
  }

  const convertResumeToFormValues = (resume: ResumeResponse) => {
    const formattedEducations = resume.educations.map((edu, index) => ({
      key: index + 1,
      stt: index + 1,
      major: edu.major,
      dateRange: [edu.from ? moment(edu.from) : null, edu.to ? moment(edu.to) : null] as [
        moment.Moment | null,
        moment.Moment | null
      ]
    }))

    const formattedCertifications = resume.certifications.map((cert: any, index: number) => ({
      key: index + 1,
      stt: index + 1,
      name: cert.name,
      upload: cert.uploadFile,
      isUploaded: true,
      isUploading: false
    }))

    const formattedWorkExperiences = resume.workHistories.map((edu: any, index: number) => ({
      key: index + 1,
      stt: index + 1,
      jobDescription: {
        dateRange: [edu.from ? moment(edu.from) : null, edu.to ? moment(edu.to) : null] as [
          moment.Moment | null,
          moment.Moment | null
        ],
        company: edu.workUnit,
        jobDescription: edu.description
      }
    }))

    const formValues = {
      name: resume.name,
      title: resume.title,
      GPA: resume.GPA.toString(),
      phone: resume.phone,
      dateOfBirth: resume.dateOfBirth ? moment(resume.dateOfBirth, 'DD/MM/YYYY HH:mm:ss') : undefined,
      homeTown: resume.homeTown || '',
      experience: resume.experience || '',
      jobType: resume.jobType || '',
      educationLevel: resume.educationLevel || '',
      english: resume.english || '',
      goal: resume.goal || '',
      activity: resume.activity || '',
      email: resume.email || '',
      major: resume.major || '',
      certifications: formattedCertifications,
      educations: formattedEducations,
      workHistories: formattedWorkExperiences,
      themeId: resume.themeId
    }

    return formValues
  }

  const selectTemplateAndRenderResume = async (resume: ResumeResponse): Promise<ResumePDF> => {
    return new Promise((resolve, reject) => {
      const formValues = convertResumeToFormValues(resume)
      const previewAvatar = resume.avatar

      let TemplateComponent
      switch (resume.themeId) {
        case '1':
          TemplateComponent = ResumeTemp1
          break
        case '2':
          TemplateComponent = ResumeTemp2
          break
        case '3':
          TemplateComponent = ResumeTemp3
          break
        default:
          reject(new Error('Không tìm thấy TemplateComponent phù hợp'))
          return
      }

      const tempDiv = document.createElement('div')
      tempDiv.id = 'tempDiv'
      document.body.appendChild(tempDiv)

      ReactDOM.render(
        <TemplateComponent values={formValues} previewAvatar={previewAvatar} />,
        document.getElementById('tempDiv')
      )

      setTimeout(() => {
        const resumeContentElement = document.getElementById('tempDiv')

        if (resumeContentElement) {
          html2canvas(resumeContentElement as HTMLElement, {
            useCORS: true,
            logging: true
          })
            .then((canvas) => {
              const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
              })

              const imgData = canvas.toDataURL('image/png', 1.0)

              const imgWidth = doc.internal.pageSize.getWidth()
              const imgHeight = (canvas.height * imgWidth) / canvas.width

              doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

              const blob = doc.output('blob')

              resolve({ name: `${resume.name}-${resume.title}.pdf`, blob })

              document.body.removeChild(tempDiv)
            })
            .catch((err) => {
              console.error('Có lỗi xảy ra trong quá trình tạo PDF:', err)
              reject(err)
            })
        } else {
          reject(new Error('Element #tempDiv không tồn tại.'))
        }
      }, 1000)
    })
  }

  const processResumesSequentially = async () => {
    const zip = new JSZip()

    for (const resume of listResume) {
      try {
        const { name, blob } = await selectTemplateAndRenderResume(resume)
        zip.file(name, blob)
      } catch (error) {
        console.error('Lỗi khi tạo PDF của resume:', error)
      }
    }

    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'resume-archive.zip')
  }

  const exportAllToPDF = async () => {
    await processResumesSequentially()
  }

  const exportToExcel = () => {
    const data = listResume.map((resume: ResumeResponse) => ({
      'Họ tên': resume.name,
      'Ngày sinh': resume.dateOfBirth,
      Email: resume.email,
      'Số điện thoại': resume.phone,
      'Trình độ học vấn': resume.educationLevel,
      'Chuyên ngành': resume.major,
      'Quê quán': resume.homeTown,
      'Kinh nghiệm': resume.experience,
      'Ngoại ngữ': resume.english,
      'Cập nhật lần cuối': resume.updatedAt
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ứng viên')
    XLSX.writeFile(wb, 'danh_sach_ung_vien.xlsx')
  }

  const removeFavoriteResume = (resumeId: string) => {
    setListResume((prev) => prev.filter((resume) => resume._id !== resumeId))
  }

  const showModalDeleteAll = () => {
    setIsModalDeleteAllVisible(true)
  }

  const handleCancelDelete = () => {
    setIsModalDeleteAllVisible(false)
  }

  const deleteAllFavorite = async () => {
    try {
      await toast.promise(RecService.deleteAllFavoriteResume(), {
        pending: 'Tất cả hồ sơ đang được xóa khỏi danh sách',
        success: 'Xóa danh sách hồ sơ thành công'
      })
      setIsModalDeleteAllVisible(false)
      fetchDataByTab(activeTabKey, currentPage, pageSize)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className='mt-2'>
        <FilterListResume
          exportToExcel={exportToExcel}
          exportToPDF={exportAllToPDF}
          searchText={searchText}
          setSearchText={setSearchText}
          title={title}
          setTitle={setTitle}
          english={english}
          setEnglish={setEnglish}
          experience={experience}
          setExperience={setExperience}
          educationLevel={educationLevel}
          setEducationLevel={setEducationLevel}
          major={major}
          setMajor={setMajor}
          jobType={jobType}
          setJobType={setJobType}
          homeTown={homeTown}
          setHomeTown={setHomeTown}
          handleSearch={handleSearch}
          handleResetFilters={handleResetFilters}
          optionsMajors={optionsMajors}
          optionsProvinces={optionsProvinces}
          optionsEnglish={optionsEnglish}
          isAdvancedSearchModalVisible={isAdvancedSearchModalVisible}
          toggleAdvancedSearchModal={toggleAdvancedSearchModal}
          isShow={true}
          showModalDeleteAll={showModalDeleteAll}
          handleCancelDelete={handleCancelDelete}
          deleteAllFavorite={deleteAllFavorite}
          isModalDeleteAllVisible={isModalDeleteAllVisible}
        />
      </div>

      {loading ? (
        <div className='flex justify-center my-4'>
          <Spin size='large' />
        </div>
      ) : (
        <>
          {listResume && listResume.length > 0 ? (
            <div className='flex flex-col gap-3 mt-4'>
              {listResume.map((resume, index) => (
                <RecResumeCard key={index} resume={resume} removeFavoriteResume={removeFavoriteResume} />
              ))}
            </div>
          ) : (
            <div className='flex items-center justify-center p-4'>
              <p className='text-lg text-gray-500'>Không có hồ sơ nào trong danh sách yêu thích</p>
            </div>
          )}
          <div className='flex justify-end w-full p-2 my-2'>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalElement}
              onChange={handlePageChange}
              showSizeChanger
              onShowSizeChange={handlePageChange}
              pageSizeOptions={['5', '10', '20', '30', '50']}
              locale={{ items_per_page: ' / trang' }}
            />
          </div>
        </>
      )}
    </>
  )
}

export default RecListFavoriteResume
