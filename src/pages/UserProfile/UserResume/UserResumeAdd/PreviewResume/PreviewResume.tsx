import { Button, Modal, Timeline, UploadFile } from 'antd'
import moment, { Moment } from 'moment'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { FilePdfOutlined, AppstoreOutlined, FileImageOutlined } from '@ant-design/icons'
import ResumeTemp1 from './ResumeTemp1'
import ResumeTemp2 from './ResumeTemp2'
import ResumeTemp3 from './ResumeTemp3'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import resume_image_1 from '../../../../../../images/resume_1.png'
import resume_image_2 from '../../../../../../images/resume_2.jpg'
import resume_image_3 from '../../../../../../images/resume_3.png'

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

interface PreviewResumeProps {
  values: FormValues
  previewAvatar: string
  templateId: string
  type: string
  setFormValues?: React.Dispatch<React.SetStateAction<FormValues | undefined>>
}

interface ResumeTemp {
  id: string
  name: string
  image: string
}

export default function PreviewResume({ values, previewAvatar, templateId, type, setFormValues }: PreviewResumeProps) {
  const navigate = useNavigate()

  const [chooseTemplateId, setChooseTemplateId] = useState<string>(templateId || '')

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templateId || '')

  const [templateList, setTemplateList] = useState<ResumeTemp[]>([
    {
      id: '1',
      name: 'Mẫu CV 1',
      image: resume_image_1
    },
    {
      id: '2',
      name: 'Mẫu CV 2',
      image: resume_image_2
    },
    {
      id: '3',
      name: 'Mẫu CV 3',
      image: resume_image_3
    }
  ])

  const [isModalVisible, setIsModalVisible] = useState(false)

  const exportPDF = () => {
    const resumeContentElement = document.querySelector('#resumeContent')

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
          // Xử lý hoặc hiển thị lỗi ở đây
        })
    } else {
      console.error('Element #resumeContent không tồn tại.')
      // Xử lý hoặc hiển thị lỗi ở đây
    }
  }

  function renderTemplate(templateNum: string, previewAvatar: string, values: FormValues) {
    switch (templateNum) {
      case '1':
        return <ResumeTemp1 previewAvatar={previewAvatar} values={values} />
      case '2':
        return <ResumeTemp2 previewAvatar={previewAvatar} values={values} />
      case '3':
        return <ResumeTemp3 previewAvatar={previewAvatar} values={values} />
      default:
        return <div>Template không hợp lệ</div>
    }
  }

  const handleTemplateChange = (newTemplateId: string) => {
    if (type === 'create') {
      navigate(`?templateId=${newTemplateId}`, { replace: true })
    } else if (type === 'edit') {
      if (setFormValues) {
        const newFormValues = { ...values, themeId: newTemplateId }
        setFormValues(newFormValues)
      }
    }

    setSelectedTemplateId(newTemplateId)

    setIsModalVisible(false)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    handleTemplateChange(chooseTemplateId)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      {type !== 'watch' && (
        <div className='flex items-center justify-between'>
          <Button type='primary' className='flex items-center justify-center gap-2' onClick={showModal}>
            <AppstoreOutlined />
            <p>Đổi mẫu</p>
          </Button>
          <Button type='primary' className='flex items-center justify-center gap-2' onClick={exportPDF}>
            <FilePdfOutlined />
            <p>Tải file</p>
          </Button>
        </div>
      )}

      <div className='flex flex-col flex-1 gap-4 shadow-lg'>
        <div id='resumeContent'>{renderTemplate(selectedTemplateId, previewAvatar, values)}</div>
      </div>

      <Modal
        title='Chọn mẫu CV'
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width='80%'
        style={{ top: 20 }}
        okText='Chọn'
        cancelText='Hủy'
      >
        <div className='flex items-center justify-center gap-2'>
          {templateList.map((item) => (
            <div
              className={`w-full px-4 mb-8 md:w-1/3 ${chooseTemplateId === item.id ? 'border border-emerald-500' : ''}`} // Thêm độ chọn cho item được chọn
              key={item.id}
              onClick={() => setChooseTemplateId(item.id)}
              style={{ cursor: 'pointer' }}
            >
              <p>{item.name}</p>
              <img src={item.image} alt={item.name} style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}
