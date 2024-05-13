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
import { useParams } from 'react-router-dom'
import { AdminService } from '../../../services/AdminService'
import parse from 'html-react-parser'
import { Modal, Radio } from 'antd'
import { toast } from 'react-toastify'

const AnyReactComponent = (props: { lat: number; lng: number; text: React.ReactNode }) => <div>{props.text}</div>

function AdminManageCompanyDetail() {
  const dispatch = useAppDispatch()
  const { companyId } = useParams()

  const { companyDetail } = useAppSelector((state) => state.AdminSlice)
  const [coords, setCoords] = useState({ lat: 0, lng: 0 })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState('approve')

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

    fetchCoords()
  }, [companyDetail])

  useEffect(() => {
    if (companyId) {
      AdminService.getCompanyDetail(dispatch, companyId)
    }
  }, [dispatch, companyId])

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (approvalStatus === 'approve' && companyDetail) {
      AdminService.approveCompany(companyDetail._id, 'accept').then(() => {
        toast.success(`Công ty đã được duyệt thành công`)
        console.log('check')
      })
    } else if (approvalStatus === 'decline' && companyDetail) {
      AdminService.approveCompany(companyDetail._id, 'decline').then(() =>
        toast.success(`Công ty đã được thêm vào danh sách không duyệt`)
      )
    }
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      {companyDetail ? (
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
                  <div>
                    <button
                      className={classNames('bg-white text-emerald-500 font-bold p-3 rounded-md flex')}
                      onClick={showModal}
                    >
                      XỬ LÍ
                    </button>
                    <Modal
                      title='Xác nhận công ty'
                      visible={isModalVisible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      okText='Xử lý'
                      cancelText='Hủy'
                      cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
                      width={450}
                    >
                      <div className='flex flex-col gap-1'>
                        <p>Chọn trạng thái xử lí công ty</p>
                        <Radio.Group onChange={(e) => setApprovalStatus(e.target.value)} value={approvalStatus}>
                          <Radio value='approve'>Duyệt công ty</Radio>

                          <Radio value='decline'>Không duyệt công ty</Radio>
                        </Radio.Group>
                      </div>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classNames(`flex flex-col md:flex-row gap-12 mt-8 mb-8`)}>
            <div className={classNames(`w-full md:w-8/12`, `flex flex-col gap-6`)}>
              {/* GIỚI THIỆU CÔNG TY  */}
              <div className={classNames('w-full shadow')}>
                <div className={classNames('w-full h-[50px] rounded-t-md bg-emerald-500 p-4')}>
                  <h2 className='text-lg font-semibold text-white'>Thông tin công ty</h2>
                </div>
                <div className='flex flex-col gap-8 p-6'>
                  <div>
                    <h1 className='text-xl font-semibold capitalize'>Giới thiệu công ty</h1>
                    <p className='pl-3 mt-2 whitespace-pre-line'>{parse(companyDetail.about)}</p>
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
        <div>Loading...</div>
      )}
    </>
  )
}

export default AdminManageCompanyDetail
