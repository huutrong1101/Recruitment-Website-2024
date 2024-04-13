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
      <div className={classnames('flex flex-col items-center justify-center md:flex-row gap-12')}>
        <div className='w-full md:w-1/2 lg:w-5/12 xl:w-6/12'>
          <Outlet />
        </div>
      </div>
    </Container>
  )
}
