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
import banner_1 from '../../../images/banner_1.png'
import banner_2 from '../../../images/banner_2.png'
import banner_3 from '../../../images/banner_3.png'
import banner_4 from '../../../images/banner_4.png'

export default function Banner() {
  const listBanner = [
    { id: 1, img: banner_3 },
    { id: 2, img: banner_2 },
    { id: 3, img: banner_1 },
    { id: 4, img: banner_4 }
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
