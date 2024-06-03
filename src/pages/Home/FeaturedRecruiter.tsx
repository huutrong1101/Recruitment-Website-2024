import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { RecruiterResponseState } from '../../types/user.type'
import { RecService } from '../../services/RecService'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/pagination'
import { Link } from 'react-router-dom'
import RecCard from '../../components/JobCard/RecCard'

export default function FeaturedRecruiter() {
  const dispatch = useAppDispatch()
  const listRec: RecruiterResponseState[] = useAppSelector((state) => state.RecJobs.listRec)

  useEffect(() => {
    RecService.getListRec(dispatch)
  }, [dispatch])

  return (
    <div className='mt-10 md:mt-20'>
      <div className='text-center'>
        <h3 className='text-2xl font-bold tracking-wider'>NHÀ TUYỂN DỤNG NỔI BẬT</h3>
      </div>
      <div className='mt-2'>
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false
          }}
          loop={true} // Thêm dòng này
          modules={[Autoplay, Navigation]}
        >
          {listRec.map((item) => (
            <>
              <SwiperSlide key={item._id}>
                <RecCard rec={item} />
              </SwiperSlide>

              <SwiperSlide key={item._id}>
                <RecCard rec={item} />
              </SwiperSlide>

              <SwiperSlide key={item._id}>
                <RecCard rec={item} />
              </SwiperSlide>
            </>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
