import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Modal, Spin } from 'antd'
import moment, { Moment } from 'moment'
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks'
import { RecService } from '../../../../services/RecService'
import { UploadFile } from 'antd/lib'
import dayjs from 'dayjs'
import PreviewResume from '../../../UserProfile/UserResume/UserResumeAdd/PreviewResume/PreviewResume'
import { ResumeResponse } from '../../../../types/resume.type'
import { FilePdfOutlined, HeartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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

function ResumeDetail() {
  const navigate = useNavigate()

  const { resumeId } = useParams()

  const { recruiter } = useAppSelector((state) => state.Auth)

  const [formValues, setFormValues] = useState<FormValues | undefined>(undefined)
  const [resumeDetail, setResumeDetail] = useState<ResumeResponse | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isFavoriteModalVisible, setIsFavoriteModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (resumeId) {
      fetchResumeDetail(resumeId)
    }
  }, [resumeId])

  useEffect(() => {
    if (recruiter && resumeDetail) {
      RecService.getIfRecFavoriteTheResume(resumeDetail._id)
        .then((response) => {
          setIsFavorite(response.data.metadata.exist)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [recruiter, resumeDetail])

  const fetchResumeDetail = async (resumeId: string) => {
    setIsLoading(true)
    try {
      const response = await RecService.getResumeDetailFromResumeId(resumeId)
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

  const showFavoriteModal = () => {
    setIsFavoriteModalVisible(true)
  }

  // Xử lý khi nhấn vào nút cancel trên Modal
  const handleCancel = () => {
    setIsFavoriteModalVisible(false)
  }

  const toggleFavorite = () => {
    if (isFavorite) {
      handleRemoveFavorite()
    } else {
      handleAddFavorite()
    }
  }

  const handleAddFavorite = async () => {
    toast
      .promise(RecService.saveFavoriteResume(resumeId), {
        pending: `Hồ sơ đang được lưu vào danh sách`,
        success: `Lưu hồ sơ vào mục yêu thích`
      })
      .then(() => {
        setIsFavorite(true)
        setIsFavoriteModalVisible(false)
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const handleRemoveFavorite = async () => {
    toast
      .promise(RecService.removeFavoriteResume(resumeId), {
        pending: `Hồ sơ đang được xóa khỏi danh sách`,
        success: `Xóa hồ sơ khỏi mục yêu thích`
      })
      .then(() => {
        setIsFavorite(false)
        setIsFavoriteModalVisible(false)
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const exportPDF = () => {
    const resumeContentElement = document.getElementById('resumeContent')

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
          doc.save('resume.pdf')
        })
        .catch((error) => {
          console.error('Lỗi khi tạo PDF:', error)
        })
    } else {
      console.error('Element #resumeContent không tồn tại.')
    }
  }

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
                <div className='flex items-center justify-center gap-3'>
                  <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer' }} className='font-bold' />
                  <h6 className='flex-1 text-lg font-semibold uppercase'>Thông tin hồ sơ</h6>
                </div>
                <div className='flex items-center gap-2'>
                  {isFavorite ? (
                    <Button
                      type='primary'
                      onClick={showFavoriteModal}
                      className='flex items-center justify-center gap-2'
                    >
                      <HeartOutlined />
                      <p>Hủy lưu hồ sơ</p>
                    </Button>
                  ) : (
                    <Button
                      type='primary'
                      onClick={showFavoriteModal}
                      className='flex items-center justify-center gap-2'
                    >
                      <HeartOutlined />
                      <p>Lưu hồ sơ</p>
                    </Button>
                  )}

                  <Button type='primary' className='flex items-center justify-center gap-2' onClick={exportPDF}>
                    <FilePdfOutlined />
                    <p>Tải file</p>
                  </Button>

                  <Modal
                    title={isFavorite ? 'Bỏ khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
                    visible={isFavoriteModalVisible}
                    onOk={toggleFavorite}
                    onCancel={handleCancel}
                    okText={isFavorite ? 'Bỏ yêu thích' : 'Lưu'}
                    cancelText='Hủy'
                    cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
                    width={450}
                  >
                    <p>
                      Bạn có muốn {isFavorite ? 'bỏ hồ sơ này khỏi' : 'thêm hồ sơ này vào'} danh sách yêu thích không?
                    </p>
                  </Modal>
                </div>
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
        </>
      ) : (
        <div className='flex items-center justify-center w-full'>
          <p>Không tìm thấy hồ sơ phù hợp</p>
        </div>
      )}
    </>
  )
}

export default ResumeDetail
