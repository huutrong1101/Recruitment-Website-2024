import classNames from 'classnames'
import React from 'react'
import { RecruiterResponseState } from '../../types/user.type'
import parse from 'html-react-parser'
import { Link } from 'react-router-dom'

interface RecuiterCardProps {
  recruiter: RecruiterResponseState
}

function RecuiterCard({ recruiter }: RecuiterCardProps) {
  return (
    <Link
      to={`/recruiters/${recruiter.slug}`}
      className={classNames(
        `bg-white rounded-lg shadow-sm border hover:border-emerald-500`,
        `ease-in-out duration-75 hover:shadow-md`,
        `flex flex-col h-full`,
        `transition-all ease-in-out duration-75`,
        `cursor-pointer`
      )}
    >
      <div className='relative w-full shadow'>
        <div className='h-[150px] box-border'>
          <img
            src={recruiter.companyCoverPhoto}
            alt='Company cover'
            className='object-cover w-full h-full max-w-full align-middle rounded-t-md'
            loading='lazy'
          />
        </div>
        <div className='absolute bottom-[-20px] left-5'>
          <img
            className='object-cover w-1/4 h-full border'
            src={recruiter.companyLogo}
            alt={`${recruiter.companyName} logo`}
            loading='lazy'
          />
        </div>
      </div>

      <div className='flex flex-col items-center flex-grow gap-1 px-4 py-2'>
        <div className='flex items-center gap-3 mt-5'>
          <h3 className='text-base font-semibold text-left text-black uppercase hover:text-emerald-500'>
            {recruiter.companyName}
          </h3>
        </div>
        <div className='text-[#555] text-sm pt-4 flex-grow'>
          <p className='line-clamp-5'>{parse(recruiter.about)}</p>
        </div>
      </div>
    </Link>
  )
}

export default RecuiterCard
