import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import {
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  MapIcon,
  MapPinIcon,
  UserCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import GoogleMapReact from 'google-map-react'
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminService } from '../../../services/AdminService'
import parse from 'html-react-parser'
import { Button, Checkbox, Input, Modal, Radio, Spin, Tag, Tooltip } from 'antd'
import { toast } from 'react-toastify'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { setCompanyDetail } from '../../../redux/reducer/AdminSlice'

const AnyReactComponent = (props: { lat: number; lng: number; text: React.ReactNode }) => <div>{props.text}</div>

const declineReasons = [
  { id: '1', reason: 'Không đáp ứng tiêu chuẩn chất lượng' },
  { id: '2', reason: 'Nội dung không phù hợp' },
  { id: '3', reason: 'Yêu cầu công việc không hợp lý' },
  { id: '4', reason: 'Công việc không phù hợp với ngành nghề' }
]

function AdminManageCompanyDetail() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { companyId } = useParams()

  const { companyDetail } = useAppSelector((state) => state.AdminSlice)
  const [coords, setCoords] = useState({ lat: 0, lng: 0 })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState('approve')
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [shortenedDescription, setShortenedDescription] = useState('')
  const [showMoreButton, setShowMoreButton] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const [checkAll, setCheckAll] = useState(false)
  const [selectedDeclineReasons, setSelectedDeclineReasons] = useState<string[]>([])
  const [declineReason, setDeclineReason] = useState('')
  const [isReasonEmpty, setIsReasonEmpty] = useState(false)
  const [isModalReason, setIsModalReason] = useState(false)

  useEffect(() => {
    const fetchCoords = async () => {
      if (companyDetail && companyDetail.companyAddress) {
        try {
          const result = await geocodeByAddress(companyDetail.companyAddress)
          const lnglat = await getLatLng(result[0])
          setCoords(lnglat)
        } catch (error) {
          console.error('Error fetching coordinates for address:', companyDetail.companyAddress, error)
        }
      }
    }

    if (companyDetail && companyDetail.about) {
      const fullDescription = companyDetail.about
      const shortened = truncate(fullDescription, 167)
      setShortenedDescription(shortened)
      setShowMoreButton(fullDescription.length > 167)
    }

    fetchCoords()
  }, [companyDetail])

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true)
      try {
        if (companyId) {
          await AdminService.getCompanyDetail(dispatch, companyId)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetails()
  }, [dispatch, companyId])

  const showModal = () => {
    setIsModalVisible(true)
  }

  const truncate = (text: string, maxLength: number) => {
    const words = text.split(' ')
    if (words.length > maxLength) {
      return words.slice(0, maxLength).join(' ') + '...'
    } else {
      return text
    }
  }

  const handleOk = async () => {
    if (approvalStatus === 'approve' && companyDetail) {
      try {
        toast
          .promise(AdminService.approveCompany(companyDetail._id, 'accept', ''), {
            pending: `Quá trình xử lí đang diễn ra`,
            success: `Công ty đã được duyệt thành công`
          })
          .then((response) => {
            const updatedJob = { ...companyDetail, acceptanceStatus: 'accept' }
            dispatch(setCompanyDetail(updatedJob))
            setIsModalVisible(false)
          })
          .catch((error) => {
            toast.error(error.response.data.message)
          })
      } catch (error) {
        toast.error('Có lỗi xảy ra khi duyệt công ty')
        console.error(error)
      }
    } else if (approvalStatus === 'decline' && companyDetail) {
      if (!declineReason.trim()) {
        toast.error('Vui lòng nhập lý do khi không duyệt công ty.')
        return
      }
      try {
        toast
          .promise(AdminService.approveCompany(companyDetail._id, 'decline', declineReason), {
            pending: `Quá trình xử lí đang diễn ra`,
            success: `Công ty đã được thêm vào danh sách không duyệt`
          })
          .then((response) => {
            const updatedJob = { ...companyDetail, acceptanceStatus: 'decline', declineReason: declineReason }
            dispatch(setCompanyDetail(updatedJob))
            setIsModalVisible(false)
          })
          .catch((error) => {
            toast.error(error.response.data.message)
          })
      } catch (error) {
        toast.error('Có lỗi xảy ra khi từ chối công ty')
        console.error(error)
      }
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleNavigateEdit = () => {
    navigate(`/admin/manage_companies/editCompany/${companyDetail?._id}`)
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
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

  const handleCheckboxChange = (checkedValues: string[]) => {
    setSelectedDeclineReasons(checkedValues)
    const selectedReasonTexts = checkedValues.join(', ') // Tạo chuỗi từ các lý do được chọn
    setDeclineReason(selectedReasonTexts) // Cập nhật state declineReason
    setCheckAll(checkedValues.length === declineReasons.length)
  }

  const showModalReason = () => {
    setIsModalReason(true)
  }

  const handleCancelReason = () => {
    setIsModalReason(false)
  }

  return (
    <>
      {isLoading ? (
        <div className='flex justify-center items-center my-4 min-h-[70vh]'>
          <Spin size='large' />
        </div>
      ) : companyDetail ? (
        <>
          <div className='flex flex-col gap-12 md:flex-row'>
            <div
              className={classNames(
                `flex flex-row bg-white shadow-sm`,
                `rounded-xl`,
                `items-center`,
                `border w-full md:w-full`,
                `flex flex-col`
              )}
            >
              <div className={classNames('w-full shadow relative')}>
                <img
                  src={companyDetail.companyCoverPhoto}
                  alt='blog_image'
                  className={classNames('w-full h-[200px] object-center object-cover aspect-video rounded-t-md')}
                />
                <img
                  className='absolute bottom-[-50px] left-[50px] w-32 h-32 border-2 rounded-full'
                  src={companyDetail.companyLogo}
                  alt=''
                />
              </div>
              <div className='flex items-center w-full gap-3 bg-emerald-500'>
                <div className='w-1/6'></div>
                <div className='flex items-center justify-between w-5/6 p-5'>
                  <div className='flex flex-col gap-3 text-white'>
                    <h1 className='text-lg font-bold'>{companyDetail.companyName}</h1>
                    <div className='flex flex-row gap-10 text-base'>
                      <div className='flex items-center gap-1'>
                        <GlobeAltIcon className='w-4 h-4' />
                        <p>{companyDetail.companyWebsite}</p>
                      </div>
                      <div className='flex items-center gap-1'>
                        <BuildingLibraryIcon className='w-4 h-4' />
                        <p>{companyDetail.employeeNumber} nhân viên</p>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      className={classNames('bg-white text-emerald-500 font-bold p-3 rounded-md flex')}
                      onClick={handleNavigateEdit}
                    >
                      CHỈNH SỬA
                    </button>
                    <button
                      className={classNames('bg-white text-emerald-500 font-bold p-3 rounded-md flex')}
                      onClick={showModal}
                    >
                      XỬ LÍ
                    </button>

                    <Modal
                      title='Xác nhận công ty'
                      open={isModalVisible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      okText='Xử lý'
                      cancelText='Hủy'
                      cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
                    >
                      <div className='flex flex-col gap-1'>
                        <p className='font-bold'>Chọn trạng thái xử lí công ty</p>
                        <Radio.Group onChange={(e) => setApprovalStatus(e.target.value)} value={approvalStatus}>
                          <Radio value='approve'>Duyệt công ty</Radio>
                          <Radio value='decline'>Không duyệt công ty</Radio>
                        </Radio.Group>
                        {/* Hiển thị ô nhập lý do nếu chọn "Không nhận hồ sơ" */}
                        {approvalStatus === 'decline' && (
                          <>
                            <div className='flex items-center gap-2'>
                              <div className='font-bold'>Chọn lý do không duyệt công việc:</div>
                            </div>
                            <Checkbox onChange={handleCheckAllChange} checked={checkAll}>
                              Chọn tất cả
                            </Checkbox>
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
                              <div className='font-bold'>Lý do không duyệt công việc:</div>
                              <Input.TextArea
                                style={{ minHeight: '200px', borderColor: isReasonEmpty ? '#ff4d4f' : '' }}
                                value={declineReason}
                                onChange={(e) => {
                                  setDeclineReason(e.target.value)
                                  if (e.target.value.trim()) {
                                    setIsReasonEmpty(false) // Nếu người dùng bắt đầu nhập, ẩn cảnh báo
                                  }
                                }}
                                placeholder='Nhập lý do không nhận hồ sơ'
                              />
                              {isReasonEmpty && (
                                <div style={{ color: '#ff4d4f', marginTop: '5px' }}>
                                  Vui lòng nhập lý do khi không duyệt công việc.
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classNames(`flex flex-col md:flex-row gap-12 mt-8 mb-8`)}>
            <div className={classNames(`w-full md:w-8/12`, `flex flex-col gap-6`)}>
              <div className={classNames('w-full shadow')}>
                <div className={classNames('w-full h-[50px] rounded-t-md bg-emerald-500 p-4')}>
                  <h2 className='text-lg font-semibold text-white'>Thông tin công ty</h2>
                </div>
                <div className='flex flex-col gap-8 p-6'>
                  {companyDetail.acceptanceStatus === 'decline' ? (
                    <Tooltip placement='top' title={'Xem lí do'} arrow={true}>
                      <Tag
                        color={'error'}
                        className='w-1/5 py-1 font-medium text-center uppercase cursor-pointer'
                        onClick={showModalReason}
                      >
                        Không được duyệt
                      </Tag>
                    </Tooltip>
                  ) : (
                    <Tag
                      color={`${companyDetail.acceptanceStatus === 'accept' ? 'success' : 'default'}`}
                      className='w-1/5 py-1 font-medium text-center uppercase'
                    >
                      {companyDetail.acceptanceStatus === 'accept' ? 'Đã duyệt' : 'Đang chờ duyệt'}
                    </Tag>
                  )}
                  <Modal
                    title='Lý do không được duyệt'
                    open={isModalReason}
                    onCancel={handleCancelReason}
                    footer={[
                      <Button key='ok' type='primary' onClick={handleCancelReason}>
                        OK
                      </Button>
                    ]}
                  >
                    <p>{companyDetail?.reasonDecline}</p>
                  </Modal>
                  <div>
                    <h1 className='text-xl font-semibold capitalize'>Giới thiệu công ty</h1>
                    <div>
                      {showFullDescription ? (
                        <div>{companyDetail && parse(companyDetail.about)}</div>
                      ) : (
                        <div>{parse(shortenedDescription)}</div>
                      )}
                      {showMoreButton && (
                        <button onClick={toggleDescription} className='mt-2 text-emerald-500'>
                          {showFullDescription ? (
                            <div className='flex items-center gap-1'>
                              <p>Rút gọn</p>
                              <ArrowUpOutlined />
                            </div>
                          ) : (
                            <div className='flex items-center gap-1'>
                              <p>Xem thêm</p>
                              <ArrowDownOutlined />
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <h1 className='text-xl font-semibold capitalize'>Lĩnh vực hoạt động</h1>
                    <p className='pl-3 mt-2 whitespace-pre-line'>{companyDetail.fieldOfActivity.join(', ')}</p>
                  </div>
                  <div>
                    <h1 className='text-xl font-semibold capitalize'>Thông tin người đại diện</h1>
                    <div className='flex flex-col gap-2 pl-3 mt-2 whitespace-pre-line'>
                      <p>
                        <span className='font-semibold'>Người đại diện:</span> {companyDetail.name}
                      </p>
                      <p>
                        <span className='font-semibold'>Chức vụ:</span> {companyDetail.position}
                      </p>
                      <p>
                        <span className='font-semibold'>Số điện thoại:</span> {companyDetail.phone}
                      </p>
                      <p>
                        <span className='font-semibold'>Email:</span> {companyDetail.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={classNames(`w-full md:w-3/12 flex-1 relative`)}>
              <div className={classNames('w-full shadow')}>
                <div className={classNames('w-full h-[50px] rounded-t-md bg-emerald-500 p-4')}>
                  <h2 className='text-lg font-semibold text-white'>Thông tin liên hệ</h2>
                </div>
                <div className='p-6'>
                  <div className='flex flex-col gap-2 pb-5 border-b-2 border-b-slate-300'>
                    <div className='flex gap-2'>
                      <MapPinIcon className='w-6 h-6 text-emerald-500' />
                      <p>Địa chỉ công ty</p>
                    </div>
                    <p className='text-[#4d5965] font-normal text-sm'>{companyDetail.companyAddress}</p>
                  </div>

                  <div className='flex flex-col gap-2 mt-5'>
                    <div className='flex gap-2'>
                      <MapIcon className='w-6 h-6 text-emerald-500' />
                      <p>Xem bản đồ</p>
                    </div>
                    <div>
                      <div style={{ height: '250px', width: '100%' }}>
                        <GoogleMapReact
                          bootstrapURLKeys={{ key: 'AIzaSyDiTFSvK7eZQoKZkBVSmzybVvuG4aY0m6A' }}
                          defaultCenter={coords}
                          center={coords}
                          defaultZoom={11}
                        >
                          <AnyReactComponent
                            lat={coords.lat}
                            lng={coords.lng}
                            text={<MapPinIcon className='w-6 h-6 text-red-500' />}
                          />
                        </GoogleMapReact>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center w-full'>
          <p>Không tìm thấy công ty phù hợp</p>
        </div>
      )}
    </>
  )
}

export default AdminManageCompanyDetail
