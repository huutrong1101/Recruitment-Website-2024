import React from 'react'
import Container from '../../components/Container/Container'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import RecuiterCard from '../../components/RecuiterCard/RecuiterCard'
import { Input } from 'antd'

function Recruiters() {
  return (
    <Container>
      <div className='mb-4 text-center'>
        <h1 className='text-3xl font-bold leading-8 text-center text-green-600'>Khám phá công ty nổi bật</h1>
        <p>Tra cứu thông tin công ty và tìm kiếm nơi làm việc tốt nhất dành cho bạn</p>
      </div>
      <div className='flex flex-row gap-3 mt-1'>
        <Input
          size='large'
          placeholder='Nhập tên công ty'
          prefix={<UserCircleIcon />}
          className='w-full'
          type='text'
          style={{ width: '100%' }}
        />
        <button
          type='submit'
          className='flex items-center justify-center flex-shrink-0 px-4 py-2 text-white rounded-md bg-emerald-500 hover:bg-emerald-700'
        >
          Tìm kiếm
        </button>
      </div>

      <div className='flex flex-wrap mt-5 -mx-4 '>
        <div className='w-full px-4 mb-8 md:w-1/3'>
          <RecuiterCard />
        </div>
        <div className='w-full px-4 mb-8 md:w-1/3'>
          <RecuiterCard />
        </div>
        <div className='w-full px-4 mb-8 md:w-1/3'>
          <RecuiterCard />
        </div>
      </div>
    </Container>
  )
}

export default Recruiters
