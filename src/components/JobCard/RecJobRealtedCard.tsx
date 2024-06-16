import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { RecruiterResponseState } from '../../types/user.type'
import { useAppSelector } from '../../hooks/hooks'
import { RecService } from '../../services/RecService'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'antd'

interface RecCardProps {
  rec: RecruiterResponseState
}

function RecJobRealtedCard({ rec }: RecCardProps) {
  const { user } = useAppSelector((state) => state.Auth)

  const navigate = useNavigate()

  const [isFavorite, setIsFavorite] = useState(false)
  const [visibleModal, setVisibleModal] = useState(false)

  useEffect(() => {
    if (user) {
      RecService.getIfUserFavoriteTheRec(rec.slug)
        .then((response) => {
          setIsFavorite(response.data.metadata.exist)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [user, rec._id])

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      toast
        .promise(RecService.removeFavoriteRec(rec._id), {
          pending: `Đang hủy theo dõi công ty`,
          success: `Hủy theo dõi công ty thành công`
        })
        .then(() => {
          setIsFavorite(false)
          setVisibleModal(false)
        })
        .catch((error) => toast.error(error.response.data.message))
    } else {
      toast
        .promise(RecService.saveFavoriteRec(rec._id), {
          pending: `Đang tiến hành theo dõi công ty`,
          success: `Theo dõi công ty thành công`
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
  return (
    <div
      className={classNames(
        `px-4 py-4 bg-white rounded-lg shadow-sm border hover:border-emerald-500`,
        `ease-in-out duration-75 hover:shadow-md`,
        `flex flex-col md:flex-col`,
        `transition-all ease-in-out duration-75`,
        `cursor-pointer`
      )}
    >
      <div className='flex items-center gap-3'>
        <div className='w-1/5'>
          <img className='object-cover w-full h-full' src={rec.companyLogo} alt={rec.companyName} />
        </div>
        <div className='w-4/5'>
          <h3 className='text-xs font-semibold text-gray-700 md:text-sm hover:text-emerald-500'>{rec.companyName}</h3>
          <div className='flex items-center justify-between mt-3'>
            <button className='inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md'>
              {rec.activeJobCount} việc làm
            </button>
            <button
              className='inline-flex items-center px-3 py-2 text-xs font-medium text-white rounded-md bg-emerald-500'
              onClick={(e) => {
                showModal()
              }}
            >
              {isFavorite ? <p>Đang theo dõi</p> : <p> Theo dõi</p>}
            </button>
          </div>
        </div>
      </div>

      <Modal
        title={isFavorite ? 'Xác nhận xóa' : 'Xác nhận theo dõi'}
        visible={visibleModal}
        onOk={handleFavoriteToggle}
        onCancel={handleCancel}
        okText={isFavorite ? 'Xóa' : 'Lưu'}
        cancelText='Hủy'
        cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
        width={450}
      >
        <p>
          Bạn có muốn{' '}
          {isFavorite ? 'loại công ty này khỏi danh sách yêu thích' : 'lưu công ty này vào danh sách yêu thích'}?
        </p>
      </Modal>
    </div>
  )
}

export default RecJobRealtedCard
