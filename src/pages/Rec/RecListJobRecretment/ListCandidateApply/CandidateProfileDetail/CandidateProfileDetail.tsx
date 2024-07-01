import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Checkbox, Input, Modal, Radio, Spin, UploadFile } from 'antd'
import { RecService } from '../../../../../services/RecService'
import { useAppDispatch, useAppSelector } from '../../../../../hooks/hooks'
import moment, { Moment } from 'moment'
import { toast } from 'react-toastify'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { ResumeResponse } from '../../../../../types/resume.type'
import dayjs from 'dayjs'
import PreviewResume from '../../../../UserProfile/UserResume/UserResumeAdd/PreviewResume/PreviewResume'

interface DataType {
  key: number
  stt: number
  name: string
  upload: string
  isUploaded: boolean
  isUploading: boolean
  fileList: UploadFile<any>[]
}

interface DataEducationType {
  key: number
  stt: number
  major: string
  dateRange: [moment.Moment | null, moment.Moment | null] // Use moment.Moment for dateRange
}

interface DataWorkExperienceType {
  key: number
  stt: number
  jobDescription: {
    dateRange: [moment.Moment | null, moment.Moment | null] // Use moment.Moment for dateRange
    company: string
    jobDescription: string
  }
}

interface FormValues {
  title?: string
  name?: string
  GPA?: string
  dateOfBirth?: Moment
  phone?: string
  email?: string
  major?: string
  homeTown?: string
  experience?: string
  jobType?: string
  educationLevel?: string
  english?: string
  goal?: string
  activity?: string
  avatar?: UploadFile[]
  certifications?: DataType[]
  educations?: DataEducationType[]
  workHistories?: DataWorkExperienceType[]
  themeId?: string
}

function CandidateProfileDetail() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { candidateId } = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState<FormValues | undefined>(undefined)
  const [resumeDetail, setResumeDetail] = useState<ResumeResponse | null>(null)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState('approve')
  const [selectedDeclineReasons, setSelectedDeclineReasons] = useState<string[]>([])
  const [declineReason, setDeclineReason] = useState('')
  const [checkAll, setCheckAll] = useState(false)

  console.log({ resumeDetail })

  useEffect(() => {
    if (candidateId) {
      fetchResumeDetail(candidateId)
    }
  }, [dispatch, candidateId])

  const fetchResumeDetail = async (candidateId: string) => {
    setIsLoading(true)
    try {
      const response = await RecService.getResumeDetail(candidateId)
      if (response && response.data) {
        const data = response.data.metadata
        setResumeDetail(data)

        const formattedEducations = data.educations.map((edu: any, index: number) => ({
          key: index + 1,
          stt: index + 1,
          major: edu.major,
          dateRange: [moment(edu.from), moment(edu.to)]
        }))

        const formattedCertifications = data.certifications.map((cert: any, index: number) => ({
          key: index + 1,
          stt: index + 1,
          name: cert.name,
          upload: cert.uploadFile,
          isUploaded: true,
          isUploading: false
        }))

        const formattedWorkExperiences = data.workHistories.map((edu: any, index: number) => ({
          key: index + 1,
          stt: index + 1,
          jobDescription: {
            dateRange: [moment(edu.from), moment(edu.to)],
            company: edu.workUnit,
            jobDescription: edu.description
          }
        }))

        setFormValues({
          name: data.name,
          title: data.title,
          GPA: data.GPA,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth ? moment(dayjs(data.dateOfBirth).toISOString()) : undefined,
          homeTown: data.homeTown || '',
          experience: data.experience || '',
          jobType: data.jobType || '',
          educationLevel: data.educationLevel || '',
          english: data.english || '',
          goal: data.goal || '',
          activity: data.activity || '',
          email: data.email || '',
          major: data.major || '',
          certifications: formattedCertifications,
          educations: formattedEducations,
          workHistories: formattedWorkExperiences,
          themeId: data.themeId
        })
      }
    } catch (error) {
      console.error('Error fetching resume detail:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (approvalStatus === 'approve' && resumeDetail) {
      RecService.handleResume(resumeDetail._id, 'Đã nhận', '').then(() => {
        toast.success(`Hồ sơ đã được duyệt thành công`)
      })
    } else if (approvalStatus === 'decline' && resumeDetail) {
      RecService.handleResume(resumeDetail._id, 'Không nhận', declineReason).then(() =>
        toast.success(`Hồ sơ đã được duyệt thành công`)
      )
    }
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const declineReasons = [
    { id: '1', reason: 'Không đáp ứng yêu cầu công việc' },
    { id: '2', reason: 'Số lượng ứng viên đủ' },
    { id: '3', reason: 'Không có kinh nghiệm làm việc cụ thể yêu cầu' },
    { id: '4', reason: 'CV không đủ chi tiết hoặc không chuyên nghiệp' }
  ]

  const handleCheckboxChange = (checkedValues: string[]) => {
    setSelectedDeclineReasons(checkedValues)
    const selectedReasonTexts = checkedValues.join(', ') // Tạo chuỗi từ các lý do được chọn
    setDeclineReason(selectedReasonTexts) // Cập nhật state declineReason
    setCheckAll(checkedValues.length === declineReasons.length)
  }

  const handleCheckAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked
    setCheckAll(checked)
    if (checked) {
      const allReasons = declineReasons.map((reason) => reason.reason)
      setSelectedDeclineReasons(allReasons)
      setDeclineReason(allReasons.join(', '))
    } else {
      setSelectedDeclineReasons([])
      setDeclineReason('')
    }
  }

  console.log(resumeDetail)

  return (
    <>
      {isLoading ? (
        <div className='flex justify-center items-center my-4 min-h-[70vh] w-full'>
          <Spin size='large' />
        </div>
      ) : resumeDetail ? (
        <>
          <div className='flex flex-col flex-1 gap-4'>
            <div className='w-full border rounded-xl border-zinc-100'>
              <div className='flex items-center justify-between p-2 rounded-tl-lg bg-slate-200 rounded-tr-xl'>
                <div className='flex items-center justify-center gap-5'>
                  <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer' }} className='font-bold' />
                  <h6 className='flex-1 text-lg font-semibold uppercase'>Thông tin ứng viên</h6>
                </div>
                <Button
                  className='flex items-center justify-center p-2 text-center text-white bg-red-500 border rounded-md'
                  onClick={showModal}
                >
                  XỬ LÍ HỒ SƠ
                </Button>
              </div>

              <div className='mt-1'>
                {formValues && resumeDetail && (
                  <PreviewResume
                    values={formValues}
                    previewAvatar={resumeDetail.avatar}
                    templateId={resumeDetail?.themeId}
                    type='watch'
                    setFormValues={setFormValues}
                  />
                )}
              </div>
            </div>
          </div>
          <Modal
            title='Xử lý hồ sơ'
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText='Lưu'
            cancelText='Hủy'
            cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
          >
            <div className='flex flex-col gap-1'>
              <p className='font-bold'>Chọn trạng thái xử lí hồ sơ</p>
              <Radio.Group onChange={(e) => setApprovalStatus(e.target.value)} value={approvalStatus}>
                <Radio value='approve'>Nhận hồ sơ</Radio>
                <Radio value='decline'>Không nhận hồ sơ</Radio>
              </Radio.Group>
              {/* Hiển thị ô nhập lý do nếu chọn "Không nhận hồ sơ" */}
              {approvalStatus === 'decline' && (
                <>
                  <div className='flex items-center gap-2'>
                    <div className='font-bold'>Chọn lý do không nhận hồ sơ:</div>
                    <Checkbox onChange={handleCheckAllChange} checked={checkAll}>
                      Chọn tất cả
                    </Checkbox>
                  </div>
                  <Checkbox.Group value={selectedDeclineReasons} onChange={handleCheckboxChange}>
                    <div className='flex flex-col gap-2'>
                      {declineReasons.map((reason) => (
                        <Checkbox key={reason.id} value={reason.reason}>
                          {reason.reason}
                        </Checkbox>
                      ))}
                    </div>
                  </Checkbox.Group>

                  <div>
                    <div className='font-bold'>Lý do không nhận hồ sơ:</div>
                    <Input.TextArea
                      style={{ minHeight: '200px' }}
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder='Nhập lý do không nhận hồ sơ'
                    />
                  </div>
                </>
              )}
              <p className='text-red-500'>
                Lưu ý: Nhận hồ sơ không có nghĩa là tuyển dụng ứng viên. Tiếp theo, nhà tuyển dụng cần liên hệ với ứng
                viên để đặt lịch phỏng vấn
              </p>
            </div>
          </Modal>
        </>
      ) : (
        <div className='flex items-center justify-center w-full'>
          <p>Không tìm thấy hồ sơ phù hợp</p>
        </div>
      )}
    </>
  )
}

export default CandidateProfileDetail
