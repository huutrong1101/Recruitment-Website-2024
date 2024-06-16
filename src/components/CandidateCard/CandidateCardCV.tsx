import React from 'react'
import { Link } from 'react-router-dom'
import { ResumeResponse } from '../../types/resume.type'
import { ArrowPathIcon, Cog6ToothIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { Modal, Tooltip } from 'antd'
import { toast } from 'react-toastify'
import { UserService } from '../../services/UserService'
import classNames from 'classnames'

interface ResumeCardProps {
  resume: ResumeResponse
}

function CandidateCardCV({ resume }: ResumeCardProps) {
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [resumeData, setResumeData] = React.useState(resume)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    const newStatus = resumeData.status === 'active' ? 'inactive' : 'active'

    toast
      .promise(UserService.changeResumeStatus(resumeData._id, newStatus), {
        pending: `Trạng thái cv đang được thay đổi`,
        success: `Thay đổi trạng thái thành công`,
        error: `Thay đổi trạng thái thất bại`
      })
      .then(() => {
        setIsModalVisible(false)
        setResumeData((prevState) => ({ ...prevState, status: newStatus }))
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div
      className={classNames('flex flex-col border rounded-xl', {
        'border-2 border-yellow-400 bg-yellow-50': resumeData.allowSearch,
        'border hover:border-emerald-500': !resumeData.allowSearch
      })}
    >
      <div className='flex items-center justify-end gap-2 px-4 py-2 border-b border-b-zinc-200'>
        <Tooltip title='Đổi trạng thái'>
          <button className='flex items-center gap-1 p-2 border rounded-md' onClick={showModal}>
            <ArrowPathIcon className='w-4 h-4' />
          </button>
        </Tooltip>
        <Tooltip title='Xem chi tiết'>
          <Link to={`/profile/resume/edit/${resumeData._id}`} className='flex items-center gap-1 p-2 border rounded-md'>
            <PencilSquareIcon className='w-4 h-4' />
          </Link>
        </Tooltip>
      </div>
      <div className='flex items-start justify-start p-4 '>
        <div className='flex w-3/4 gap-3'>
          <div className='w-1/4'>
            <img className='object-cover w-full h-full' src={resumeData.avatar} alt='' />
          </div>
          <div className='flex flex-col w-3/4 gap-2'>
            <p className='text-base font-medium text-black md:text-sm'>
              <span className='font-bold'>{resumeData.title}</span>
            </p>
            <p className='text-xs font-medium text-gray-600 md:text-sm '>
              <span className='font-bold'>Tên:</span> <span className='hover:text-emerald-500'>{resumeData.name}</span>
            </p>
            <p className='text-xs font-medium text-gray-600 md:text-sm '>
              <span className='font-bold'>Học vấn:</span>{' '}
              <span className='hover:text-emerald-500'>{resumeData.educationLevel}</span>
            </p>

            <p className='text-xs font-medium text-gray-600 md:text-sm '>
              <span className='font-bold'>Loại hình công việc:</span>{' '}
              <span className='hover:text-emerald-500'>{resumeData.jobType}</span>
            </p>
            <p className='text-xs font-medium text-gray-600 md:text-sm '>
              <span className='font-bold'>Kinh nghiệm làm việc:</span>{' '}
              <span className='hover:text-emerald-500'>{resumeData.experience}</span>
            </p>
            <p className='text-xs font-medium text-gray-600 md:text-sm '>
              <span className='font-bold'>Cập nhật lần cuối:</span>{' '}
              <span className='hover:text-emerald-500'>{resumeData.updatedAt}</span>
            </p>
          </div>
        </div>
        <div className='flex justify-end w-1/4'>
          {resumeData.status === 'active' ? (
            <div className='block float-right w-1/2 p-2 text-xs font-bold text-center uppercase text-emerald-700'>
              Kích hoạt
            </div>
          ) : (
            <div className='block float-right w-1/2 p-2 text-xs font-bold text-center text-red-500 uppercase'>
              Không kích hoạt
            </div>
          )}
        </div>
      </div>
      <Modal
        title='Xác nhận thay đổi trạng thái'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText='Hủy'
        cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
        width={450}
      >
        <p>Bạn có chắc chắn muốn thay đổi trạng thái của cv này không?</p>
      </Modal>
    </div>
  )
}

export default CandidateCardCV
