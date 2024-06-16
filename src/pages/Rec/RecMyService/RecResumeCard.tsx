import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ResumeResponse } from '../../../types/resume.type'
import { Button, Modal, Tooltip } from 'antd'
import { HeartIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/react/20/solid'
import { toast } from 'react-toastify'
import { RecService } from '../../../services/RecService'
import { useAppSelector } from '../../../hooks/hooks'

interface ResumeCardProps {
  resume: ResumeResponse
  removeFavoriteResume?: (resumeId: string) => void
}

function RecResumeCard({ resume, removeFavoriteResume }: ResumeCardProps) {
  const [isFavoriteModalVisible, setIsFavoriteModalVisible] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { recruiter } = useAppSelector((state) => state.Auth)

  useEffect(() => {
    if (recruiter) {
      RecService.getIfRecFavoriteTheResume(resume._id)
        .then((response) => {
          setIsFavorite(response.data.metadata.exist)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [recruiter, resume._id])

  // Xử lý hiển thị modal
  const showFavoriteModal = () => {
    setIsFavoriteModalVisible(true)
  }

  // Xử lý khi nhấn vào nút cancel trên Modal
  const handleCancel = () => {
    setIsFavoriteModalVisible(false)
  }

  const toggleFavorite = () => {
    if (isFavorite) {
      handleRemoveFavorite()
    } else {
      handleAddFavorite()
    }
  }

  const handleAddFavorite = async () => {
    toast
      .promise(RecService.saveFavoriteResume(resume._id), {
        pending: `Hồ sơ đang được lưu vào danh sách`,
        success: `Lưu hồ sơ vào mục yêu thích`
      })
      .then(() => {
        setIsFavorite(true)
        setIsFavoriteModalVisible(false)
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const handleRemoveFavorite = async () => {
    toast
      .promise(RecService.removeFavoriteResume(resume._id), {
        pending: `Hồ sơ đang được xóa khỏi danh sách`,
        success: `Xóa hồ sơ khỏi mục yêu thích`
      })
      .then(() => {
        setIsFavorite(false)
        setIsFavoriteModalVisible(false)
        removeFavoriteResume && removeFavoriteResume(resume._id)
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const favoriteButton = isFavorite ? (
    <Tooltip placement='topRight' title='Bỏ yêu thích'>
      <Button onClick={showFavoriteModal} danger style={{ backgroundColor: 'transparent' }}>
        <SolidHeartIcon className='w-4 h-4 text-red-500' />
      </Button>
    </Tooltip>
  ) : (
    <Tooltip placement='topRight' title='Yêu thích'>
      <Button onClick={showFavoriteModal} danger style={{ backgroundColor: 'transparent' }}>
        <HeartIcon className='w-4 h-4' />
      </Button>
    </Tooltip>
  )
  return (
    <div className='flex items-start justify-start p-4 border rounded-xl'>
      <div className='flex w-3/4 gap-3'>
        <div className='w-1/4'>
          <img className='object-cover w-full h-full' src={resume.avatar} alt='' />
        </div>
        <div className='flex flex-col w-3/4 gap-2'>
          <p className='text-base font-medium text-black md:text-sm'>
            <span className='font-bold'>{resume.title}</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Tên:</span> <span className='hover:text-emerald-500'>{resume.name}</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Học vấn:</span>{' '}
            <span className='hover:text-emerald-500'>{resume.educationLevel}</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Ngành:</span> <span className='hover:text-emerald-500'>{resume.major}</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Loại hình công việc:</span>{' '}
            <span className='hover:text-emerald-500'>{resume.jobType}</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Kinh nghiệm làm việc:</span>{' '}
            <span className='hover:text-emerald-500'>{resume.experience}</span>
          </p>
        </div>
      </div>
      <div className='flex justify-end w-1/4'>
        <div className={`w-1/2 p-1 flex flex-col items-center justify-end gap-3`}>
          <Tooltip placement='topRight' title='Xem chi tiết'>
            <Link to={`/recruiter/profile/service/findCandidate/${resume._id}`}>
              <Button type='primary'>
                <PencilSquareIcon className='w-4 h-4' />
              </Button>
            </Link>
          </Tooltip>

          {favoriteButton}

          <Modal
            title={isFavorite ? 'Bỏ khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
            visible={isFavoriteModalVisible}
            onOk={toggleFavorite}
            onCancel={handleCancel}
            okText={isFavorite ? 'Bỏ yêu thích' : 'Lưu'}
            cancelText='Hủy'
            cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
            width={450}
          >
            <p>Bạn có muốn {isFavorite ? 'bỏ hồ sơ này khỏi' : 'thêm hồ sơ này vào'} danh sách yêu thích không?</p>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default RecResumeCard
