import React from 'react'
import { Link } from 'react-router-dom'

function CandidateCard() {
  return (
    <Link
      to='/recruiter/profile/jobsPosted/listCandidate/6634399b7e09cd1bcf5039b4/candidateDetail/1'
      className='flex items-start justify-start p-4 border rounded-xl'
    >
      <div className='flex w-3/4 gap-3'>
        <div className='w-1/4'>
          <img
            className='object-cover w-full h-full'
            src='https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-6/383005012_3507763142868958_6312876464459408848_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFG17PJy6F3b6fobFtoyM8mlLTrn7d0lAeUtOuft3SUBwkPTRrokWUBdKsxZpNxECky-ylKwanw_91UodAGvhqz&_nc_ohc=SvtdTYfrmM4Q7kNvgExhvNG&_nc_ht=scontent.fhan3-2.fna&oh=00_AYCFOQbw9P4Yi3Q5193ZreVY1933q8QCZXup5WTsBkFFUQ&oe=6644E778'
            alt=''
          />
        </div>
        <div className='flex flex-col w-3/4 gap-2'>
          <p className='text-base font-medium text-black md:text-sm'>
            <span className='font-bold'>NGUYỄN HỮU TRỌNG</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Học vấn:</span> <span className='hover:text-emerald-500'>Đại học</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Ngành:</span> <span className='hover:text-emerald-500'>CNKT Máy tính</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Loại hình công việc:</span>{' '}
            <span className='hover:text-emerald-500'>Toàn thời gian</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Kinh nghiệm làm việc:</span>{' '}
            <span className='hover:text-emerald-500'>2 năm</span>
          </p>
          <p className='text-xs font-medium text-gray-600 md:text-sm '>
            <span className='font-bold'>Cập nhật lần cuối:</span>{' '}
            <span className='hover:text-emerald-500'>11/05/2024 13:40</span>
          </p>
        </div>
      </div>
      <div className='flex justify-end w-1/4'>
        <div className='block w-1/2 p-3 text-center border rounded-xl bg-emerald-300 text-emerald-700'>Đã nhận</div>
      </div>
    </Link>
  )
}

export default CandidateCard
