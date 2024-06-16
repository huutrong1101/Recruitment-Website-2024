import React from 'react'
import { Link } from 'react-router-dom'
import { RecruiterResponseState } from '../../types/user.type'
import { StarIcon } from '@heroicons/react/24/outline'

interface RecCardProps {
  rec: RecruiterResponseState
}

function RecCard({ rec }: RecCardProps) {
  return (
    <Link
      to={`recruiters/${rec.slug}`}
      className='flex flex-col items-center justify-between h-full p-4 bg-white border border-gray-300 rounded-xl hover:border-emerald-500'
    >
      {rec.premiumAccount && (
        <div className='absolute p-2 border-2 border-yellow-400 rounded-full opacity-95 top-2 left-2 bg-yellow-50'>
          <StarIcon className='w-4 h-4 text-yellow-500' />
        </div>
      )}
      <img src={rec.companyLogo} alt='' className='object-contain w-16 h-16 mb-2' />
      <p className='text-center text-sm font-semibold min-h-[3rem] flex items-center justify-center limited-lines'>
        {rec.companyName}
      </p>
    </Link>
  )
}

export default RecCard
