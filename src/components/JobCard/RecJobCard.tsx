import { CurrencyDollarIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import React from 'react'
import { HiHeart } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

function RecJobCard() {
  return (
    <div
      className={classNames(
        `px-4 py-2 bg-white rounded-lg shadow-sm border hover:border-emerald-500`,
        `ease-in-out duration-75 hover:shadow-md`,
        `flex flex-col md:flex-col`,
        `transition-all ease-in-out duration-75`,
        `cursor-pointer`
      )}
    >
      <div className='flex items-center gap-5'>
        <div className='w-1/6'>
          <img
            className='object-cover w-[120px] h-[120px]'
            src='https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dana-139c6d216ab5b2c1f012449d3c30c0ec-65fb8d6f41f1c.jpg'
            alt=''
          />
        </div>

        <div className='flex flex-col w-5/6 gap-4'>
          <div className='flex justify-between'>
            <div className='flex flex-col gap-2'>
              <Link to={``}>
                <h3 className='text-lg font-semibold leading-6 text-black hover:text-emerald-500'>
                  Front End Developer
                </h3>
              </Link>

              <p className='text-base font-normal leading-5 text-gray-700 truncate'>CÔNG TY TNHH TUỆ LINH</p>
            </div>
            <div className='flex gap-1 text-emerald-500'>
              <CurrencyDollarIcon className='w-6 h-6' />
              <p>Thỏa thuận</p>
            </div>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <button className='inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md'>
                Hà Nội
              </button>
              <button className='inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md'>
                Còn 87 ngày để ứng tuyển
              </button>
            </div>
            <div className='flex items-center gap-3'>
              <button className='px-2 py-1 text-sm text-white rounded-md bg-emerald-500'>Ứng tuyển</button>
              <HiHeart className='w-6 h-6 text-emerald-500' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecJobCard
