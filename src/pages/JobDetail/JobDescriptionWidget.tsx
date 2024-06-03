import classNames from 'classnames'
import { useState } from 'react'
import FavouriteJob from '../../components/FavouriteJob/FavouriteJob'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { Link, useNavigate } from 'react-router-dom'
import { setJobIsApplied, setJobIsFovorited } from '../../redux/reducer/JobDetailSlice'
import JobInformationApplyModal from './JobInformationApplyModal'
import { JobInterface } from '../../types/job.type'
import { CalendarIcon, CurrencyDollarIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Modal, Radio } from 'antd'
import { toast } from 'react-toastify'
import { AdminService } from '../../services/AdminService'
import { UserService } from '../../services/UserService'

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
  const { isApplied, isFavorite } = useAppSelector((state) => state.JobDetail.response)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState('approve')

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

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleConfirmJob = () => {
    if (approvalStatus === 'approve') {
      AdminService.approveJob(job._id, 'accept').then(() => toast.success(`Công việc đã được duyệt thành công`))
    } else if (approvalStatus === 'decline') {
      AdminService.approveJob(job._id, 'decline').then(() =>
        toast.success(`Công việc đã được thêm vào danh sách không duyệt`)
      )
    }
    setIsModalVisible(false)
  }

  const handleCancelConfirmJob = () => {
    setIsModalVisible(false)
  }

  function showFavoriteModal() {
    setVisibleFavoriteModal(true)
  }

  function handleCancel() {
    setVisibleFavoriteModal(false)
  }

  const handleSaveFavorite = () => {
    toast
      .promise(UserService.saveFavoriteJob(job._id), {
        pending: `Công việc đang được lưu vào danh sách`,
        success: `Lưu công việc vào mục yêu thích`
      })
      .then(() => {
        setVisibleFavoriteModal(false)
        dispatch(setJobIsFovorited(true))
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const handleRemoveFavorite = () => {
    // Gọi API xóa công việc khỏi danh sách yêu thích
    toast
      .promise(UserService.deleteFavoriteJob(job._id), {
        pending: `Công việc đang được xóa khỏi danh sách`,
        success: `Xóa công việc khỏi mục yêu thích`
      })
      .then(() => {
        setVisibleFavoriteModal(false)
        dispatch(setJobIsFovorited(false))
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const formatSalary = (salary: string): string => {
    if (salary.toLowerCase() === 'thỏa thuận') {
      return 'Thỏa thuận'
    } else if (salary.includes('-')) {
      const [min, max] = salary.split('-').map((s) => parseInt(s, 10))
      return `${formatNumber(min)} triệu - ${formatNumber(max)} triệu`
    } else {
      const amount = parseInt(salary, 10)
      return `${formatNumber(amount)} triệu`
    }
  }

  const formatNumber = (number: number): string => {
    return (number / 1000000).toLocaleString('vi-VN')
  }

  console.log(job)

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
                        <p className='font-semibold'>{formatSalary(job.salary)}</p>
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
                  onOk={handleConfirmJob}
                  onCancel={handleCancelConfirmJob}
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
                    <p className='break-words line-clamp-2'>{job.companyAddress}</p>
                  </div>
                </div>
                <Link to='/jobs' className={classNames('text-center text-emerald-500 mt-1')}>
                  Xem chi tiết công ty
                </Link>
              </div>
            </div>
          </div>
          {/* <FavouriteJob visible={visibleFavoriteModal} onAccept={handleSaveJob} onCancel={closeModal} /> */}
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
                        <p className='font-semibold'>{formatSalary(job.salary)}</p>
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
                    <>
                      <button
                        className={classNames(
                          `px-3 py-2`,
                          `bg-emerald-500 text-white hover:bg-emerald-600 text-center`,
                          `font-semibold`,
                          `rounded-xl w-3/4`
                        )}
                        onClick={handleNavigateToSignIn}
                      >
                        {isApplied ? <p>ĐÃ ỨNG TUYỂN</p> : <p> ỨNG TUYỂN NGAY</p>}
                      </button>
                      <button
                        className={classNames(
                          `px-3 py-2 w-1/4`,
                          `border-emerald-500 border text-emerald-500 text-center`,
                          `font-semibold`,
                          `rounded-xl`
                        )}
                        onClick={handleNavigateToSignIn}
                      >
                        LƯU TIN
                      </button>
                    </>
                  ) : user && user.role === 'CANDIDATE' ? (
                    <>
                      <button
                        className={classNames(
                          `px-3 py-2`,
                          `bg-emerald-500 text-white hover:bg-emerald-600 text-center`,
                          `font-semibold`,
                          `rounded-xl w-3/4`
                        )}
                        onClick={toggleVisibleApplyModal}
                      >
                        {isApplied ? <p>ỨNG TUYỂN LẠI</p> : <p> ỨNG TUYỂN NGAY</p>}
                      </button>
                      <button
                        className={classNames(
                          `px-3 py-2 w-1/4`,
                          `border-emerald-500 border text-emerald-500 text-center`,
                          `font-semibold`,
                          `rounded-xl`
                        )}
                        onClick={showFavoriteModal} // Gọi hàm này để toggle hiển thị modal
                      >
                        {isFavorite ? 'ĐÃ LƯU' : 'LƯU TIN'}
                      </button>
                      <Modal
                        title={isFavorite ? 'Xác nhận xóa' : 'Xác nhận lưu'}
                        visible={visibleFavoriteModal}
                        onOk={isFavorite ? handleRemoveFavorite : handleSaveFavorite}
                        onCancel={handleCancel}
                        okText={isFavorite ? 'Xóa' : 'Lưu'}
                        cancelText='Hủy'
                        cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
                        width={450}
                      >
                        <p>
                          {isFavorite
                            ? 'Bạn có muốn xóa công việc này khỏi danh sách yêu thích không?'
                            : 'Bạn có muốn lưu công việc này vào danh sách yêu thích không?'}
                        </p>
                      </Modal>
                      <JobInformationApplyModal
                        visible={visibleApplyDialog}
                        onClose={toggleVisibleApplyModal}
                        onApplySucceeded={handleOnApplySucceeded}
                        isApplied={isApplied}
                      />
                    </>
                  ) : (
                    <></>
                  )}
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
                    <p>{job.quantity} nhân viên</p>
                  </div>
                  <div className='flex gap-3'>
                    {/* Đặt flex-shrink-0 để ngăn không cho "Địa điểm" co lại */}
                    <p className='flex-shrink-0 font-medium'>Địa điểm:</p>
                    {/* Cho phép nội dung có thể xuống hàng */}
                    <p className='break-words line-clamp-2'>{job.companyAddress}</p>
                  </div>
                </div>
                <Link to={`/recruiters/${job.companySlug}`} className={classNames('text-center text-emerald-500 mt-1')}>
                  Xem chi tiết công ty
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
