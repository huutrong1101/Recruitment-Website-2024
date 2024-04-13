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
import { JobInterface } from '../../types/job.type'
import { CalendarIcon, CurrencyDollarIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface JobDescriptionWidgetProps {
  companyName: string
  jobRole: string
  publishDate: string
  quantity: number
  jobId: string

  logo: {
    src: any
    alt: string
  }
}

export default function JobDescriptionWidget({
  companyName,
  jobRole,
  publishDate,
  quantity,
  logo,
  jobId
}: JobDescriptionWidgetProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [visibleFavoriteModal, setVisibleFavoriteModal] = useState(false)

  const [visibleApplyDialog, setVisibleApplyDialog] = useState<boolean>(false)
  const { isLoggedIn, user } = useAppSelector((app) => app.Auth)
  const { isApplied } = useAppSelector((state) => state.JobDetail.response)

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
    console.log(quantity)
  }

  const handleOnApplySucceeded = () => {
    dispatch(setJobIsApplied(true))

    toggleVisibleApplyModal()
  }

  const handleNavigateToSignIn = () => {
    navigate(`/auth/login`)
    navigate(`/auth/login?from=${encodeURIComponent(window.location.pathname)}`)
  }

  const handleNavigateToApplicants = () => {
    const searchParams = qs.stringify({ jobId })
    navigate(`/profile/submitted-jobs?${searchParams}`)
  }

  return (
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
              <h2 className='text-lg font-semibold text-center text-gray-700'>KỸ SƯ THIẾT KẾ BO MẠCH BÁN DẪN</h2>
              <div className='flex items-center justify-center w-full mt-3'>
                <div className='flex items-center justify-center w-full gap-3 px-3 mb-6 sm:w-1/2 lg:w-1/3'>
                  <div className='p-3 text-white bg-green-500 rounded-full'>
                    <CurrencyDollarIcon className='w-4 h-4' />
                  </div>
                  <div>
                    <h3>Mức lượng</h3>
                    <p className='font-semibold'>18 - 30 triệu</p>
                  </div>
                </div>
                <div className='flex items-center justify-center w-full gap-3 px-3 mb-6 sm:w-1/2 lg:w-1/3'>
                  <div className='p-3 text-white bg-green-500 rounded-full'>
                    <MapPinIcon className='w-4 h-4' />
                  </div>
                  <div>
                    <h3>Địa điểm</h3>
                    <p className='font-semibold'>Hà Nội</p>
                  </div>
                </div>
                <div className='flex items-center justify-center w-full gap-3 px-3 mb-6 sm:w-1/2 lg:w-1/3'>
                  <div className='p-3 text-white bg-green-500 rounded-full'>
                    <CalendarIcon className='w-4 h-4' />
                  </div>
                  <div>
                    <h3>Kinh nghiệm</h3>
                    <p className='font-semibold'>2 năm</p>
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
          <div className={classNames(`w-full bg-white shadow-sm px-4 py-2 rounded-xl border`, `flex flex-col gap-1`)}>
            <div className='flex items-center gap-3'>
              <img
                className='w-16 h-16'
                src='https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dana-139c6d216ab5b2c1f012449d3c30c0ec-65fb8d6f41f1c.jpg'
                alt=''
              />
              <h3>Công Ty TNHH Kỹ Thuật Dịch Vụ Tân Tiến</h3>
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
                <p className='break-words'>272 Nguyễn Đăng Đạo , Thành phố Bắc Ninh, Tỉnh Bắc Ninh,</p>
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
  )
}
