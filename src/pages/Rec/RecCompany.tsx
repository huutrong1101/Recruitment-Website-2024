import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import { Form, Input, Select, Upload, UploadFile } from 'antd'
import { JobService } from '../../services/JobService'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { UploadChangeParam } from 'antd/lib/upload/interface'
import { PlusOutlined } from '@ant-design/icons'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { toast } from 'react-toastify'
import { UserService } from '../../services/UserService'
import { isEqual } from 'lodash'
import { setRec } from '../../redux/reducer/AuthSlice'
import ImgCrop from 'antd-img-crop'

interface FormData {
  name?: string
  position?: string
  phone?: string
  contactEmail?: string
  companyName?: string
  companyWebsite?: string
  companyAddress?: string
  companyLogo?: string | UploadFile
  companyCoverPhoto?: string | UploadFile
  about?: string
  employeeNumber?: string
  fieldOfActivity?: string[]
  emailLogin?: string
}

function RecCompany() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [formData, setFormData] = useState<FormData>({})
  const [form] = Form.useForm()
  const activities = useAppSelector((state) => state.Job.activities)
  const [coverList, setCoverList] = useState<UploadFile[]>([])
  const [logoList, setLogoList] = useState<UploadFile[]>([])
  const [previewLogo, setPreviewLogo] = useState<string>('')
  const [previewCover, setPreviewCover] = useState('')
  const [initialFormData, setInitialFormData] = useState<FormData>({})

  console.log(previewLogo)

  const { recruiter, loading } = useAppSelector((app) => app.Auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    JobService.getActivity(dispatch)
  }, [])

  useEffect(() => {
    // Kiểm tra xem người dùng có tồn tại không và đặt giá trị ban đầu cho form
    if (recruiter) {
      const newUserFormData = {
        ...formData,
        companyName: recruiter.companyName,
        employeeNumber: recruiter.employeeNumber.toString(),
        companyWebsite: recruiter.companyWebsite,
        fieldOfActivity: recruiter.fieldOfActivity,
        companyAddress: recruiter.companyAddress,
        about: recruiter.about ?? '',
        companyLogo: recruiter.companyLogo,
        companyCoverPhoto: recruiter.companyCoverPhoto
      }

      setFormData(newUserFormData)

      setInitialFormData(newUserFormData)

      // Cập nhật vào form fields
      form.setFieldsValue(newUserFormData)

      if (recruiter.companyLogo) {
        const logoUrl = recruiter.companyLogo
        const logoObj: UploadFile[] = [
          {
            uid: '-logo',
            name: 'logo.png',
            status: 'done', // đây phải là một trong những giá trị cố định nêu trên hoặc `undefined`
            url: logoUrl
          }
        ]
        setLogoList(logoObj) // Lưu danh sách logo
        setPreviewLogo(logoUrl) // Lưu URL preview của logo
      }

      // Đặt giá trị mặc định cho companyCoverPhoto
      if (recruiter.companyCoverPhoto) {
        const coverUrl = recruiter.companyCoverPhoto // Đây là dòng cần sửa
        const coverObj: UploadFile[] = [
          {
            uid: '-cover',
            name: 'cover.png',
            status: 'done', // tương tự như trên
            url: coverUrl
          }
        ]
        setCoverList(coverObj) // Lưu danh sách cover photo
        setPreviewCover(coverUrl) // Lưu URL preview của cover photo - Đây là dòng cần sửa
      }
    }
  }, [recruiter, form])

  const handleFieldOfActivityChange = (values: string[], option: { children: string; value: string }[]) => {
    // Sử dụng 'map' để lấy ra mảng các 'label' từ mảng 'option'
    const fieldOfActivityLabels = option.map((o) => o.children)
    // Cập nhật 'fieldOfActivity' trong 'formData' với mảng các 'label' vừa lấy được
    setFormData((prevFormData) => ({ ...prevFormData, fieldOfActivity: fieldOfActivityLabels }))
  }

  const getBase64 = (file: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })

  // Hàm được gọi khi có thay đổi trên Upload component
  const onUploadChange = async (info: UploadChangeParam<UploadFile>, fileType: 'logo' | 'cover'): Promise<void> => {
    // Cập nhật danh sách file theo loại đang xử lý
    if (fileType === 'logo') {
      setLogoList(info.fileList)
    } else if (fileType === 'cover') {
      setCoverList(info.fileList)
    }

    // Tìm file mới nhất (nếu có) trong danh sách của loại file đang xử lý
    const latestFile = info.fileList.slice(-1)[0]?.originFileObj
    if (latestFile) {
      try {
        const imageUrl = await getBase64(latestFile)
        // Cập nhật preview tương ứng với loại file
        if (fileType === 'logo') {
          setPreviewLogo(imageUrl)
        } else if (fileType === 'cover') {
          setPreviewCover(imageUrl)
        }
      } catch (error) {
        console.error('Error converting file to base64!', error)
      }
    }
  }

  const handleLogoChange = async (info: UploadChangeParam<UploadFile>) => {
    // ...
    if (info.file.status === 'done' && info.file.originFileObj) {
      const latestFile = info.fileList.slice(-1)[0]?.originFileObj
      if (latestFile) {
        const imageUrl = await getBase64(latestFile)
        setPreviewLogo(imageUrl)
      }
    }
    setLogoList(info.fileList.filter((file) => !!file.status))
  }

  const handleCoverChange = (info: UploadChangeParam<UploadFile>) => {
    onUploadChange(info, 'cover')
  }

  const updateCompanyInfo = () => {
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

    // Xử lý thêm logo mới nếu có
    const newLogoFile = logoList.find((file) => file.originFileObj)
    if (newLogoFile && newLogoFile.originFileObj) {
      formDataObj.append('companyLogo', newLogoFile.originFileObj)
    } else if (recruiter?.companyLogo && newLogoFile === undefined) {
      // Nếu không có sự thay đổi, giữ nguyên logo từ thông tin user hiện tại
      formDataObj.append('companyLogo', recruiter.companyLogo)
    }

    // Xử lý thêm cover photo mới nếu có
    const newCoverFile = coverList.find((file) => file.originFileObj)
    if (newCoverFile && newCoverFile.originFileObj) {
      formDataObj.append('companyCoverPhoto', newCoverFile.originFileObj)
    } else if (recruiter?.companyCoverPhoto && newCoverFile === undefined) {
      // Nếu không có sự thay đổi, giữ nguyên cover photo từ thông tin user hiện tại
      formDataObj.append('companyCoverPhoto', recruiter.companyCoverPhoto)
    }

    if (!isEqual(mergedValues, initialFormData)) {
      toast
        .promise(UserService.updateRecCompanyInfor(formDataObj), {
          pending: `Thông tin của bạn đang được cập nhật`,
          success: 'Cập nhật thông tin thành công'
        })
        .then((response) => {
          const result = response.data.metadata
          dispatch(setRec(result))
        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })

      // Tiếp tục logic gửi request tới server...
    } else {
      toast.info('Không có thông tin nào được cập nhật!')
    }
  }

  return (
    <div className={classNames(`flex-1 flex flex-col gap-4`)}>
      <div className='w-full p-4 border rounded-xl border-zinc-100'>
        <h1 className={classNames(`text-2xl font-semibold flex-1 md:mb-4`)}>Thông tin công ty</h1>
        <div className={classNames(`flex flex-col md:flex-row gap-6`)}>
          {loading === 'pending' ? (
            <LoadSpinner />
          ) : recruiter === null || recruiter === undefined ? (
            // User is not found
            <div>User not found</div>
          ) : (
            <div className='w-full px-10'>
              <Form layout='vertical' form={form}>
                <div className='flex items-center justify-center gap-2'>
                  <Form.Item
                    name='companyName'
                    label='Tên công ty'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tên công ty!'
                      }
                    ]}
                    className='w-1/2'
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='employeeNumber'
                    label='Số lượng nhân viên'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số lượng thành viên của công ty!'
                      }
                    ]}
                    className='w-1/2'
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className='flex items-center justify-center gap-2'>
                  <Form.Item
                    name='companyWebsite'
                    label='Website'
                    rules={[
                      {
                        type: 'url',
                        warningOnly: true, // chỉ hiển thị cảnh báo nếu bạn muốn
                        message: 'URL không hợp lệ!'
                      },
                      {
                        required: true,
                        message: 'Vui lòng nhập website công ty!'
                      }
                    ]}
                    className='w-1/2'
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='fieldOfActivity'
                    label='Lĩnh vực hoạt động'
                    rules={[
                      { required: true, message: 'Vui lòng chọn ít nhất một lĩnh vực hoạt động!', type: 'array' }
                    ]}
                    className='w-1/2'
                  >
                    <Select
                      mode='multiple'
                      showSearch
                      style={{ width: '100%' }}
                      placeholder='Chọn lĩnh vực hoạt động'
                      optionFilterProp='children'
                      filterOption={
                        (input, option) =>
                          option && option.children
                            ? option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                            : false // Chỉ gọi toString() khi option.children được định nghĩa
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA.children?.toString() ?? '')
                          .toLowerCase()
                          .localeCompare((optionB.children?.toString() ?? '').toLowerCase())
                      }
                      onChange={(values, optionList) => {
                        // Thêm as để ép kiểu optionList về dạng mảng mong muốn
                        handleFieldOfActivityChange?.(values, optionList as { children: string; value: string }[])
                      }}
                    >
                      {activities.map((activity, index) => (
                        <Select.Option key={index} value={activity}>
                          {activity}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <Form.Item
                  name='companyAddress'
                  label='Địa chỉ'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập địa chỉ của công ty!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name='about'
                  label='Giới thiệu công ty'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập giới thiệu về công ty!'
                    }
                  ]}
                >
                  <div style={{ minHeight: '200px', maxHeight: '600px' }}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={form.getFieldValue('about') || ''}
                      onChange={(_: any, editor: any) => {
                        const data = editor.getData()
                        form.setFieldsValue({ about: data })
                      }}
                    />
                  </div>
                </Form.Item>

                <Form.Item
                  name='companyLogo'
                  label='Logo của công ty'
                  getValueFromEvent={(e) => e.fileList}
                  rules={[{ required: true, message: 'Vui lòng upload logo của công ty!' }]}
                >
                  <ImgCrop
                    rotationSlider // Cung cấp tính năng xoay ảnh nếu cần
                    // Các props khác của ImgCrop nếu bạn cần tuỳ chỉnh...
                  >
                    <Upload
                      fileList={logoList}
                      listType='picture-card'
                      showUploadList={false}
                      onChange={handleLogoChange}
                      beforeUpload={() => false}
                      onPreview={async (file) => {
                        if (file.originFileObj) {
                          const imageUrl = await getBase64(file.originFileObj)
                          setPreviewLogo(imageUrl)
                        }
                      }}
                    >
                      {previewLogo ? (
                        <img src={previewLogo} style={{ width: '100%' }} alt='avatar' />
                      ) : (
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      )}
                    </Upload>
                  </ImgCrop>
                </Form.Item>

                <Form.Item
                  name='companyCoverPhoto'
                  label='Ảnh bìa cho công ty'
                  getValueFromEvent={(e) => e && e.fileList}
                  rules={[{ required: true, message: 'Vui lòng upload ảnh bìa của công ty!' }]}
                >
                  <Upload
                    fileList={coverList}
                    listType='picture-card'
                    showUploadList={false}
                    onChange={handleCoverChange}
                    beforeUpload={() => false} // Trả về false để ngăn không tự upload lên server
                  >
                    {previewCover ? (
                      <img src={previewCover} style={{ width: '100%' }} alt='avatar' />
                    ) : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Form>
              <div className='flex flex-row-reverse'>
                <PrimaryButton text={`Cập nhật`} size={'sm'} className={`md:!w-3/12`} onClick={updateCompanyInfo} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecCompany
