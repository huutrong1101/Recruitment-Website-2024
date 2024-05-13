import { Steps, Button, Form, Input, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import Container from '../../components/Container/Container'
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'
import { Upload, message } from 'antd'
import Step1Form from './Step1Form'
import Step2Form from './Step2Form'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { toast } from 'react-toastify'
import { UserService } from '../../services/UserService'
import { JobService } from '../../services/JobService'
import { useNavigate } from 'react-router-dom'

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

function ConfirmRec() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { recruiter, loading } = useAppSelector((app) => app.Auth)
  const activities = useAppSelector((state) => state.Job.activities)

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({})
  const [form] = Form.useForm() // Tạo instance của form
  const [previewLogo, setPreviewLogo] = useState<string>('')
  const [previewCover, setPreviewCover] = useState('')
  const [isUploading, setUploading] = useState<boolean>(false)
  // Lưu trữ danh sách file đã tải lên, bao gồm cả preview
  const [coverList, setCoverList] = useState<UploadFile[]>([])
  const [logoList, setLogoList] = useState<UploadFile[]>([])

  useEffect(() => {
    JobService.getActivity(dispatch)
  }, [])

  useEffect(() => {
    if (recruiter) {
      // Define nguyên mẩu giá trị mới cần thiết cho formData từ user
      const newUserFormData = {
        ...formData,
        emailLogin: recruiter.email,
        position: recruiter.position,
        contactEmail: recruiter.contactEmail,
        phone: recruiter.phone,
        name: recruiter.name
        // Tiếp tục với các trường khác từ user...
      }

      setFormData(newUserFormData)

      // Cập nhật vào form fields
      form.setFieldsValue(newUserFormData)
    }
  }, [recruiter, form])

  // Hàm được gọi khi có thay đổi trên Upload component
  const onUploadChange = (info: UploadChangeParam<UploadFile>, fileType: 'logo' | 'cover'): void => {
    // Cập nhật danh sách file theo loại đang xử lý
    if (fileType === 'logo') {
      setLogoList(info.fileList)
    } else if (fileType === 'cover') {
      setCoverList(info.fileList)
    }

    // Tìm file mới nhất (nếu có) trong danh sách của loại file đang xử lý
    const latestFile = info.fileList.slice(-1)[0]?.originFileObj
    if (latestFile) {
      getBase64(latestFile, (imageUrl: string) => {
        // Cập nhật preview tương ứng với loại file
        if (fileType === 'logo') {
          setPreviewLogo(imageUrl)
        } else if (fileType === 'cover') {
          setPreviewCover(imageUrl)
        }
      })
    }
  }

  // Hàm để chuyển Blob thành base64 để preview
  const getBase64 = (file: Blob, callback: (imageUrl: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(file)
  }

  const handleLogoChange = (info: UploadChangeParam<UploadFile>) => {
    onUploadChange(info, 'logo')
  }

  // Và như sau cho Cover:
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
      if (key === 'emailLogin') {
        // Nếu là emailLogin thì bỏ qua và không thêm vào formDataObj
        return
      }

      const value = mergedValues[key]

      console.log({ key, value })

      if (key === 'fieldOfActivity' && Array.isArray(value)) {
        // Chuyển mảng fieldOfActivity thành chuỗi với các phần tử cách nhau bởi dấu phẩy
        const fieldOfActivityText = value.join(', ')
        formDataObj.append('fieldOfActivity', fieldOfActivityText)
      } else if (key !== 'companyLogo' && key !== 'companyCoverPhoto') {
        // Nếu không phải là fieldOfActivity, logo, hoặc ảnh bìa, thêm bình thường.
        formDataObj.append(key, typeof value === 'string' ? value : JSON.stringify(value))
      }
    })

    // Thêm file logo và cover photo vào formDataObj nếu có
    if (mergedValues.companyLogo && mergedValues.companyLogo[0].originFileObj instanceof File) {
      formDataObj.append('companyLogo', mergedValues.companyLogo[0].originFileObj)
    }

    if (mergedValues.companyCoverPhoto && mergedValues.companyCoverPhoto[0].originFileObj instanceof File) {
      formDataObj.append('companyCoverPhoto', mergedValues.companyCoverPhoto[0].originFileObj)
    }

    // Gửi FormData đến server
    // Replace 'yourApiEndpoint' với đường dẫn thực của bạn và xử lý ứng với API của bạn
    toast
      .promise(UserService.updateRecInformation(formDataObj), {
        pending: `Thông tin của bạn đang được cập nhật`
      })
      .then((response) => {
        navigate('/confirm-rec/complete')
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  return (
    <Container>
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
              <Step1Form
                form={form}
                onFormChange={handleFormChange}
                nextStep={nextStep}
                onFieldOfActivityChange={handleFieldOfActivityChange}
                activities={activities}
              />
            )}
            {currentStep === 1 && (
              <Step2Form
                form={form}
                onFormChange={handleFormChange}
                prevStep={prevStep}
                onLogoUploadChange={handleLogoChange} // thay vì onUploadChange
                onCoverUploadChange={handleCoverChange}
                previewLogo={previewLogo}
                previewCover={previewCover}
              />
            )}
          </Form>
        </div>
      </div>
    </Container>
  )
}

export default ConfirmRec
