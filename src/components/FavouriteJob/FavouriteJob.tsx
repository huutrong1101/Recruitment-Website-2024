import React from 'react'
import Modal from '../Modal/Modal'

interface FavouriteJobProps {
  visible: boolean
  onCancel: () => void
  onAccept: () => void
}

function FavouriteJob({ visible, onCancel, onAccept }: FavouriteJobProps) {
  return (
    <Modal
      isOpen={visible}
      onClose={onCancel}
      title='Thêm vào mục yêu thích'
      cancelTitle='Không'
      successClass='text-green-900 bg-green-100 hover:bg-green-200 focus-visible:ring-green-500'
      successTitle='Có'
      handleSucces={onAccept}
      titleClass='text-orange text-center text-lg'
      size=''
    >
      <p className='text-sm text-gray-500'>Bạn có muốn thêm công việc này vào danh sách công việc yêu thích không ?</p>
    </Modal>
  )
}

export default FavouriteJob
