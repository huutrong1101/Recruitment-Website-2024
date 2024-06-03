import { default as classNames } from 'classnames'
import moment from 'moment'
import { HiHeart } from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router-dom'
import { JobInterface } from '../../types/job.type'
import { useState, useEffect } from 'react'
import { Modal, Tooltip } from 'antd'
import { toast } from 'react-toastify'
import { UserService } from '../../services/UserService'
import { useAppSelector } from '../../hooks/hooks'
import { JobService } from '../../services/JobService'

interface JobCardProps {
  job: JobInterface
  isShow: boolean
}

export default function JobCard({ job, isShow }: JobCardProps) {
  const now = moment()
  const created = moment(job.createdAt)
  const duration = moment.duration(now.diff(created))
  const days = duration.asDays()
  const [visibleModal, setVisibleModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const { user } = useAppSelector((state) => state.Auth)
  const navigate = useNavigate()

  const maxCharacters = 25
  const title = job.name

  let shortenedTitle = title

  if (title.length > maxCharacters) {
    shortenedTitle = title.substring(0, maxCharacters) + '...'
  }

  useEffect(() => {
    if (user) {
      JobService.getIfUserFavoriteTheJob(job._id)
        .then((response) => {
          setIsFavorite(response.data.metadata.exist)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [user, job._id])

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      toast
        .promise(UserService.deleteFavoriteJob(job._id), {
          pending: `Đang hủy yêu thích công việc`,
          success: `Đã hủy yêu thích công việc`
        })
        .then(() => {
          setIsFavorite(false)
          setVisibleModal(false)
        })
        .catch((error) => toast.error(error.response.data.message))
    } else {
      toast
        .promise(UserService.saveFavoriteJob(job._id), {
          pending: `Công việc đang được lưu vào danh sách`,
          success: `Lưu công việc vào mục yêu thích`
        })
        .then(() => {
          setIsFavorite(true)
          setVisibleModal(false)
        })
        .catch((error) => toast.error(error.response.data.message))
    }
  }

  const handleCancel = () => {
    setVisibleModal(false)
  }

  const showModal = () => {
    if (user) {
      setVisibleModal(true)
    } else {
      navigate('/auth/login')
    }
  }

  function calculateDaysToDeadline(deadline: any) {
    const deadlineDate = moment(deadline, 'DD/MM/YYYY')
    const now = moment()
    return deadlineDate.diff(now, 'days')
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

  return (
    <>
      <Link to={`/jobs/${job._id}`}>
        <div
          className={classNames(
            'px-4 py-2 bg-white rounded-lg shadow-sm flex flex-col md:flex-col transition-all duration-75 cursor-pointer hover:shadow-md',
            {
              'border-2 border-yellow-400 bg-yellow-50': job.premiumAccount,
              'border hover:border-emerald-500': !job.premiumAccount
            }
          )}
        >
          <div className='flex items-center gap-3'>
            <div className='w-1/4'>
              <img className='object-cover w-full h-full' src={job.companyLogo} alt='' />
            </div>
            <div className='flex flex-col w-3/4 gap-1'>
              {isShow ? (
                <div className='flex flex-col text-xs font-medium text-gray-600 md:text-sm'>
                  <div className='flex items-center justify-between'>
                    <Link to={`/jobs/${job._id}`} className='w-[95%]'>
                      <h3 className='text-xs font-semibold text-gray-700 truncate md:text-sm hover:text-emerald-500'>
                        {job.name}
                      </h3>
                    </Link>
                    <Tooltip title={isFavorite ? 'Hủy thích' : 'Lưu việc'}>
                      <div className={isFavorite ? 'text-red-500' : 'text-gray-500'}>
                        <HiHeart
                          onClick={(e) => {
                            e.preventDefault()
                            showModal()
                          }}
                        />
                      </div>
                    </Tooltip>
                  </div>
                  <p className='text-xs font-medium text-gray-600 md:text-sm '>
                    <span className='font-bold'>Tên công ty:</span>{' '}
                    <span className='hover:text-emerald-500'>{job.companyName}</span>
                  </p>
                  <p>
                    <span className='font-bold'>Nơi làm việc: </span>
                    {job.province}
                  </p>
                  <p>
                    <span className='font-bold'>Cập nhật: </span>
                    {moment(job.updatedAt).format('MM/DD/YYYY')} - Bạn còn
                    <span className='font-semibold'> {calculateDaysToDeadline(job.deadline)} </span>
                    ngày để ứng tuyển.
                  </p>
                  <p>
                    <span className='font-bold'>Vị trí: </span>
                    {job.field} - {job.type}
                  </p>
                  <p>
                    <span className='font-bold'>Mức lương: </span>
                    {formatSalary(job.salary)}
                  </p>
                </div>
              ) : (
                <>
                  <Link to={`/jobs/${job._id}`}>
                    <h3 className='text-xs font-semibold text-gray-700 truncate md:text-sm hover:text-emerald-500'>
                      {job.name}
                    </h3>
                  </Link>

                  <p className='text-xs font-medium text-gray-600 md:text-sm'>CÔNG TY TNHH TUỆ LINH</p>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <button className='inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md'>
                        {formatSalary(job.salary)}
                      </button>
                      <button className='inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md'>
                        {job.province}
                      </button>
                    </div>
                    <Tooltip title={isFavorite ? 'Hủy thích' : 'Lưu việc'}>
                      <div className={isFavorite ? 'text-red-500' : 'text-gray-500'}>
                        <HiHeart
                          onClick={(e) => {
                            e.preventDefault()
                            showModal()
                          }}
                        />
                      </div>
                    </Tooltip>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>

      <Modal
        title={isFavorite ? 'Hủy thích công việc ' : 'Lưu việc vào yêu thích'}
        visible={visibleModal}
        onOk={handleFavoriteToggle}
        onCancel={handleCancel}
        okText={isFavorite ? 'Hủy thích' : 'Lưu'}
        cancelText='Hủy'
        cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
        width={450}
      >
        <p>
          Bạn có muốn{' '}
          {isFavorite ? 'Loại công việc này khỏi danh sách yêu thích' : 'lưu công việc này vào danh sách yêu thích'}?
        </p>
      </Modal>
    </>
  )
}
