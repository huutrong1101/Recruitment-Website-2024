import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, useState } from 'react'
import { HiHeart } from 'react-icons/hi2'
import FavouriteJob from '../../components/FavouriteJob/FavouriteJob'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { Link, useNavigate } from 'react-router-dom'
import { setJobIsApplied } from '../../redux/reducer/JobDetailSlice'
import JobInformationApplyModal from './JobInformationApplyModal'
import qs from 'query-string'
import { AdminJobInterface, JobInterface } from '../../types/job.type'
import { CalendarIcon, CurrencyDollarIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Checkbox, Modal, Radio } from 'antd'
import { toast } from 'react-toastify'
import { AdminService } from '../../services/AdminService'
import type { RadioChangeEvent } from 'antd'

interface JobDescriptionWidgetProps {
  job: JobInterface
  role: string
}

export default function JobDescriptionWidget({ job, role }: JobDescriptionWidgetProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [visibleFavoriteModal, setVisibleFavoriteModal] = useState(false)
  const [visibleApplyDialog, setVisibleApplyDialog] = useState<boolean>(false)
  const { isLoggedIn, user } = useAppSelector((app) => app.Auth)
  const { isApplied } = useAppSelector((state) => state.JobDetail.response)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState('approve')

  function closeModal() {
    setVisibleFavoriteModal(false)
  }

  function openModal() {
    setVisibleFavoriteModal(true)
  }

  const toggleVisibleApplyModal = () => {
    setVisibleApplyDialog((isVisible) => !isVisible)
  }

  const handleSaveJob = () => {
    console.log(job.quantity)
  }

  const handleOnApplySucceeded = () => {
    dispatch(setJobIsApplied(true))

    toggleVisibleApplyModal()
  }

  const handleNavigateToSignIn = () => {
    navigate(`/auth/login`)
    navigate(`/auth/login?from=${encodeURIComponent(window.location.pathname)}`)
  }

  // const handleNavigateToApplicants = () => {
  //   const searchParams = qs.stringify({ job._id })
  //   navigate(`/profile/submitted-jobs?${searchParams}`)
  // }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (approvalStatus === 'approve') {
      AdminService.approveJob(job._id, 'accept').then(() => toast.success(`Công việc đã được duyệt thành công`))
    } else if (approvalStatus === 'decline') {
      AdminService.approveJob(job._id, 'decline').then(() =>
        toast.success(`Công việc đã được thêm vào danh sách không duyệt`)
      )
    }
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      {role === 'admin' ? (
        <div className='mb-5 bg-white'>
          <div className='flex flex-col gap-12 md:flex-row'>
            <div
              className={classNames(
                `flex flex-row bg-white shadow-sm`,
                `rounded-xl px-1 py-3`,
                `gap-2 items-center`,
                `border w-full md:w-8/12`,
                `flex flex-col gap-6`
              )}
            >
              {/* Information */}
              <div className={classNames(`flex flex-col w-full items-center`)}>
                <div className='flex flex-col text-[15px] font-medium text-gray-600 w-full'>
                  <h2 className='text-lg font-semibold text-center text-gray-700'>{job.name}</h2>
                  <div className='flex items-center justify-center w-full mt-3'>
                    <div className='flex items-center justify-center w-full gap-3 px-3 mb-6 sm:w-1/2 lg:w-1/3'>
                      <div className='p-3 text-white bg-green-500 rounded-full'>
                        <CurrencyDollarIcon className='w-4 h-4' />
                      </div>
                      <div>
                        <h3>Mức lượng</h3>
                        <p className='font-semibold'>{job.salary}</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-center w-full gap-3 px-3 mb-6 sm:w-1/2 lg:w-1/3'>
                      <div className='p-3 text-white bg-green-500 rounded-full'>
                        <MapPinIcon className='w-4 h-4' />
                      </div>
                      <div>
                        <h3>Địa điểm</h3>
                        <p className='font-semibold'>{job.province}</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-center w-full gap-3 px-3 mb-6 sm:w-1/2 lg:w-1/3'>
                      <div className='p-3 text-white bg-green-500 rounded-full'>
                        <CalendarIcon className='w-4 h-4' />
                      </div>
                      <div>
                        <h3>Kinh nghiệm</h3>
                        <p className='font-semibold'>{job.experience}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {job.acceptanceStatus === 'waiting' && (
                  <>
                    <div className='flex items-center justify-center w-full gap-3 px-16 mr-3 font-semibold'>
                      <button
                        className={classNames(
                          `px-3 py-2 w-1/4`,
                          `border-emerald-500 border text-emerald-500 text-center`,
                          `font-semibold`,
                          `rounded-xl`
                        )}
                        onClick={showModal} // Gọi hàm này để hiển thị modal
                      >
                        XỬ LÍ CÔNG VIỆC
                      </button>
                    </div>
                    <Modal
                      title='Xác nhận công việc'
                      visible={isModalVisible}
                      onOk={handleOk}
                      onCancel={handleCancel}
                      okText='Xử lý'
                      cancelText='Hủy'
                      cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
                      width={450}
                    >
                      <div className='flex flex-col gap-1'>
                        <p>Chọn trạng thái xử lí công việc</p>
                        <Radio.Group onChange={(e) => setApprovalStatus(e.target.value)} value={approvalStatus}>
                          <Radio value='approve'>Duyệt công việc</Radio>

                          <Radio value='decline'>Không duyệt công việc</Radio>
                        </Radio.Group>
                      </div>
                    </Modal>
                  </>
                )}
              </div>
            </div>
            <div className={classNames(`w-full md:w-3/12 flex-1 relative`)}>
              <div
                className={classNames(`w-full bg-white shadow-sm px-4 py-2 rounded-xl border`, `flex flex-col gap-1`)}
              >
                <div className='flex items-center gap-3'>
                  <img className='w-16 h-16' src={job.companyLogo} alt='' />
                  <h3>{job.companyName}</h3>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-3'>
                    <p className='font-medium'>Quy mô:</p>
                    <p>10-24 nhân viên</p>
                  </div>
                  <div className='flex gap-3'>
                    {/* Đặt flex-shrink-0 để ngăn không cho "Địa điểm" co lại */}
                    <p className='flex-shrink-0 font-medium'>Địa điểm:</p>
                    {/* Cho phép nội dung có thể xuống hàng */}
                    <p className='break-words'>{job.companyAddress}</p>
                  </div>
                </div>
                <Link to='/jobs' className={classNames('text-center text-emerald-500 mt-1')}>
                  Xem chi tiết công ty
                </Link>
              </div>
            </div>
          </div>
          <FavouriteJob visible={visibleFavoriteModal} onAccept={handleSaveJob} onCancel={closeModal} />
        </div>
      ) : (
        <div className='mb-5 bg-white'>
          <div className='flex flex-col gap-12 md:flex-row'>
            <div
              className={classNames(
                `flex flex-row bg-white shadow-sm`,
                `rounded-xl px-1 py-3`,
                `gap-2 items-center`,
                `border w-full md:w-8/12`,
                `flex flex-col gap-6`
              )}
            >
              {/* Information */}
              <div className={classNames(`flex flex-col w-full items-center`)}>
                <div className='flex flex-col text-[15px] font-medium text-gray-600 w-full'>
                  <h2 className='text-lg font-semibold text-center text-gray-700'>{job.name}</h2>
                  <div className='flex items-center justify-center w-full mt-3'>
                    <div className='flex items-center justify-center w-full gap-3 px-3 mb-6 sm:w-1/2 lg:w-1/3'>
                      <div className='p-3 text-white bg-green-500 rounded-full'>
                        <CurrencyDollarIcon className='w-4 h-4' />
                      </div>
                      <div>
                        <h3>Mức lượng</h3>
                        <p className='font-semibold'>{job.salary} triệu</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-center w-full gap-3 px-3 mb-6 sm:w-1/2 lg:w-1/3'>
                      <div className='p-3 text-white bg-green-500 rounded-full'>
                        <MapPinIcon className='w-4 h-4' />
                      </div>
                      <div>
                        <h3>Địa điểm</h3>
                        <p className='font-semibold'>{job.province}</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-center w-full gap-3 px-3 mb-6 sm:w-1/2 lg:w-1/3'>
                      <div className='p-3 text-white bg-green-500 rounded-full'>
                        <CalendarIcon className='w-4 h-4' />
                      </div>
                      <div>
                        <h3>Kinh nghiệm</h3>
                        <p className='font-semibold'>{job.experience}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex w-full gap-3 px-16 mr-3 font-semibold'>
                  {!isLoggedIn ? (
                    <button
                      className={classNames(
                        `px-3 py-2`,
                        `bg-emerald-500 text-white hover:bg-emerald-600 text-center`,
                        `font-semibold`,
                        `rounded-xl w-3/4`
                      )}
                      onClick={handleNavigateToSignIn}
                    >
                      ỨNG TUYỂN NGAY
                    </button>
                  ) : user && user.role === 'CANDIDATE' ? (
                    <>
                      {!isApplied ? (
                        <button
                          className={classNames(
                            `px-3 py-2`,
                            `bg-emerald-500 text-white hover:bg-emerald-600 text-center`,
                            `font-semibold`,
                            `rounded-xl w-3/4`
                          )}
                          onClick={toggleVisibleApplyModal}
                        >
                          ỨNG TUYỂN NGAY
                        </button>
                      ) : (
                        <button
                          className={classNames(
                            `px-3 py-2`,
                            `bg-emerald-500 text-white hover:bg-emerald-600 text-center`,
                            `font-semibold`,
                            `rounded-xl w-3/4`
                          )}
                          onClick={toggleVisibleApplyModal}
                        >
                          ỨNG TUYỂN NGAY
                        </button>
                      )}
                      <JobInformationApplyModal
                        visible={visibleApplyDialog}
                        onClose={toggleVisibleApplyModal}
                        onApplySucceeded={handleOnApplySucceeded}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  <button
                    className={classNames(
                      `px-3 py-2 w-1/4`,
                      `border-emerald-500 border text-emerald-500 text-center`,
                      `font-semibold`,
                      `rounded-xl`
                    )}
                  >
                    LƯU TIN
                  </button>
                </div>
              </div>
            </div>
            <div className={classNames(`w-full md:w-3/12 flex-1 relative`)}>
              <div
                className={classNames(`w-full bg-white shadow-sm px-4 py-2 rounded-xl border`, `flex flex-col gap-1`)}
              >
                <div className='flex items-center gap-3'>
                  <img className='w-16 h-16' src={job.companyLogo} alt='' />
                  <h3>{job.companyName}</h3>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-3'>
                    <p className='font-medium'>Quy mô:</p>
                    <p>10-24 nhân viên</p>
                  </div>
                  <div className='flex gap-3'>
                    {/* Đặt flex-shrink-0 để ngăn không cho "Địa điểm" co lại */}
                    <p className='flex-shrink-0 font-medium'>Địa điểm:</p>
                    {/* Cho phép nội dung có thể xuống hàng */}
                    <p className='break-words'>{job.companyAddress}</p>
                  </div>
                </div>
                <Link to='/jobs' className={classNames('text-center text-emerald-500 mt-1')}>
                  Xem chi tiết công ty
                </Link>
              </div>
            </div>
          </div>
          <FavouriteJob visible={visibleFavoriteModal} onAccept={handleSaveJob} onCancel={closeModal} />
        </div>
      )}
    </>
  )
}
