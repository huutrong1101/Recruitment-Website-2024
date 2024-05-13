import React, { useEffect, useState } from 'react'
import Container from '../../components/Container/Container'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import RecuiterCard from '../../components/RecuiterCard/RecuiterCard'
import { Input } from 'antd'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { RecruiterResponseState } from '../../types/user.type'
import { RecService } from '../../services/RecService'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'

function Recruiters() {
  const dispatch = useAppDispatch()
  const listRec: RecruiterResponseState[] = useAppSelector((state) => state.RecJobs.listRec)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    RecService.getListRec(dispatch)
  }, [])

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

      {isLoading ? (
        <div className='flex justify-center my-4 min-h-[70vh] flex-col items-center'>
          <LoadSpinner className='text-3xl text-emerald-500' />
        </div>
      ) : (
        <div className='flex flex-wrap mt-5 -mx-4'>
          {listRec.length > 0 ? (
            <>
              {listRec.map((recruiter) => (
                <div className='w-full px-4 mb-8 md:w-1/3' key={recruiter._id}>
                  <RecuiterCard recruiter={recruiter} />
                </div>
              ))}
            </>
          ) : (
            <div className='flex flex-col justify-center w-full mb-10 min-h-[70vh] items-center text-3xl gap-4'>
              <img
                src='https://cdni.iconscout.com/illustration/premium/thumb/error-404-4344461-3613889.png'
                alt=''
                className='h-[300px]'
              />
              <span>Không tìm thấy công ty phù hợp.</span>
            </div>
          )}
        </div>
      )}
    </Container>
  )
}

export default Recruiters
