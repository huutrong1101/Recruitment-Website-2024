import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import { Form, Input, Modal, Select, Upload, UploadFile, message } from 'antd'
import { JobService } from '../../services/JobService'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { UploadChangeParam } from 'antd/lib/upload/interface'
import { PlusOutlined } from '@ant-design/icons'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { toast } from 'react-toastify'
import { UserService } from '../../services/UserService'
import { isEmpty, isEqual } from 'lodash'
import { setRec } from '../../redux/reducer/AuthSlice'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import ImgCrop from 'antd-img-crop'
import { useDebounceEffect } from '../UserProfile/AvatarCrop/useDebounceEffect'
import { canvasPreview } from '../UserProfile/AvatarCrop/canvasPreview'

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

function RecCompany() {
  const [formData, setFormData] = useState<FormData>({})
  const [form] = Form.useForm()
  const activities = useAppSelector((state) => state.Job.activities)
  const [coverList, setCoverList] = useState<UploadFile[]>([])
  const [logoList, setLogoList] = useState<UploadFile[]>([])
  const [previewLogo, setPreviewLogo] = useState<string>('')
  const [previewCover, setPreviewCover] = useState('')
  const [initialFormData, setInitialFormData] = useState<FormData>({})

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

  const { recruiter, loading } = useAppSelector((app) => app.Auth)
  const dispatch = useAppDispatch()

  useEffect(() => {
    JobService.getActivity(dispatch)
  }, [])

  useEffect(() => {
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

  const handleLogoChange = (info: UploadChangeParam<UploadFile>) => {
    setLogoList(info.fileList) // Update the logoList state
    onUploadChange(info, 'logo') // Handle base64 conversion and preview update
  }

  const handleCoverChange = (info: UploadChangeParam<UploadFile>) => {
    onUploadChange(info, 'cover')
  }

  const updateCompanyInfo = () => {
    const formDataObj = new FormData()
    const formValues = form.getFieldsValue(true)
    const mergedValues = { ...formData, ...formValues }
    const changedValues: { [key: string]: any } = {} // Định nghĩa kiểu cho changedValues

    Object.keys(mergedValues).forEach((key) => {
      if (key === 'emailLogin') {
        return
      }

      const value = mergedValues[key]
      const originalValue = initialFormData[key as keyof typeof initialFormData]

      if (!isEqual(value, originalValue)) {
        changedValues[key] = value
        if (key !== 'companyLogo' && key !== 'companyCoverPhoto') {
          formDataObj.append(key, typeof value === 'string' ? value : JSON.stringify(value))
        }
      }
    })

    if (mergedValues.companyLogo && mergedValues.companyLogo.slice(-1)[0].originFileObj instanceof File) {
      formDataObj.append('companyLogo', mergedValues.companyLogo.slice(-1)[0].originFileObj)
    }

    if (mergedValues.companyCoverPhoto && mergedValues.companyCoverPhoto.slice(-1)[0].originFileObj instanceof File) {
      formDataObj.append('companyCoverPhoto', mergedValues.companyCoverPhoto.slice(-1)[0].originFileObj)
    }

    for (let [key, value] of formDataObj.entries()) {
      console.log(`${key}: ${value}`)
    }

    if (!isEmpty(changedValues)) {
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
                  rules={[{ required: true, message: 'Vui lòng upload logo của công ty!' }]}
                  valuePropName='fileList'
                  getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                  className='flex-grow w-full'
                >
                  {previewLogo ? (
                    <>
                      <img
                        src={previewLogo}
                        alt='Logo Preview'
                        style={{ width: '250px', height: '250px', marginTop: '10px', cursor: 'pointer' }}
                        onClick={showModal}
                      />
                      <p>Ảnh Preview Logo</p>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={showModal}
                        className='w-[250px] h-[250px] flex items-center justify-center border-dashed border-2 border-black cursor-pointer'
                      >
                        Chọn ảnh logo
                      </div>
                    </>
                  )}

                  <Modal
                    title='Cập nhật avatar'
                    visible={isModalOpen}
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
                    <div className='flex items-center justify-center Crop-Container'>
                      {!!imgSrc && (
                        <ReactCrop
                          crop={crop}
                          onChange={(_, percentCrop) => setCrop(percentCrop)}
                          onComplete={(c) => setCompletedCrop(c)}
                          aspect={aspect}
                        >
                          <img
                            ref={imgRef}
                            alt='Crop me'
                            src={imgSrc}
                            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                            onLoad={onImageLoad}
                          />
                        </ReactCrop>
                      )}
                      {!!completedCrop && (
                        <canvas
                          ref={previewCanvasRef}
                          style={{
                            objectFit: 'cover',
                            width: '250px',
                            height: '250px'
                          }}
                        />
                      )}
                    </div>
                  </Modal>
                </Form.Item>

                <Form.Item
                  name='companyCoverPhoto'
                  label='Ảnh bìa của công ty'
                  getValueFromEvent={(e) => e && e.fileList}
                  rules={[{ required: true, message: 'Vui lòng upload ảnh bìa của công ty!' }]}
                >
                  <Upload
                    listType='picture-card'
                    showUploadList={false}
                    onChange={handleCoverChange}
                    beforeUpload={() => false}
                    className='w-full mb-10'
                  >
                    {previewCover ? (
                      <img
                        src={previewCover}
                        style={{ width: '100%' }}
                        alt='avatar'
                        className='object-cover object-center w-full h-[200px] aspect-video'
                      />
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
