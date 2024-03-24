import { default as classNames, default as classnames } from 'classnames'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import image from '../../../images/sprite.png'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import { useAppSelector } from '../../hooks/hooks'
import Container from '../../components/Container/Container'

export default function Authenticate() {
  const navigate = useNavigate()

  const handleBrowseJobClick = () => {
    navigate(`/jobs`)
  }

  /**
   * If the user is logged in
   */

  return (
    <Container>
      <div className={classnames('flex flex-col md:flex-row gap-12', `min-h-[75vh] mb-36`)}>
        <div className='w-full md:w-1/2 lg:w-5/12 xl:w-4/12 '>
          <Outlet />
        </div>
        {/* Browse Job Frame */}
        <div
          className={classnames(`bg-[#176a4b] rounded-3xl py-4`, `shadow-md`, `relative flex-1 flex flex-col gap-2`)}
        >
          <div className='text-center text-orange'>
            <h1 className={classnames(`font-bold text-3xl leading-10`)}>LỰA CHỌN NGHỀ NGHIỆP</h1>
            <h1 className={classnames(`font-bold text-3xl leading-10`)}>ĐỊNH VỊ TƯƠNG LAI</h1>
          </div>

          <div>
            <img src='https://vcdn-kinhdoanh.vnecdn.net/2021/12/11/FOT2-8900-1639218649.png' alt='' />
          </div>

          <div className='flex flex-row items-center justify-center'>
            <button className={classnames(`border`, `px-3 py-1 rounded-xl`)} onClick={handleBrowseJobClick}>
              <div className='text-white capitalize'>Ứng tuyển ngay</div>
            </button>
          </div>
        </div>
      </div>
    </Container>
  )
}
