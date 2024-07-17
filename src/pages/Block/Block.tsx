import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BiBlock } from 'react-icons/bi'
import { Transition } from '@headlessui/react'

export default function Block() {
  const navigate = useNavigate()

  const goToHome = () => {
    navigate('/')
  }

  return (
    <div className='w-full flex flex-col items-center justify-center min-h-[80vh]'>
      <div className='flex flex-col w-full px-10 py-8 bg-green-900 shadow-lg rounded-xl md:w-7/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12'>
        {/* Icon */}
        <Transition
          appear={true}
          show={true}
          enter='transform transition duration-[1000ms] ease-in-out'
          enterFrom='opacity-0 scale-50'
          enterTo='opacity-100 scale-100'
        >
          <BiBlock className='mx-auto text-red-500 text-9xl' />
        </Transition>
        {/* Message */}
        <Transition
          appear={true}
          show={true}
          enter='transform transition-all duration-[700ms] delay-700 ease-in-out'
          enterFrom='opacity-0 translate-y-12'
          enterTo='opacity-100 translate-y-0'
        >
          <h1 className='my-4 text-2xl font-bold text-center text-white'>
            Tài khoản của bạn đã bị khóa do vi phạm quy định của hệ thống
          </h1>
        </Transition>
        {/* Contact Info */}
        <Transition
          appear={true}
          show={true}
          enter='transform transition-all duration-[1000ms] delay-1000 ease-in-out'
          enterFrom='opacity-0 translate-y-12'
          enterTo='opacity-100 translate-y-0'
        >
          <div className='text-lg text-teal-300'>
            <h2 className='mb-2 leading-normal'>
              Hãy liên hệ với phía hệ thống quản lý nếu có bất kỳ vấn đề thắc mắc qua các cách thức sau:
            </h2>
            <ul className='list-disc list-inside'>
              <li>Số điện thoại: 0773696410</li>
              <li>Email: nguyennghia193913@gmail.com</li>
            </ul>
          </div>
        </Transition>
        {/* Button */}
        <Transition
          appear={true}
          show={true}
          enter='transform transition-opacity duration-700 delay-[1500ms] ease-in-out'
          enterFrom='opacity-0'
          enterTo='opacity-100'
        >
          <div className='flex justify-center mt-8'>
            <button onClick={goToHome} className='px-6 py-3 text-white bg-blue-500 rounded-md shadow hover:bg-blue-700'>
              Về trang chủ
            </button>
          </div>
        </Transition>
      </div>
    </div>
  )
}
