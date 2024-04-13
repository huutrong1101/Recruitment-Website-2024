import { default as classNames, default as classnames } from 'classnames'
import moment from 'moment'
import { HiComputerDesktop, HiMapPin, HiMiniUser, HiUser, HiHeart } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import { JobInterface } from '../../types/job.type'
import { JOB_POSITION } from '../../utils/Localization'
import logo_FPT from '../../../images/logo_FPT.png'
import { useState } from 'react'
import FavouriteJob from '../FavouriteJob/FavouriteJob'

interface JobCardProps {
  job: JobInterface
  isShow: boolean
}

export default function JobCard({ job, isShow }: JobCardProps) {
  const now = moment()
  const created = moment(job.createdAt)
  const duration = moment.duration(now.diff(created))
  const days = duration.asDays()
  let [visibleDeleteModal, setVisibleDeleteModal] = useState(false)

  const maxCharacters = 25 // Số ký tự tối đa bạn muốn hiển thị
  // const title = job.name
  const title = 'TRAINEE PHÁT TRIỂN PHẦN MỀM NHÚNG'

  let shortenedTitle = title

  if (title.length > maxCharacters) {
    shortenedTitle = title.substring(0, maxCharacters) + '...'
  }

  function closeModal() {
    setVisibleDeleteModal(false)
  }

  function openModal() {
    setVisibleDeleteModal(true)
  }

  const handleSaveJob = () => {
    console.log(job.name)
  }

  return (
    <>
      <div
        className={classNames(
          `px-4 py-2 bg-white rounded-lg shadow-sm border hover:border-emerald-500`,
          `ease-in-out duration-75 hover:shadow-md`,
          `flex flex-col md:flex-col`,
          `transition-all ease-in-out duration-75`,
          `cursor-pointer`
        )}
      >
        <div className='flex items-center gap-3'>
          <div className='w-1/4'>
            <img
              className='object-cover w-full h-full'
              src='https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dana-139c6d216ab5b2c1f012449d3c30c0ec-65fb8d6f41f1c.jpg'
              alt=''
            />
          </div>
          <div className='flex flex-col w-3/4 gap-1'>
            {isShow ? (
              <div className='flex flex-col text-xs font-medium text-gray-600 md:text-sm'>
                <div className='flex items-center justify-between'>
                  <Link to={`/jobs/${job.jobId}`}>
                    <h3 className='text-xs font-semibold text-gray-700 md:text-sm hover:text-emerald-500'>
                      {isShow ? title : shortenedTitle}
                    </h3>
                  </Link>
                  <div className='text-red-500'>
                    <HiHeart />
                  </div>
                </div>
                <p className='text-xs font-medium text-gray-600 md:text-sm '>
                  <span className='font-bold'>Tên công ty:</span>{' '}
                  <span className='hover:text-emerald-500'>CÔNG TY TNHH TUỆ LINH</span>
                </p>
                <p>
                  <span className='font-bold'>Nơi làm việc: </span>Thành phố Hồ Chí Minh
                </p>
                <p>
                  <span className='font-bold'>Cập nhật: </span>3/29/2024 - Bạn còn{' '}
                  <span className='font-semibold'>61</span> ngày để ứng truyển.
                </p>
                <p>
                  <span className='font-bold'>Vị trí: </span>Kỹ thuật - Toàn thời gian
                </p>
                <p>
                  <span className='font-bold'>Mức lương: </span>Thỏa thuận
                </p>
              </div>
            ) : (
              <>
                <Link to={`/jobs/${job.jobId}`}>
                  <h3 className='text-xs font-semibold text-gray-700 md:text-sm hover:text-emerald-500'>
                    {isShow ? title : shortenedTitle}
                  </h3>
                </Link>

                <p className='text-xs font-medium text-gray-600 md:text-sm'>CÔNG TY TNHH TUỆ LINH</p>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <button className='inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md'>
                      Thỏa thuận
                    </button>
                    <button className='inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md'>
                      Hà Nội
                    </button>
                  </div>
                  <div className='text-red-500'>
                    <HiHeart />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
