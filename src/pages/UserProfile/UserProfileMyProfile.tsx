import classNames from 'classnames'
import moment from 'moment'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AiFillEye, AiOutlineComment } from 'react-icons/ai'
import { HiCalendar, HiEnvelope, HiKey, HiPhone, HiUserCircle, HiMapPin } from 'react-icons/hi2'
import { toast } from 'react-toastify'
import DummyAvatar from '../../components/DummyAvatar/DummyAvatar'
import PrimaryInputFile from '../../components/InputFile/PrimaryInputFile'
import InputIcon from '../../components/InputIcon/InputIcon'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { UserService } from '../../services/UserService'
import { setUser } from '../../redux/reducer/AuthSlice'
import { Form, Input, DatePicker, Button, Select, Switch, Modal, Checkbox, Pagination } from 'antd'
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone } from 'react-icons/ai'
import { AuthService } from '../../services/AuthService'
import { ResumeResponse } from '../../types/resume.type'
import { getCandidateResume } from '../../services/CandidateService'
import { GrDocumentPdf } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop, convertToPixelCrop } from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'
import { useDebounceEffect } from './AvatarCrop/useDebounceEffect'
import { canvasPreview } from './AvatarCrop/canvasPreview'
import { validatePhone } from '../../utils/validation'

const { Option } = Select

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

function UserProfileInformation() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const { user, loading } = useAppSelector((app) => app.Auth)
  const workStatus = useAppSelector((state) => state.Job.workStatus)
  const dispatch = useAppDispatch()
  const [isUploading, setUploading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [isProfileVisible, setIsProfileVisible] = useState<boolean>(false)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isModalUploadImage, setIsModalUploadImage] = useState<boolean>(false)
  const [resumeListLoadingState, setResumeListLoadingState] = useState(false)
  const [resumeList, setResumeList] = useState<ResumeResponse[]>([])
  const [selectedResumes, setSelectedResumes] = useState<string[]>([])
  const [selectResumeList, setSelectResumeList] = useState<ResumeResponse[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalElement, setTotalElement] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermTemp, setSearchTermTemp] = useState('')

  const [imgSrc, setImgSrc] = useState('')
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState<number | undefined>(undefined)

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
    AuthService.getWorkStatus(dispatch)
  }, [dispatch])

  useEffect(() => {
    if (user && user.allowSearch) {
      setIsProfileVisible(user.allowSearch === true)
    }
    if (user && user.listAllowSearchResume) {
      setSelectedResumes(user.listAllowSearchResume)
    }
  }, [user])

  useEffect(() => {
    fetchListResume(currentPage, pageSize, searchTerm)
  }, [currentPage, pageSize, searchTerm])

  const fetchListResume = async (page: number, limit: number, searchTerm: string) => {
    // setLoading(true)
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
      // setLoading(false)
    }
  }

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page)
    setPageSize(pageSize || 5)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermTemp(e.target.value)
  }

  const handleSearch = () => {
    setSearchTerm(searchTermTemp)
  }

  const handleToggleResumeSelection = (id: string) => {
    const newSelectedResumes = [...selectedResumes]
    const index = newSelectedResumes.indexOf(id)
    if (index !== -1) {
      newSelectedResumes.splice(index, 1)
    } else {
      newSelectedResumes.push(id)
    }
    setSelectedResumes(newSelectedResumes)
  }

  const onSubmit = (values: any) => {
    const allowSearch = isProfileVisible ? 'true' : 'false'

    const selectedResumeIds = selectedResumes
    values.allowSearch = allowSearch
    if (allowSearch === 'true') {
      values.listResume = selectedResumeIds
    }

    toast
      .promise(UserService.updateProfile(values), {
        pending: `Thông tin tài khoản đang được cập nhật`,
        success: `Thông tin đã được cập nhật thành công`
      })
      .then((response) => {
        const result = response.data.metadata
        dispatch(setUser(result))
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const handleToggleProfileVisibility = (checked: boolean) => {
    setIsProfileVisible(checked)
    if (checked) {
      setIsModalVisible(true)
    }
  }

  const handleModalOk = () => {
    const selectedResumesData = resumeList.filter((resume) => selectedResumes.includes(resume._id))
    setSelectResumeList(selectedResumesData)
    setIsModalVisible(false)
  }

  const handleModalCancel = () => {
    setIsProfileVisible(false)
    setIsModalVisible(false)
  }

  function dataURLtoBlob(dataURL: string): Blob {
    const arr: string[] = dataURL.split(',')
    const mime: string | null = arr[0].match(/:(.*?);/)![1]
    const bstr: string = atob(arr[1])
    let n: number = bstr.length
    const u8arr: Uint8Array = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  const handleUploadAvatarModal = () => {
    if (previewCanvasRef.current) {
      const imageData = previewCanvasRef.current.toDataURL('image/png')
      const blobData = dataURLtoBlob(imageData)

      const formData = new FormData()
      formData.append('avatar', blobData, 'avatar.png')

      setUploading(true)
      toast
        .promise(UserService.changeUserAvatar(formData), {
          pending: `Avatar của bạn đang được cập nhật`,
          success: `Cập nhật avatar thành công`
        })
        .then((response) => {
          const result = response.data.metadata
          dispatch(setUser({ ...user, avatar: result.avatar }))
          setUploading(false)
          setIsModalUploadImage(false) // Đóng modal sau khi cập nhật thành công
        })
        .catch((error) => {
          toast.error(error.response.data.message)
          setUploading(false)
        })
    }
  }

  const handleCancelUploadAvatar = () => {
    setIsModalUploadImage(false)
  }

  console.log(user)

  return (
    <div className='p-4 border rounded-xl border-zinc-100'>
      <h1 className={classNames(`text-2xl font-semibold flex-1 md:mb-4`)}>Thông tin cá nhân</h1>
      {/* Whether is loading */}
      {loading === 'pending' ? (
        <LoadSpinner />
      ) : user === null || user === undefined ? (
        // User is not found
        <div>User not found</div>
      ) : (
        <div className={classNames(`flex flex-col md:flex-row gap-6`)}>
          {/* Avatar edit block */}
          <div className={classNames(`flex-row w-full md:w-3/12 flex md:flex-col gap-4 px-4 items-center`)}>
            <div className={classNames(`w-3/12 md:w-auto`)}>
              {user.avatar === undefined || user.avatar === null ? (
                <DummyAvatar iconClassName='text-6xl flex items-center justify-center' wrapperClassName='h-32 w-32' />
              ) : (
                <img src={user.avatar} alt={`${user.name}'s avatar`} className={`rounded-full aspect-square w-full`} />
              )}
            </div>
            <div>
              <div
                className='px-3 py-2 text-white rounded-lg cursor-pointer bg-emerald-500'
                onClick={() => setIsModalUploadImage(true)}
              >
                Đổi avatar
              </div>
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-2'>
            <Form form={form} layout='vertical' onFinish={onSubmit}>
              <Form.Item
                label='Họ tên'
                name='name'
                initialValue={user.name}
                rules={[{ required: true, message: 'Không được để trống' }]}
              >
                <Input prefix={<AiOutlineUser />} />
              </Form.Item>

              <Form.Item
                label='Quê quán'
                name='homeTown'
                initialValue={user.homeTown}
                rules={[{ required: true, message: 'Không được để trống' }]}
              >
                <Input prefix={<HiMapPin />} />
              </Form.Item>

              <Form.Item
                label='Số điện thoại'
                name='phone'
                initialValue={user.phone}
                rules={[{ validator: validatePhone }]}
              >
                <Input prefix={<AiOutlinePhone />} />
              </Form.Item>

              <Form.Item
                label='Ngày sinh'
                name='dateOfBirth'
                initialValue={user && user.dateOfBirth ? moment(user.dateOfBirth) : undefined}
                rules={[{ required: true, message: 'Không được để trống' }]}
              >
                <DatePicker
                  format='DD/MM/YYYY'
                  style={{ width: '100%' }}
                  inputReadOnly={true}
                  placeholder='Chọn ngày'
                />
              </Form.Item>

              <Form.Item
                label='Trạng thái việc làm'
                name='workStatus'
                initialValue={user.workStatus}
                rules={[{ required: true, message: 'Không được để trống' }]}
              >
                <Select placeholder='Chọn trạng thái việc làm' allowClear>
                  {workStatus.map((status, index) => (
                    <Select.Option key={index} value={status}>
                      {status}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label='Giới tính' name='gender' initialValue={user.gender}>
                <Select placeholder='Chọn giới tính' allowClear>
                  <Option value='Nam'>Nam</Option>
                  <Option value='Nữ'>Nữ</Option>
                  <Option value='Khác'>Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={
                  <div>
                    {isProfileVisible ? 'Cho phép NTD tìm kiếm hồ sơ' : 'Chưa cho phép NTD tìm kiếm hồ sơ'}
                    <span className='text-gray-400'>
                      {isProfileVisible
                        ? ' (Khi có cơ hội việc làm phù hợp, NTD sẽ liên hệ và trao đổi với bạn qua Email và Số điện thoại của bạn.)'
                        : ' (Khi bạn cho phép, các NTD uy tín có thể chủ động kết nối và gửi đến bạn những cơ hội việc làm hấp dẫn nhất, giúp nhân đôi hiệu quả tìm việc.)'}
                    </span>
                  </div>
                }
              >
                <Switch checked={isProfileVisible} onChange={handleToggleProfileVisibility} />
                {isProfileVisible && (
                  <div className='flex items-center justify-between px-3 py-2 mt-2 border'>
                    <p>Có {selectedResumes.length} CV đã được chọn</p>
                    <div className='p-2 rounded-lg cursor-pointer bg-slate-300' onClick={() => setIsModalVisible(true)}>
                      Thay đổi
                    </div>
                  </div>
                )}
              </Form.Item>

              <Form.Item className='flex justify-end'>
                <Button type='primary' htmlType='submit'>
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}

      <Modal
        title='Bật tìm việc'
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText='Bật tìm việc ngay'
        cancelText='Tôi không có nhu cầu'
        cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
      >
        <p>Vui lòng lựa chọn các CV bạn muốn bật tìm việc Hoặc click "Tôi không có nhu cầu" để bỏ qua</p>
        <div className={classNames(`mt-4 `)}>
          {resumeListLoadingState ? (
            <div className={`flex flex-row items-center justify-center text-3xl`}>
              <LoadSpinner />
            </div>
          ) : (
            <>
              <div className='flex items-center gap-2 mb-2'>
                <Input
                  placeholder='Tìm kiếm hồ sơ'
                  value={searchTermTemp}
                  onChange={handleSearchInputChange}
                  className='flex-grow'
                />
                <Button onClick={handleSearch} className='text-white'>
                  Tìm kiếm
                </Button>
              </div>
              <div className={classNames(`flex flex-col gap-2  overflow-y-auto `)}>
                {resumeList && resumeList.length === 0 ? (
                  <div className={classNames(`flex flex-col items-center justify-center  text-gray-400`, `gap-4`)}>
                    <GrDocumentPdf className={classNames(`text-3xl`)} />
                    <span>Bạn chưa có hồ sơ nào để ứng tuyển</span>
                  </div>
                ) : (
                  resumeList &&
                  resumeList.map((resumeItem, _index) => (
                    <div key={resumeItem._id} className='flex flex-row items-center w-full gap-2'>
                      <Checkbox
                        checked={selectedResumes.includes(resumeItem._id)}
                        onChange={() => handleToggleResumeSelection(resumeItem._id)}
                      />
                      <button
                        className={classNames(
                          `px-4 py-2 border rounded-xl hover:border-emerald-600 hover:text-emerald-600 w-full`,
                          `flex flex-row gap-4 items-center`,
                          `cursor-pointer`,
                          `text-gray-950`
                        )}
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
                    </div>
                  ))
                )}
              </div>

              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalElement}
                onChange={handlePageChange}
                className='flex items-center justify-center mt-2'
              />
            </>
          )}
        </div>
      </Modal>

      <Modal
        title='Cập nhật avatar'
        visible={isModalUploadImage}
        onOk={handleUploadAvatarModal}
        onCancel={handleCancelUploadAvatar}
        okText='Cập nhật avatar'
        cancelText='Hủy'
        cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
        width={650}
      >
        <div className='mb-3 Crop-Controls'>
          <input type='file' id='fileInput' accept='image/*' onChange={onSelectFile} style={{ display: 'none' }} />
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
                height: '250px',
                borderRadius: '50%'
              }}
            />
          )}
        </div>
      </Modal>
    </div>
  )
}

function UserProfilePassword() {
  const { handleSubmit, control, getValues } = useForm()
  const [form] = Form.useForm()

  const handleChangePassword = (data: any) => {
    const { email, ...rest } = data
    toast
      .promise(UserService.changePassword(rest), {
        pending: `Mật khẩu của bạn đang được cập nhật`,
        success: `Cập nhật mật khẩu thành công`
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const { user } = useAppSelector((app) => app.Auth)

  return (
    <div className='p-4 border rounded-xl border-zinc-100'>
      <h1 className={classNames(`text-2xl font-semibold flex-1 md:mb-4`)}>Mật khẩu</h1>
      <div className={classNames(`flex flex-col md:flex-row gap-6`)}>
        {/* Avatar edit block */}
        <div className={classNames(`w-full md:w-3/12 flex flex-col gap-4 px-4`)}></div>
        <div className='flex flex-col flex-1 gap-2'>
          <Form layout='vertical' onFinish={handleChangePassword} form={form}>
            <Form.Item label='Email đăng nhập' initialValue={user?.email} name='email'>
              <Input prefix={<HiEnvelope />} readOnly />
            </Form.Item>

            <Form.Item
              label='Mật khẩu hiện tại'
              name='currentPassword'
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
            >
              <Input.Password prefix={<HiKey />} />
            </Form.Item>

            <Form.Item
              label='Mật khẩu mới'
              name='newPassword'
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
            >
              <Input.Password prefix={<HiKey />} />
            </Form.Item>

            <Form.Item
              label='Nhập lại mật khẩu mới'
              name='confirmNewPassword'
              rules={[
                { required: true, message: 'Vui lòng nhập lại mật khẩu mới' },
                // Thêm quy tắc để kiểm tra xem confirmPassword có trùng với newPassword hay không
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Hai mật khẩu bạn nhập không khớp!'))
                  }
                })
              ]}
            >
              <Input.Password prefix={<HiKey />} />
            </Form.Item>

            <Form.Item shouldUpdate className='flex flex-row-reverse'>
              {/* Sử dụng Button của Ant Design, không cần className `md:!w-5/12` như ban đầu nếu không cần thiết */}
              <Button type='primary' htmlType='submit'>
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default function UserProfileMyProfile() {
  return (
    <div className={classNames(`flex-1 flex flex-col gap-4`)}>
      {/* Information */}
      <UserProfileInformation />

      {/* Password */}
      <UserProfilePassword />
    </div>
  )
}
