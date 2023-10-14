import classNames from 'classnames'
import { HiEye, HiTrash } from 'react-icons/hi2'
import logo_FPT from '../../../images/logo_FPT.png'

interface UserResumeProps {
  priorityCV: string
  id: string
  name: string
  date: string
  onEdit: () => void
  onDelete: () => void
  onClick: () => void
}

export default function UserResume({ id, priorityCV, name, date, onEdit, onDelete, onClick }: UserResumeProps) {
  return (
    <div className='w-full px-4 mb-8 cursor-pointer sm:w-1/2 lg:w-1/2'>
      <div className='p-6 mb-4 bg-white rounded-lg shadow-md'>
        <div className='flex flex-wrap items-center justify-between mb-4'>
          <img src={logo_FPT} alt='' className='w-12' />
        </div>
        <div className='pt-4 border-t border-gray-200'>
          <h3 className='text-lg font-bold'>{name}</h3>
          <p>Posted at {date}</p>
        </div>
        <div className='flex flex-row justify-end gap-2 mt-4'>
          <button className={classNames(`text-zinc-500 hover:text-yellow-600 focus:text-yellow-600`)} onClick={onEdit}>
            <HiEye />
          </button>
          <button className={classNames(`text-zinc-500 hover:text-red-600 focus:text-red-600`)} onClick={onDelete}>
            <HiTrash />
          </button>
        </div>
      </div>
    </div>
  )
}
