import React from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../hooks/hooks'

function Select() {
  return (
    <div
      className='relative flex items-center justify-center gap-5 w-full h-[400px] bg-cover bg-center'
      style={{ backgroundImage: 'url("https://careerhub.hcmute.edu.vn/assets/img/cv.png")' }}
    >
      <div className='absolute inset-0 bg-black bg-opacity-20'></div>
      <div className='z-10 flex flex-col w-1/3 p-6 text-white bg-black bg-opacity-50 rounded-md'>
        <h1 className='mb-4 text-2xl font-bold'>Bạn muốn ứng tuyển ?</h1>
        <Link
          to='/auth/signup'
          className='flex py-3 mt-4 text-white transition duration-300 ease-in-out transform bg-red-500 rounded-md hover:bg-red-600 hover:-translate-y-1'
        >
          <p className='w-full text-center'>Tạo CV ngay</p>
        </Link>
      </div>
      <div className='z-10 flex flex-col w-1/3 p-6 text-white bg-black bg-opacity-50 rounded-md'>
        <h1 className='mb-4 text-2xl font-bold'>Bạn là nhà tuyển dụng ?</h1>
        <Link
          to='/auth/rec-signup'
          className='flex py-3 mt-4 text-white transition duration-300 ease-in-out transform bg-green-500 rounded-md hover:bg-green-600 hover:-translate-y-1'
        >
          <p className='w-full text-center'>Đăng tin tuyển dụng tại đây</p>
        </Link>
      </div>
    </div>
  )
}

export default Select
