import classNames from 'classnames'
import React from 'react'

function RecuiterCard() {
  return (
    <div
      className={classNames(
        ` bg-white rounded-lg shadow-sm border hover:border-emerald-500`,
        `ease-in-out duration-75 hover:shadow-md`,
        `flex flex-col md:flex-col`,
        `transition-all ease-in-out duration-75`,
        `cursor-pointer`
      )}
    >
      <div className={classNames('w-full shadow relative')}>
        <img
          src='https://static.topcv.vn/company_covers/cong-ty-tnhh-mtv-vien-thong-quoc-te-fpt-d3875e922aae8e448c57c760a55305ca-617fa613e3ddf.jpg'
          alt='blog_image'
          className={classNames('w-full h-[150px] object-cover aspect-video rounded-t-md')}
        />
        <div className='absolute bottom-[-20px] left-5'>
          <img
            className='object-cover w-1/4 h-full border'
            src='https://cdn-new.topcv.vn/unsafe/200x/https://static.topcv.vn/company_logos/cong-ty-co-phan-dana-139c6d216ab5b2c1f012449d3c30c0ec-65fb8d6f41f1c.jpg'
            alt=''
          />
        </div>
      </div>

      <div className='flex flex-col items-center gap-1 px-4 py-2'>
        <div className='flex items-center gap-3 mt-5'>
          <h3
            className={classNames(
              'text-black font-semibold text-base hover:text-emerald-500', // Color và font-weight
              'text-left uppercase' // Căn lề và chữ hoa
            )}
          >
            CÔNG TY TNHH LOTTE VIỆT NAM
          </h3>
        </div>
        <div>
          <p>
            " Trở thành người dẫn đầu trong lĩnh vực giáo dục và đào tạo với cam kết mang đến những trải nghiệm học tập
            quý giá, nhằm giúp học viên khám phá bản thân.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RecuiterCard
