import classNames from 'classnames'
import React from 'react'

function RecJobRealtedCard() {
  return (
    <div
      className={classNames(
        `px-4 py-4 bg-white rounded-lg shadow-sm border hover:border-emerald-500`,
        `ease-in-out duration-75 hover:shadow-md`,
        `flex flex-col md:flex-col`,
        `transition-all ease-in-out duration-75`,
        `cursor-pointer`
      )}
    >
      <div className='flex items-center gap-3'>
        <div className='w-1/5'>
          <img
            className='object-cover w-full h-full'
            src='https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dana-139c6d216ab5b2c1f012449d3c30c0ec-65fb8d6f41f1c.jpg'
            alt=''
          />
        </div>
        <div className='w-4/5'>
          <h3 className='text-xs font-semibold text-gray-700 md:text-sm hover:text-emerald-500'>
            CÔNG TY CỔ PHẦN ĐẦU TƯ THƯƠNG MẠI VÀ PHÁT TRIỂN CÔNG NGHỆ FSI
          </h3>
          <div className='flex items-center justify-between mt-3'>
            <button className='inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md'>
              13 việc làm
            </button>
            <button className='inline-flex items-center px-3 py-2 text-xs font-medium text-white rounded-md bg-emerald-500'>
              Theo dõi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecJobRealtedCard
