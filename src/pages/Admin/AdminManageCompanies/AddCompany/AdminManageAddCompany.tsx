import { Steps, Button, Form, Input, Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { Upload, message } from 'antd'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks'
import { useDebounceEffect } from '../../../UserProfile/AvatarCrop/useDebounceEffect'
import { canvasPreview } from '../../../UserProfile/AvatarCrop/canvasPreview'
import { JobService } from '../../../../services/JobService'
import { UserService } from '../../../../services/UserService'
import AddCompanyStep1 from './AddCompanyStep1'
import AddCompanyStep2 from './AddCompanyStep2'
import { AdminService } from '../../../../services/AdminService'

const { Step } = Steps
const { Option } = Select

interface FormData {
  name?: string
  position?: string
  phone?: string
  contactEmail?: string
  companyName?: string
  companyWebsite?: string
  companyAddress?: string
  companyLogo?: UploadFile
  companyCoverPhoto?: UploadFile
  about?: string
  employeeNumber?: string
  fieldOfActivity?: string[]
  emailLogin?: string
  slug?: string
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: 'px', // Sử dụng đơn vị pixel
        width: mediaWidth, // Đặt kích thước width và height bằng chính kích thước của hình ảnh
        height: mediaHeight
      },
      mediaWidth / mediaHeight,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}

function AdminManageAddCompany() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const activities = useAppSelector((state): string[] => state.Job.activities)

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({})
  const [form] = Form.useForm() // Tạo instance của form
  const [previewLogo, setPreviewLogo] = useState<string>('')
  const [previewCover, setPreviewCover] = useState('')
  const [isUploading, setUploading] = useState<boolean>(false)
  // Lưu trữ danh sách file đã tải lên, bao gồm cả preview
  const [coverList, setCoverList] = useState<UploadFile[]>([])
  const [logoList, setLogoList] = useState<UploadFile[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null)
  const blobUrlRef = useRef('')
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState<number | undefined>(undefined)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    if (completedCrop && previewCanvasRef.current) {
      const canvas = previewCanvasRef.current
      const blob = dataURLtoBlob(canvas.toDataURL('image/png'))
      const file = new File([blob], 'logo.png', { type: 'image/png' })

      // Cập nhật giá trị avatar trong form
      form.setFieldsValue({ companyLogo: [{ originFileObj: file }] })

      // Cập nhật previewAvatar để hiển thị ảnh đã crop
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string)
        setIsModalOpen(false) // Đóng modal sau khi cập nhật ảnh
      }
      reader.readAsDataURL(file)
    } else {
      message.error('Vui lòng crop ảnh để cập nhật logo')
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
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height))
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

  useEffect(() => {
    JobService.getActivity(dispatch)
  }, [])

  // Hàm được gọi khi có thay đổi trên Upload component
  const onUploadChange = (info: UploadChangeParam<UploadFile>, fileType: 'logo' | 'cover'): void => {
    const latestFile = info.fileList.slice(-1)[0]?.originFileObj
    if (latestFile) {
      getBase64(latestFile, (imageUrl: string) => {
        if (fileType === 'logo') {
          setPreviewLogo(imageUrl)
        } else {
          setPreviewCover(imageUrl)
        }
      })
    }
  }

  const getBase64 = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => callback(reader.result as string)
  }

  const handleLogoChange = (info: UploadChangeParam<UploadFile>) => {
    setLogoList(info.fileList) // Update the logoList state
    onUploadChange(info, 'logo') // Handle base64 conversion and preview update
  }

  const handleCoverChange = (info: UploadChangeParam<UploadFile>) => {
    onUploadChange(info, 'cover')
  }

  const nextStep = () => {
    form
      .validateFields() // Kiểm tra validation
      .then(() => {
        // Nếu không có lỗi, tiếp tục tới step tiếp theo
        setCurrentStep(currentStep + 1)
      })
      .catch((errorInfo) => {
        // Nếu có lỗi, hiển thị thông báo lỗi và không chuyển step
        console.log('Validate Failed:', errorInfo)
      })
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleFieldOfActivityChange = (values: string[], option: { children: string; value: string }[]) => {
    // Sử dụng 'map' để lấy ra mảng các 'label' từ mảng 'option'
    const fieldOfActivityLabels = option.map((o) => o.children)
    // Cập nhật 'fieldOfActivity' trong 'formData' với mảng các 'label' vừa lấy được
    setFormData((prevFormData) => ({ ...prevFormData, fieldOfActivity: fieldOfActivityLabels }))
  }

  const handleFormChange = (changedValues: any, allValues: any) => {
    setFormData({ ...formData, ...changedValues })
  }

  const onFinish = () => {
    // Tạo một instance mới của FormData cho việc gửi request.
    const formDataObj = new FormData()

    const formValues = form.getFieldsValue(true) // Lấy tất cả giá trị từ form, kể cả những trường không thay đổi
    const mergedValues = { ...formData, ...formValues }

    // Thêm các giá trị từ formData (không phải là files) vào formDataObj
    Object.keys(mergedValues).forEach((key) => {
      const value = mergedValues[key]

      if (key !== 'companyLogo' && key !== 'companyCoverPhoto') {
        // Nếu không phải là fieldOfActivity, logo, hoặc ảnh bìa, thêm bình thường.
        formDataObj.append(key, typeof value === 'string' ? value : JSON.stringify(value))
      }
    })

    // Thêm file logo và cover photo vào formDataObj nếu có
    if (mergedValues.companyLogo && mergedValues.companyLogo.slice(-1)[0].originFileObj instanceof File) {
      formDataObj.append('companyLogo', mergedValues.companyLogo.slice(-1)[0].originFileObj)
    }

    if (mergedValues.companyCoverPhoto && mergedValues.companyCoverPhoto.slice(-1)[0].originFileObj instanceof File) {
      formDataObj.append('companyCoverPhoto', mergedValues.companyCoverPhoto.slice(-1)[0].originFileObj)
    }

    toast
      .promise(AdminService.createCompany(formDataObj), {
        pending: `Công ty đang được khởi tạo`,
        success: `Công ty đã được khởi tạo thành công.`
      })
      .then((response) => {
        navigate('/admin/manage_companies')
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  return (
    <div>
      <h1 className='flex-1 text-2xl font-semibold text-center md:mb-4'>Tạo công ty trong hệ thống</h1>
      <div className='flex flex-col gap-5 mt-5'>
        <Steps current={currentStep} className='flex items-center justify-center px-10'>
          <Step title='Cập nhật thông tin nhà tuyển dụng' />
          <Step title='Thông tin liên hệ công ty' />
        </Steps>
        <div className='steps-content'>
          <Form
            name='recruiter-info'
            form={form}
            onFinish={onFinish}
            onValuesChange={handleFormChange}
            labelCol={{ span: 24 }}
          >
            {currentStep === 0 && (
              <AddCompanyStep1
                form={form}
                onFormChange={handleFormChange}
                nextStep={nextStep}
                onFieldOfActivityChange={handleFieldOfActivityChange}
                activities={activities}
              />
            )}
            {currentStep === 1 && (
              <AddCompanyStep2
                form={form}
                onFormChange={handleFormChange}
                prevStep={prevStep}
                onLogoUploadChange={handleLogoChange} // thay vì onUploadChange
                onCoverUploadChange={handleCoverChange}
                previewLogo={previewLogo}
                previewCover={previewCover}
                showModal={showModal}
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                onSelectFile={onSelectFile}
                imgSrc={imgSrc}
                crop={crop}
                setCrop={setCrop}
                setCompletedCrop={setCompletedCrop}
                aspect={aspect}
                imgRef={imgRef}
                onImageLoad={onImageLoad}
                scale={scale}
                rotate={rotate}
                completedCrop={completedCrop}
                previewCanvasRef={previewCanvasRef}
              />
            )}
          </Form>
        </div>
      </div>
    </div>
  )
}

export default AdminManageAddCompany
