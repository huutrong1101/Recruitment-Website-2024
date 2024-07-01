import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { AiFillEye } from 'react-icons/ai'
import { GrDocumentPdf } from 'react-icons/gr'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import { useAppSelector } from '../../hooks/hooks'
import { sendApplyRequestToJob } from '../../services/CandidateService'
import { LoadingStatus } from '../../types/services'
import { ResumeResponse } from '../../types/resume.type'
import { Button, Input, Modal, Pagination } from 'antd'
import { AuthService } from '../../services/AuthService'

export interface JobInformationApplyModal {
  visible: boolean
  onClose: () => void
  onApplySucceeded: () => void
  isApplied: boolean
}

export default function JobInformationApplyModal({
  visible,
  onClose,
  onApplySucceeded,
  isApplied
}: JobInformationApplyModal) {
  const { jobId } = useParams()
  const [resumeListLoadingState, setResumeListLoadingState] = useState(false)
  const [resumeList, setResumeList] = useState<ResumeResponse[]>([])
  const [resumeSelectedIndex, setResumeSelectedIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalElement, setTotalElement] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermTemp, setSearchTermTemp] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchListResume(currentPage, pageSize, searchTerm)
  }, [currentPage, pageSize, searchTerm])

  const fetchListResume = async (page: number, limit: number, searchTerm: string) => {
    setLoading(true)
    const params = { name: searchTerm, page, limit }
    try {
      const response = await AuthService.getListResume(params)
      if (response && response.data) {
        const data = response.data.metadata.listResume
        const total = response.data.metadata.totalElement
        setResumeList(data)
        setTotalElement(total)
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = () => {
    if (resumeListLoadingState) {
      return toast.warn(`Hồ sơ đang được tải lên`)
    }

    setResumeListLoadingState(true)

    const { _id } = resumeList[resumeSelectedIndex]

    if (!jobId) {
      return toast.error(`Job id cannot be undefined or null`)
    }
    sendApplyRequestToJob({ jobId, resumeId: _id })
      .then(() => {
        onApplySucceeded()
        setResumeListLoadingState(true)
        toast.success(`Hồ sơ của bạn đã được nộp và chờ được xem xét`)
      })
      .catch((error) => {
        toast.error(error.response.data.message)
        setResumeListLoadingState(false)
      })
      .finally()
  }

  const handleSelectResume = (_index: number) => {
    setResumeSelectedIndex(_index)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermTemp(e.target.value)
  }

  const handleSearch = () => {
    setSearchTerm(searchTermTemp)
  }

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page)
    setPageSize(pageSize || 5)
    setLoading(true)
  }

  return (
    <Modal
      title={'NỘP HỒ SƠ ỨNG TUYỂN'}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key='back' onClick={onClose} style={{ backgroundColor: 'transparent' }}>
          Hủy
        </Button>,
        <Button
          key='submit'
          type='primary'
          onClick={handleApply}
          disabled={resumeListLoadingState || (resumeList && resumeList.length === 0)}
          loading={resumeListLoadingState}
        >
          Nộp hồ sơ ứng tuyển
        </Button>
      ]}
      width='50%'
      className='your-custom-class-if-needed'
    >
      <div className={classNames(`flex flex-col gap-3`)}>
        <div className={`flex flex-row items-center`}>
          <h1 className={classNames(`font-light text-gray-500 flex-1`)}>Chọn hồ sơ</h1>
          <Link
            className={classNames(`text-sm hover:underline text-blue-600`, `p-2 rounded-xl`)}
            to={`/profile/resume`}
          >
            Quản lí hồ sơ
          </Link>
        </div>

        {/* Search Input */}
        <div className='flex items-center gap-2 mb-2'>
          <Input
            placeholder='Tìm kiếm hồ sơ'
            value={searchTermTemp}
            onChange={handleSearchInputChange}
            className='flex-grow'
            onPressEnter={handleSearch}
          />
          <Button onClick={handleSearch} className='text-white'>
            Tìm kiếm
          </Button>
        </div>

        <div>
          {loading ? (
            <div className={`flex flex-row items-center justify-center text-3xl`}>
              <LoadSpinner />
            </div>
          ) : (
            <div className={classNames(`flex flex-col gap-2 overflow-y-auto`)}>
              {resumeList && resumeList.length === 0 ? (
                <div className={classNames(`flex flex-col items-center justify-center  text-gray-400`, `gap-4`)}>
                  <GrDocumentPdf className={classNames(`text-3xl`)} />
                  <span>Bạn chưa có hồ sơ nào để ứng tuyển</span>
                </div>
              ) : (
                resumeList &&
                resumeList.map((resumeItem, _index) => (
                  <button
                    className={classNames(
                      `px-4 py-2 border rounded-xl hover:border-emerald-600 hover:text-emerald-600`,
                      `flex flex-row gap-4 items-center`,
                      `cursor-pointer`,
                      {
                        'bg-emerald-600 hover:text-gray-50 !text-gray-100': _index === resumeSelectedIndex
                      },
                      `text-gray-950`
                    )}
                    onClick={() => handleSelectResume(_index)}
                    key={_index}
                  >
                    <span className={classNames(`flex-1 text-left`)}>{resumeItem.title}</span>
                    <Link
                      to={`/profile/resume/edit/${resumeItem._id}`}
                      target='_blank'
                      className={classNames(`hover:bg-emerald-500 p-2 rounded-full`, `hover:text-emerald-100`)}
                    >
                      <AiFillEye />
                    </Link>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalElement}
          onChange={handlePageChange}
          className='flex items-center justify-center mt-2'
        />
      </div>
    </Modal>
  )
}
