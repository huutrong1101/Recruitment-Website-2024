import React, { useRef, useState } from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

import '../../index.css'

// import required modules
import { Pagination, Autoplay } from 'swiper/modules'
import FormSearch from './FormSearch'
import Container from '../../components/Container/Container'

export default function Banner() {
  const listBanner = [
    { id: 1, img: 'https://vieclam.thegioididong.com/img/mobile/searchv2/detail_banner/common.jpg' },
    { id: 2, img: 'https://fptjobs.com/Media/Images/BannerImages/9222023120000AM744207061920x503.png' },
    { id: 3, img: 'https://fptjobs.com/Media/Images/BannerImages/872023120000AM15651189banner%201920x503.png' },
    { id: 4, img: 'https://fptjobs.com/Media/Images/BannerImages/352024120000AM1350293051920x503@100x.png' }
  ]
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false
      }}
      pagination={{
        clickable: true
      }}
      className='relative mySwiper'
    >
      {listBanner.map((banner) => (
        <SwiperSlide key={banner.id}>
          <div className='w-full h-full md:h-[400px] xl:h-[525px]'>
            <img src={banner.img} alt={`Banner ${banner.id}`} className='object-cover w-full h-full' />
          </div>
        </SwiperSlide>
      ))}

      <div className='absolute inset-x-0 z-10 w-full mx-auto bottom-10'>
        <Container>
          <FormSearch />
        </Container>
      </div>
    </Swiper>
  )
}
