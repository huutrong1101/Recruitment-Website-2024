import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Upload, Select, DatePicker, message, Modal, AutoComplete } from 'antd'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Table } from 'antd'
const { Option } = Select
import type { TableColumnsType } from 'antd'
import { TrashIcon } from '@heroicons/react/24/outline'
import moment, { Moment } from 'moment'
import { Dayjs } from 'dayjs'
import { toast } from 'react-toastify'
import { UserService } from '../../../../services/UserService'
import { UploadOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons'
import { UploadFile } from 'antd/lib'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { pdfjs } from 'react-pdf'
import ReactDOM from 'react-dom'
import { zoomPlugin } from '@react-pdf-viewer/zoom'
import { printPlugin, RenderPrintProps } from '@react-pdf-viewer/print'
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation'

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/zoom/lib/styles/index.css'
import '@react-pdf-viewer/print/lib/styles/index.css'
import '@react-pdf-viewer/page-navigation/lib/styles/index.css'
import { UploadChangeParam } from 'antd/es/upload'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import { useDebounceEffect } from '../../AvatarCrop/useDebounceEffect'
import { canvasPreview } from '../../AvatarCrop/canvasPreview'
import { validateEmail, validateGPA, validatePhone } from '../../../../utils/validation'
import { educationLevels, experiences, jobTypes } from '../../../../utils/contanst'
import { useAppSelector } from '../../../../hooks/hooks'
import ShowResume from './PreviewResume/PreviewResume'
import PreviewResume from './PreviewResume/PreviewResume'

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`

interface UploadPropsWithChildren {
  onRemove: () => void
  beforeUpload: (file: any) => boolean
  fileList: UploadFile<any>[]
  children?: React.ReactNode
}

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
}

interface MajorOption {
  value: string
  label: string
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

function UserResumeAdd() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [formValues, setFormValues] = useState<FormValues | undefined>(undefined)

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const templateId = searchParams.get('templateId')

  const provinces = useAppSelector((state) => state.Job.province)
  const majors = useAppSelector((state) => state.Job.majors)
  const optionsProvinces = provinces.map((option) => ({ value: option, label: option }))
  const optionsMajors: MajorOption[] = majors.map((option) => ({
    value: option,
    label: option
  }))

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  // const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState<number | undefined>(16 / 9)

  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [previewAvatar, setPreviewAvatar] = useState('')
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const [educations, setEducations] = useState<DataEducationType[]>([])
  const [workExperiences, setWorkExperiences] = useState<DataWorkExperienceType[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploadStates, setUploadStates] = useState<
    Record<string | number | symbol, { isUploaded: boolean; isUploading: boolean }>
  >({})
  const [shown, setShown] = useState(false)
  const [previewPDF, setPreviewPDF] = useState('')
  const zoomPluginInstance = zoomPlugin()
  const printPluginInstance = printPlugin()
  const pageNavigationPluginInstance = pageNavigationPlugin()

  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance
  const { PrintButton } = printPluginInstance
  const { CurrentPageInput, GoToNextPageButton, GoToPreviousPage } = pageNavigationPluginInstance

  useEffect(() => {
    const newFormValues: FormValues = {
      ...formValues,
      certifications: dataSource,
      educations: educations,
      workHistories: workExperiences
    }
    // Cập nhật formValues
    setFormValues(newFormValues)
    // Cập nhật trạng thái của form với Ant Design Form
    form.setFieldsValue(newFormValues)
  }, [dataSource, educations, workExperiences])

  const handleFormChange = (changedValues: any, allValues: any) => {
    setFormValues(allValues)
  }

  const modalBody = () => (
    <Modal
      title='PDF Viewer'
      open={shown}
      onCancel={() => setShown(false)}
      footer={null}
      width='80%'
      style={{ top: 20 }}
      bodyStyle={{ overflowY: 'auto', maxHeight: '80vh' }}
    >
      <Worker workerUrl='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js'>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', justifyContent: 'end' }}>
          <ZoomInButton />
          <ZoomPopover />
          <ZoomOutButton />

          <PrintButton />

          <GoToPreviousPage />
          <CurrentPageInput />
          <GoToNextPageButton />
        </div>
        <Viewer
          fileUrl={previewPDF}
          plugins={[zoomPluginInstance, printPluginInstance, pageNavigationPluginInstance]}
        />
      </Worker>
    </Modal>
  )

  const certificationColumns: TableColumnsType<DataType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      align: 'center',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>
    },
    {
      title: 'TÊN CHỨNG CHỈ',
      dataIndex: 'name',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Input
          placeholder='Tên chứng chỉ'
          value={record.name}
          onChange={(e) => handleChangeName(record.key, e.target.value)}
          style={{ textAlign: 'center' }}
        />
      )
    },
    {
      title: 'UPLOAD CHỨNG CHỈ',
      dataIndex: 'upload',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <div className='flex items-center justify-center gap-1'>
          <Upload {...generateUploadProps(record)}>
            {record.isUploading ? (
              <Button icon={<LoadingOutlined />} size='small'>
                Đang tải...
              </Button>
            ) : record.isUploaded ? (
              <Button icon={<UploadOutlined />} size='small'>
                Chọn Tệp Khác
              </Button>
            ) : (
              <Button icon={<UploadOutlined />}>Chọn Tệp</Button>
            )}
          </Upload>
          {record.isUploaded && (
            <Button icon={<EyeOutlined />} onClick={() => previewFile(record.upload || '')} size='small'>
              Xem Trước
            </Button>
          )}
        </div>
      )
    },
    {
      title: 'HÀNH ĐỘNG',
      dataIndex: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <button onClick={() => handleDelete(record.key, 'certifications')}>
          <TrashIcon className='w-6 h-6 text-red-500' />
        </button>
      )
    }
  ]

  const educationColumns: TableColumnsType<DataEducationType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      align: 'center',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>
    },
    {
      title: 'TỪ NGÀY - ĐẾN NGÀY',
      dataIndex: 'dateRange',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <DatePicker.RangePicker
          style={{ width: '100%' }}
          format='DD/MM/YYYY'
          placeholder={['Bắt đầu', 'Kết thúc']}
          value={record.dateRange as [Dayjs | null, Dayjs | null]}
          onChange={(dates) => handleDateRangeChange(record.key, dates as [Dayjs | null, Dayjs | null])}
        />
      )
    },
    {
      title: 'CHUYÊN NGÀNH',
      dataIndex: 'major',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <AutoComplete
          options={optionsMajors}
          placeholder='Chuyên ngành'
          value={record.major}
          onChange={(value) => handleChangeMajor(record.key, value)}
          style={{ width: '100%', textAlign: 'left' }}
          filterOption={(inputValue, option) =>
            // Đảm bảo rằng giá trị trả về luôn là boolean bằng cách sử dụng toán tử && (Logical AND)
            !!option && option.label.toUpperCase().includes(inputValue.toUpperCase())
          }
        />
      )
    },
    {
      title: 'HÀNH ĐỘNG',
      dataIndex: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <button onClick={() => handleDeleteEducation(record.key)}>
          <TrashIcon className='w-6 h-6 text-red-500' />
        </button>
      )
    }
  ]

  const workExperienceColumns: TableColumnsType<DataWorkExperienceType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      align: 'center',
      render: (text) => <div style={{ textAlign: 'center' }}>{text}</div>
    },
    {
      title: 'MÔ TẢ CÔNG VIỆC',
      dataIndex: 'jobDescription',
      align: 'center',
      render: (_, record) => (
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-center gap-2'>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format='DD/MM/YYYY'
              placeholder={['Bắt đầu', 'Kết thúc']}
              value={record.jobDescription.dateRange as [Dayjs | null, Dayjs | null]}
              onChange={(dates) => handleDateWorkRangeChange(record.key, dates as [Dayjs | null, Dayjs | null])}
            />
            <Input
              placeholder='Đơn vị công tác'
              value={record.jobDescription.company}
              onChange={(e) => handleChangeCompany(record.key, e.target.value)}
              style={{ marginBottom: '5px' }}
            />
          </div>

          <Input.TextArea
            placeholder='Mô tả công việc'
            value={record.jobDescription.jobDescription}
            onChange={(e) => handleChangeJobDescription(record.key, e.target.value)}
            style={{ height: '120px' }}
          />
        </div>
      )
    },
    {
      title: 'HÀNH ĐỘNG',
      dataIndex: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <button onClick={() => handleDeleteWorkExperience(record.key)}>
          <TrashIcon className='w-6 h-6 text-red-500' />
        </button>
      )
    }
  ]

  const handleBack = () => {
    navigate(-1)
  }

  const generateUploadProps = (record: DataType) => {
    const { key, upload } = record

    const uploadProps: UploadPropsWithChildren = {
      onRemove: () => {
        setFileList([])
        setUploadStates((prevStates) => ({
          ...prevStates,
          [key]: { isUploaded: false, isUploading: false }
        }))
      },
      beforeUpload: (file: any) => {
        autoUploadFile(file, record)
        return false
      },
      fileList
    }
    return uploadProps
  }

  const previewFile = (fileUrl: string) => {
    setPreviewPDF(fileUrl)
    setShown(true)
  }

  const getBase64 = (file: Blob, callback: (imageUrl: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(file)
  }

  const onAvatarUploadChange = (info: UploadChangeParam<UploadFile>) => {
    // Lấy file mới nhất từ danh sách fileList
    const latestFile = info.fileList.slice(-1)[0]?.originFileObj

    if (latestFile) {
      // Sử dụng hàm getBase64 để lấy chuỗi base64 và cập nhật vào previewAvatar
      getBase64(latestFile, (imageUrl) => {
        setPreviewAvatar(imageUrl)
      })
    }
  }

  const autoUploadFile = async (file: UploadFile, record: DataType) => {
    const updatedDataSource = dataSource.map((item) =>
      item.key === record.key ? { ...item, isUploading: true } : item
    )
    setDataSource(updatedDataSource)

    const formData = new FormData()
    formData.append('uploadFile', file as any)

    try {
      if (record.upload) {
        UserService.deleteCertification(record.upload)
      }

      const response = await UserService.uploadCertification(formData)

      const { uploadFile } = response.data.metadata

      const updatedDataSource = dataSource.map((item) =>
        item.key === record.key ? { ...item, upload: uploadFile, isUploaded: true, isUploading: false } : item
      )

      setDataSource(updatedDataSource)
    } catch (error) {
      console.error('Upload error:', error)
      message.error('Tải lên thất bại.')
      setUploadStates((prevStates) => ({
        ...prevStates,
        [record.key]: { isUploaded: false, isUploading: false }
      }))
    }
  }

  const handleAdd = (type: string) => {
    if (type === 'certifications') {
      const newKey = dataSource.length > 0 ? dataSource[dataSource.length - 1].key + 1 : 1
      const newItem: DataType = {
        key: newKey,
        stt: newKey,
        name: '',
        upload: '',
        isUploaded: false,
        isUploading: false,
        fileList: []
      }
      const newDataSource = [...dataSource, newItem]
      setDataSource(newDataSource)

      setFormValues((currentValues) => ({
        ...currentValues!,
        certifications: newDataSource
      }))
    } else if (type === 'educations') {
      const newKey = educations.length > 0 ? educations[educations.length - 1].key + 1 : 1
      const newItem: DataEducationType = { key: newKey, stt: newKey, dateRange: [null, null], major: '' }
      const newEducations = [...educations, newItem]
      setEducations(newEducations)

      // Đồng bộ hoá với formValues
      setFormValues((currentValues) => ({
        ...currentValues!,
        educations: newEducations
      }))
    }
  }

  const handleDelete = (key: React.Key, type: string) => {
    if (type === 'certifications') {
      const deletedData = dataSource.find((item) => item.key === key)
      const updatedDataSource = dataSource.filter((item) => item.key !== key)
      if (deletedData && deletedData.upload && deletedData.upload) {
        UserService.deleteCertification(deletedData.upload)
      }
      setDataSource(updatedDataSource)
    } else if (type === 'educations') {
      const updatedEducations = educations.filter((item) => item.key !== key)
      setEducations(updatedEducations)
    }
  }

  const handleChangeName = (key: React.Key, value: string) => {
    const updatedDataSource = dataSource.map((item) => (item.key === key ? { ...item, name: value } : item))
    setDataSource(updatedDataSource)
  }

  const handleDateRangeChange = (key: React.Key, dates: [Dayjs | null, Dayjs | null]) => {
    // Convert dates to moment types before updating state
    const convertedDates: [moment.Moment | null, moment.Moment | null] = [
      dates[0] ? moment(dates[0].toDate()) : null,
      dates[1] ? moment(dates[1].toDate()) : null
    ]
    setEducations(
      educations.map((item) => {
        if (item.key === key) {
          return { ...item, dateRange: convertedDates }
        }
        return item
      })
    )
  }

  const handleChangeMajor = (key: React.Key, value: string) => {
    const updatedEducations = educations.map((item) => (item.key === key ? { ...item, major: value } : item))
    setEducations(updatedEducations)
  }

  const handleDeleteEducation = (key: React.Key) => {
    const updatedEducations = educations.filter((item) => item.key !== key)
    setEducations(updatedEducations)
  }

  const handleAddWorkExperience = () => {
    const newKey = workExperiences.length > 0 ? workExperiences[workExperiences.length - 1].key + 1 : 1
    const newItem: DataWorkExperienceType = {
      key: newKey,
      stt: newKey,
      jobDescription: {
        dateRange: [null, null],
        company: '',
        jobDescription: ''
      }
    }

    setWorkExperiences([...workExperiences, newItem])
  }

  const handleDateWorkRangeChange = (key: React.Key, dates: [Dayjs | null, Dayjs | null]) => {
    const convertedDates: [moment.Moment | null, moment.Moment | null] = [
      dates[0] ? moment(dates[0].toDate()) : null,
      dates[1] ? moment(dates[1].toDate()) : null
    ]
    const updatedWorkExperiences = workExperiences.map((item) =>
      item.key === key
        ? {
            ...item,
            jobDescription: {
              ...item.jobDescription,
              dateRange: convertedDates
            }
          }
        : item
    )
    setWorkExperiences(updatedWorkExperiences)
  }

  const handleChangeCompany = (key: React.Key, value: string) => {
    const updatedWorkExperiences = workExperiences.map((item) =>
      item.key === key ? { ...item, jobDescription: { ...item.jobDescription, company: value } } : item
    )
    setWorkExperiences(updatedWorkExperiences)
  }

  const handleChangeJobDescription = (key: React.Key, value: string) => {
    const updatedWorkExperiences = workExperiences.map((item) =>
      item.key === key ? { ...item, jobDescription: { ...item.jobDescription, jobDescription: value } } : item
    )
    setWorkExperiences(updatedWorkExperiences)
  }

  const handleDeleteWorkExperience = (key: React.Key) => {
    const updatedWorkExperiences = workExperiences.filter((item) => item.key !== key)
    setWorkExperiences(updatedWorkExperiences)
  }

  const handleFormSubmit = async (values: any) => {
    // Xử lý chứng chỉ
    const certifications = dataSource.map((item) => ({
      name: item.name,
      uploadFile: item.upload
    }))

    // Xử lý quá trình học tập
    const educationsData = educations.map((item) => ({
      from: item.dateRange[0]?.toISOString(), // Chuyển đổi ngày bắt đầu thành chuỗi ISO
      to: item.dateRange[1]?.toISOString(), // Chuyển đổi ngày kết thúc thành chuỗi ISO
      major: item.major
    }))

    // Xử lý quá trình làm việc
    const workHistories = workExperiences.map((item) => ({
      from: item.jobDescription.dateRange[0]?.toISOString(), // Chuyển đổi ngày bắt đầu thành chuỗi ISO
      to: item.jobDescription.dateRange[1]?.toISOString(), // Chuyển đổi ngày kết thúc thành chuỗi ISO
      workUnit: item.jobDescription.company,
      description: item.jobDescription.jobDescription
    }))

    // Create FormData object and append values
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('name', values.name)
    formData.append('GPA', values.GPA)
    formData.append('dateOfBirth', values.dateOfBirth.toISOString())
    formData.append('phone', values.phone)
    formData.append('email', values.email)
    formData.append('major', values.major)
    formData.append('homeTown', values.homeTown)
    formData.append('experience', values.experience)
    formData.append('jobType', values.jobType)
    formData.append('educationLevel', values.educationLevel)
    formData.append('english', values.english)
    formData.append('goal', values.goal)
    formData.append('activity', values.activity)
    formData.append('certifications', JSON.stringify(certifications))
    formData.append('educations', JSON.stringify(educationsData))
    formData.append('workHistories', JSON.stringify(workHistories))

    // Append avatar file
    const avatar = form.getFieldValue('avatar')
    if (avatar && Array.isArray(avatar) && avatar.length > 0 && avatar[0].originFileObj) {
      formData.append('avatar', avatar[0].originFileObj, avatar[0].name)
    } else {
      message.error('Vui lòng tải ảnh đại diện')
      return
    }

    if (templateId) {
      formData.append('themeId', templateId)
    }

    toast
      .promise(UserService.createResume(formData), {
        pending: `CV của bạn đang được khởi tạo`,
        success: `CV của bạn đã được tạo thành công`
      })
      .then((response) => {
        navigate('/profile/resume')
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    if (completedCrop && previewCanvasRef.current) {
      const canvas = previewCanvasRef.current
      const blob = dataURLtoBlob(canvas.toDataURL('image/png'))
      const file = new File([blob], 'avatar.png', { type: 'image/png' })

      // Cập nhật giá trị avatar trong form
      form.setFieldsValue({ avatar: [{ originFileObj: file }] })

      // Cập nhật previewAvatar để hiển thị ảnh đã crop
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewAvatar(result)

        // Cập nhật formValues để PreviewResume nhận được giá trị mới
        const updatedFormValues = { ...form.getFieldsValue(), avatar: result }
        setFormValues(updatedFormValues)

        setIsModalOpen(false) // Đóng modal sau khi cập nhật ảnh
      }
      reader.readAsDataURL(file)
    } else {
      message.error('Vui lòng crop ảnh để cập nhật avatar')
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  function dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',')
    const mimeMatch = arr[0].match(/:(.*?);/)?.[1] ?? ''

    if (!mimeMatch) {
      throw new Error('Invalid dataURL format')
    }

    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new Blob([u8arr], { type: mimeMatch })
  }

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined)
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 3 / 4))
  }

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate)
      }
    },
    100,
    [completedCrop, scale, rotate]
  )

  return (
    <div className='flex items-start justify-start gap-4 mb-8'>
      <div className='flex flex-col flex-1 w-1/2 gap-4 shadow-lg'>
        <div className='w-full border border-zinc-100'>
          <div className='flex items-center justify-center gap-5 p-2 bg-emerald-500 '>
            <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer' }} className='font-bold text-white' />
            <h6 className='flex-1 text-lg font-semibold text-white uppercase'>Tạo hồ sơ</h6>
          </div>
          <div className='flex flex-col gap-2 p-4'>
            <Form form={form} layout='vertical' onValuesChange={handleFormChange} onFinish={handleFormSubmit}>
              <div className='flex items-start justify-center gap-5'>
                <div className='w-1/4'>
                  <Form.Item
                    name='avatar'
                    label='Ảnh đại diện (3x4)'
                    rules={[{ required: true, message: 'Vui lòng tải ảnh đại diện' }]}
                    valuePropName='fileList'
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                    className='flex-grow w-full'
                  >
                    {previewAvatar ? (
                      <img
                        src={previewAvatar}
                        alt='Avatar'
                        style={{ width: '100%', height: '200px', marginTop: '10px', cursor: 'pointer' }}
                        onClick={showModal}
                      />
                    ) : (
                      <>
                        <div
                          onClick={showModal}
                          className='w-full h-[200px] flex items-center justify-center border-dashed border-2 border-black cursor-pointer'
                        >
                          Chọn ảnh đại diện
                        </div>
                      </>
                    )}
                    <Modal
                      title='Cập nhật avatar'
                      open={isModalOpen}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      okText='Cập nhật avatar'
                      cancelText='Hủy'
                      cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
                      width={650}
                    >
                      <div className='mb-3 Crop-Controls'>
                        <input
                          type='file'
                          id='fileInput'
                          accept='image/*'
                          onChange={onSelectFile}
                          style={{ display: 'none' }}
                        />
                        <label
                          htmlFor='fileInput'
                          className='px-3 py-2 border w-[100px] rounded-md bg-emerald-500 text-white text-center cursor-pointer'
                        >
                          Chọn Ảnh
                        </label>
                      </div>
                      <div className='flex flex-col items-center Crop-Container'>
                        {!!imgSrc && (
                          <ReactCrop
                            crop={crop}
                            onChange={(newCrop) => setCrop(newCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                            locked
                          >
                            <img
                              ref={imgRef}
                              alt='Crop me'
                              src={imgSrc}
                              onLoad={onImageLoad}
                              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                            />
                          </ReactCrop>
                        )}
                        {!!completedCrop && (
                          <canvas
                            ref={previewCanvasRef}
                            style={{
                              objectFit: 'contain',
                              width: completedCrop.width,
                              height: completedCrop.height
                            }}
                          />
                        )}
                      </div>
                    </Modal>
                  </Form.Item>
                </div>
                <div className='w-3/4'>
                  <div className='flex items-center justify-center gap-2'>
                    <Form.Item
                      name='title'
                      label='Tiêu đề CV'
                      rules={[{ required: true, message: 'Vui lòng nhập tiêu đề CV' }]}
                      className='w-1/2'
                    >
                      <Input placeholder='Nhập tiêu đề CV' />
                    </Form.Item>
                    <Form.Item
                      name='name'
                      label='Tên'
                      rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                      className='w-1/2'
                    >
                      <Input placeholder='Nhập tên của bạn' />
                    </Form.Item>
                  </div>

                  <div className='flex items-center justify-center gap-2'>
                    <Form.Item name='GPA' label='GPA' className='w-1/2' rules={[{ validator: validateGPA }]}>
                      <Input placeholder='Nhập GPA' />
                    </Form.Item>
                    <Form.Item
                      label='Ngày sinh'
                      name='dateOfBirth'
                      className='w-1/2'
                      rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                    >
                      <DatePicker
                        format='DD/MM/YYYY'
                        style={{ width: '100%' }}
                        inputReadOnly={true} // Thêm thuộc tính này
                        placeholder='Chọn ngày'
                      />
                    </Form.Item>
                  </div>

                  <div className='flex items-center justify-center gap-2'>
                    <Form.Item
                      name='phone'
                      label='Số điện thoại'
                      rules={[{ validator: validatePhone }]}
                      className='w-1/2'
                    >
                      <Input placeholder='Nhập số điện thoại' />
                    </Form.Item>

                    <Form.Item name='email' label='Email' rules={[{ validator: validateEmail }]} className='w-1/2'>
                      <Input placeholder='Nhập email' />
                    </Form.Item>
                  </div>

                  <div className='flex items-center justify-center gap-2'>
                    <Form.Item
                      name='major'
                      label='Ngành học'
                      rules={[{ required: true, message: 'Vui lòng chọn ngành học' }]}
                      className='w-1/2'
                    >
                      <Select
                        showSearch
                        placeholder='Chọn ngành học'
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          (option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
                        }
                      >
                        {optionsMajors.map((option) => (
                          <Option key={option.label} value={option.value}>
                            {option.value}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name='homeTown'
                      label='Quê quán'
                      rules={[{ required: true, message: 'Vui lòng chọn quê quán' }]}
                      className='w-1/2'
                    >
                      <Select
                        showSearch
                        placeholder='Chọn quê quán'
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          (option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
                        }
                      >
                        {optionsProvinces.map((option) => (
                          <Option key={option.label} value={option.value}>
                            {option.value}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className='flex items-center justify-center gap-2'>
                    <Form.Item
                      name='experience'
                      label='Kinh nghiệm làm việc'
                      rules={[{ required: true, message: 'Vui lòng chọn kinh nghiệm làm việc' }]}
                      className='w-1/2'
                    >
                      <Select
                        showSearch
                        placeholder='Chọn kinh nghiệm làm việc'
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          (option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
                        }
                      >
                        {experiences.map((experience) => (
                          <Option key={experience.id} value={experience.name}>
                            {experience.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name='jobType'
                      label='Loại hình công việc mong muốn'
                      rules={[{ required: true, message: 'Vui lòng chọn loại hình công việc' }]}
                      className='w-1/2'
                    >
                      <Select
                        showSearch
                        placeholder='Chọn loại hình công việc'
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          (option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
                        }
                      >
                        {jobTypes.map((jobType) => (
                          <Option key={jobType.id} value={jobType.name}>
                            {jobType.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className='flex items-center justify-center gap-2'>
                    <Form.Item
                      name='educationLevel'
                      label='Trình độ học vấn'
                      rules={[{ required: true, message: 'Vui lòng chọn học vấn' }]}
                      className='w-1/2'
                    >
                      <Select
                        showSearch
                        placeholder='Chọn trình độ học vấn'
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                          (option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
                        }
                      >
                        {educationLevels.map((level) => (
                          <Option key={level.id} value={level.name}>
                            {level.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name='english'
                      label='Trình độ ngoại ngữ'
                      rules={[{ required: true, message: 'Vui lòng nhập trình độ ngoại ngữ' }]}
                      className='w-1/2'
                    >
                      <Input placeholder='Nhập trình độ ngoại ngữ' />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <Form.Item
                  name='goal'
                  label='Mục tiêu nghề nghiệp'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mục tiêu nghề nghiệp!'
                    }
                  ]}
                >
                  <div style={{ minHeight: '200px', maxHeight: '600px' }}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={form.getFieldValue('goal') || ''}
                      onChange={(_: any, editor: any) => {
                        const data = editor.getData()
                        form.setFieldsValue({ goal: data })
                        handleFormChange({ goal: data }, { ...form.getFieldsValue(), goal: data })
                      }}
                    />
                  </div>
                </Form.Item>

                <Form.Item
                  name='certifications'
                  label={
                    <div className='flex items-center justify-center gap-2'>
                      <p>Chứng chỉ/CV/Portfolio</p>
                      <Button type='primary' onClick={() => handleAdd('certifications')}>
                        Thêm
                      </Button>
                    </div>
                  }
                >
                  <Table columns={certificationColumns} dataSource={dataSource} size='middle' pagination={false} />
                </Form.Item>

                <Form.Item
                  name='educations'
                  label={
                    <div className='flex items-center justify-center gap-2'>
                      <p>Quá trình học tập</p>
                      <Button type='primary' onClick={() => handleAdd('educations')}>
                        Thêm
                      </Button>
                    </div>
                  }
                >
                  <Table columns={educationColumns} dataSource={educations} size='middle' pagination={false} />
                </Form.Item>

                <Form.Item
                  name='workHistories'
                  label={
                    <div className='flex items-center justify-center gap-2'>
                      <p>Quá trình làm việc</p>
                      <Button type='primary' onClick={() => handleAddWorkExperience()}>
                        Thêm
                      </Button>
                    </div>
                  }
                >
                  <Table
                    columns={workExperienceColumns}
                    dataSource={workExperiences}
                    size='middle'
                    pagination={false}
                  />
                </Form.Item>

                <Form.Item name='activity' label='Giải thưởng / Hoạt động ngoại khoá / Sở thích / Khác...'>
                  <div style={{ minHeight: '200px', maxHeight: '600px' }}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={form.getFieldValue('activity') || ''}
                      onChange={(_: any, editor: any) => {
                        const data = editor.getData()
                        form.setFieldsValue({ activity: data })
                        handleFormChange({ activity: data }, { ...form.getFieldsValue(), activity: data })
                      }}
                    />
                  </div>
                </Form.Item>
              </div>
              <Form.Item className='flex justify-end'>
                <Button type='primary' htmlType='submit'>
                  Tạo CV
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        {shown && ReactDOM.createPortal(modalBody(), document.body)}
      </div>
      <div className='sticky flex flex-col flex-1 w-1/2 gap-4 h-fit top-4'>
        {formValues && templateId && (
          <PreviewResume values={formValues} previewAvatar={previewAvatar} templateId={templateId} type='create' />
        )}
      </div>
    </div>
  )
}

export default UserResumeAdd
