import { Button, Form, Input, Modal, Select, Upload, UploadFile, message } from 'antd'
import React, { useRef, useState } from 'react'
import { useAppDispatch } from '../../../../hooks/hooks'
import { useNavigate } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { PlusOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload/interface'
import { toast } from 'react-toastify'
import { AdminService } from '../../../../services/AdminService'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import { useDebounceEffect } from '../../../UserProfile/AvatarCrop/useDebounceEffect'
import { canvasPreview } from '../../../UserProfile/AvatarCrop/canvasPreview'

interface FormData {
  name?: string
  location?: string
  province?: string
  type?: string
  levelRequirement?: string
  experience?: string
  salary?: string
  field?: string
  description?: string
  requirement?: string
  benefit?: string
  quantity?: string
  deadline?: string
  genderRequirement?: string
}

const optionTypeNews = [
  { value: 'Định hướng nghề nghiệp', label: 'Định hướng nghề nghiệp' },
  { value: 'Bí kíp tìm việc', label: 'Bí kíp tìm việc' },
  { value: 'Chế độ lương thưởng', label: 'Chế độ lương thưởng' },
  { value: 'Kiến thức chuyên ngành', label: 'Kiến thức chuyên ngành' }
]

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

function AdminManageAddNew() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({})
  const [form] = Form.useForm()
  const [previewCover, setPreviewCover] = useState('')

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

  const onFinish = () => {
    const formDataObj = new FormData()

    const formValues = form.getFieldsValue(true) // Lấy tất cả giá trị từ form, kể cả những trường không thay đổi
    const mergedValues = { ...formData, ...formValues }

    // Thêm các giá trị từ formData (không phải là files) vào formDataObj
    Object.keys(mergedValues).forEach((key) => {
      const value = mergedValues[key]
      if (key !== 'uploadFile') {
        // Nếu không phải là fieldOfActivity, logo, hoặc ảnh bìa, thêm bình thường.
        formDataObj.append(key, typeof value === 'string' ? value : JSON.stringify(value))
      }
    })

    // Thêm file logo và cover photo vào formDataObj nếu có
    if (mergedValues.uploadFile && mergedValues.uploadFile.slice(-1)[0].originFileObj instanceof File) {
      formDataObj.append('uploadFile', mergedValues.uploadFile.slice(-1)[0].originFileObj)
    }

    formDataObj.forEach((value, key) => {
      console.log(key, value)
    })
    toast
      .promise(AdminService.createNew(formDataObj), {
        pending: `Tin tức đang được khởi tạo`,
        success: `Tin tức đã được khởi tạo thành công.`
      })
      .then((response) => {
        navigate('/admin/manage_news')
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  const handleFormChange = (changedValues: any, allValues: any) => {
    setFormData({ ...formData, ...changedValues })
  }

  const getBase64 = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => callback(reader.result as string)
  }

  const onUploadChange = (info: UploadChangeParam<UploadFile>): void => {
    const latestFile = info.fileList.slice(-1)[0]?.originFileObj
    if (latestFile) {
      getBase64(latestFile, (imageUrl: string) => {
        setPreviewCover(imageUrl)
      })
    }
  }

  const handleCoverChange = (info: UploadChangeParam<UploadFile>) => {
    onUploadChange(info)
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

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    if (completedCrop && previewCanvasRef.current) {
      const canvas = previewCanvasRef.current
      const blob = dataURLtoBlob(canvas.toDataURL('image/png'))
      const file = new File([blob], 'logo.png', { type: 'image/png' })

      // Cập nhật giá trị avatar trong form
      form.setFieldsValue({ uploadFile: [{ originFileObj: file }] })

      // Cập nhật previewAvatar để hiển thị ảnh đã crop
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewCover(reader.result as string)
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

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='w-full p-4'>
        <div className='mb-2'>
          <h1 className='flex-1 text-2xl font-semibold text-center md:mb-4'>Đăng tin tức</h1>
        </div>
        <div className='flex-col gap-6 px-5 marker:flex md:flex-row'>
          <Form
            name='recAddNew'
            form={form}
            onFinish={onFinish}
            onValuesChange={handleFormChange}
            labelCol={{ span: 24 }}
          >
            <Form.Item
              name='uploadFile'
              label='Ảnh thumbnail của bài viết'
              getValueFromEvent={(e) => e && e.fileList}
              valuePropName='fileList'
              rules={[{ required: true, message: 'Vui lòng upload ảnh thumbnail của bài viết!' }]}
              className='flex-grow w-full'
            >
              <div className='flex flex-col items-center justify-center w-full'>
                {previewCover ? (
                  <>
                    <img
                      src={previewCover}
                      alt='Logo Preview'
                      style={{ width: '760px', height: '475px', marginTop: '10px', cursor: 'pointer' }}
                      onClick={showModal}
                    />
                    <p>Ảnh preview bài viết</p>
                  </>
                ) : (
                  <>
                    <div
                      onClick={showModal}
                      className='w-[760px] h-[475px] flex items-center justify-center border-dashed border-2 border-black cursor-pointer'
                    >
                      Chọn ảnh bài viết
                    </div>
                  </>
                )}
              </div>

              <Modal
                title='Cập nhật avatar'
                style={{ top: 20 }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText='Cập nhật ảnh bài viết'
                cancelText='Hủy'
                cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
                width={'100%'}
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
                <div className='flex items-center justify-center w-full Crop-Container'>
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
                        width: '760px',
                        height: '475px'
                      }}
                    />
                  )}
                </div>
              </Modal>
            </Form.Item>

            <div className='flex items-center justify-center gap-2'>
              <Form.Item
                name='name'
                label='Tên bài viết'
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên công việc!'
                  }
                ]}
                className='w-1/2'
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='type'
                label='Loại bài viết'
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên công việc!'
                  }
                ]}
                className='w-1/2'
              >
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder='Loại bài viết'
                  optionFilterProp='label'
                  filterOption={(input, option) =>
                    option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
                  }
                  options={optionTypeNews}
                />
              </Form.Item>
            </div>

            <Form.Item
              name='content'
              label='Nội dung bài viết'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mô tả công việc'
                }
              ]}
            >
              <div style={{ minHeight: '200px', maxHeight: '600px' }}>
                <CKEditor
                  editor={ClassicEditor}
                  data={form.getFieldValue('content') || ''}
                  onChange={(_: any, editor: any) => {
                    const data = editor.getData()
                    form.setFieldsValue({ content: data })
                  }}
                />
              </div>
            </Form.Item>

            <Form.Item className='flex justify-end'>
              <Button type='primary' htmlType='submit'>
                Đăng tin
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default AdminManageAddNew
