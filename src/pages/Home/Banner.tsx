import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

import '../../index.css'

// import required modules
import { Pagination, Autoplay } from 'swiper/modules'

export default function Banner() {
  const listBanner = [
    { id: 1, img: 'https://fptjobs.com/Media/Images/BannerImages/352024120000AM1350293051920x503@100x.png' },
    { id: 2, img: 'https://fptjobs.com/Media/Images/BannerImages/9222023120000AM744207061920x503.png' },
    { id: 3, img: 'https://fptjobs.com/Media/Images/BannerImages/872023120000AM15651189banner%201920x503.png' },
    { id: 4, img: 'https://fptjobs.com/Media/Images/BannerImages/5102023120000AM148543911920x503.png' }
  ]
  return (
    <Swiper
      modules={[Pagination, Autoplay]} // Thêm module Autoplay
      loop={true} // Dùng vòng lặp
      autoplay={{
        // Cần có {}
        delay: 2500,
        disableOnInteraction: false // Khi tương tác sẽ không dừng lại
      }}
      pagination={{
        clickable: true
      }}
      className='mySwiper'
    >
      {listBanner.map((banner) => (
        <SwiperSlide key={banner.id}>
          <div className='w-full h-full md:h-[400px] xl:h-[500px]'>
            <img src={banner.img} alt={`Banner ${banner.id}`} className='object-cover w-full h-full' />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
