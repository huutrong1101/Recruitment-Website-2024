import { default as classNames, default as classnames } from 'classnames'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import image from '../../../images/sprite.png'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import { useAppSelector } from '../../hooks/hooks'

export default function Authenticate() {
  const navigate = useNavigate()

  const handleBrowseJobClick = () => {
    navigate(`/jobs`)
  }

  /**
   * If the user is logged in
   */

  return (
    <div className={classnames('flex flex-col md:flex-row gap-12', `min-h-[75vh] mb-36`)}>
      <div className='w-full md:w-1/2 lg:w-5/12 xl:w-4/12 '>
        <Outlet />
      </div>
      {/* Browse Job Frame */}
      <div
        className={classnames(`bg-[#176A4B] rounded-3xl px-6 py-4`, `shadow-md`, `relative flex-1 flex flex-col gap-6`)}
      >
        <h1 className={classnames(`text-white`, `font-bold text-3xl leading-10`)}>
          There are more than a thousand career opportunities for you
        </h1>
        <p className={classnames(`text-[#89EFC9] text-[20px]`, `leading-tight`)}>
          We understand that you are expecting to have the best jobs. By joining JobPort, you are going to whitelist
          onto the top recruiter company around the world.
        </p>

        <div className='flex flex-row'>
          <button className={classnames(`border`, `px-3 py-1 rounded-xl`)} onClick={handleBrowseJobClick}>
            <div className='text-white '>Browse jobs</div>
          </button>
        </div>

        <img
          alt='Authenticate block decoration'
          src={image}
          className={classnames(
            `right-0 opacity-100`,

            `w-[200px]`,
            `hidden sm:block sm:absolute bottom-[-240px] md:bottom-[-32px]`
          )}
        />
      </div>
    </div>
  )
}
