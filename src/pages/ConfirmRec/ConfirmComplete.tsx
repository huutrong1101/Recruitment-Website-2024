import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { RiMoonClearLine } from 'react-icons/ri'

const REDIRECT_DURATION = 15
function ConfirmComplete() {
  const [showing, setShowing] = useState(false)
  const [redirectCount, setRedirectCount] = useState<number>(REDIRECT_DURATION)
  const navigate = useNavigate()

  useEffect(() => {
  
    const timeoutId = setTimeout(() => {
      setShowing(true)
    }, 1)

    const intervalId = setInterval(() => {
      if (redirectCount >= 0) {
        setRedirectCount((count) => count - 1)
      }
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
      setShowing(false)
    }
  }, [])

  useEffect(() => {
    if (redirectCount <= 0) {
      handleReturnHome()
    }
  }, [redirectCount])

  const handleReturnHome = () => {
    navigate('/')
  }

  return (
    <div className='w-full flex flex-col items-center justify-center min-h-[80vh]'>
    <Transition
      show={showing}
      className={classNames(
        `px-10 py-8 rounded-[35px] w-full md:w-7/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12`,
        `bg-emerald-700`,
        `flex flex-col shadow-lg`
      )}
    >
      {/* Icons */}
      <div>
        <Transition appear={true} show={showing}>
          <Transition.Child
            className='flex flex-col items-center transition-all duration-700 ease-in-out'
            enter=' transform-gpu opacity-0 scale-50 rotate-180'
            enterFrom='transform-gpu opacity-0  scale-50 rotate-180'
            enterTo='transform-gpu opacity-100 scale-100 rotate-0'
          >
            <RiMoonClearLine className={classNames(`text-[#87D3B7] w-1/2 text-9xl`)} />
          </Transition.Child>
        </Transition>
      </div>

      <Transition
        appear={true}
        show={showing}
        className={`transition-all ease-in-out duration-700 delay-700`}
        enter='transform-gpu opacity-0'
        enterFrom='transform-gpu opacity-0 translate-y-12'
        enterTo='transform-gpu opacity-100 translate-y-0'
      >
       <div className='flex flex-col items-center justify-center text-center text-white'>
       <h1 className={classNames(` text-3xl font-light leading-10 my-4`)}>
          Cập nhật thông tin thành công. Bạn sẽ nhận được thông báo khi được ban quản trị duyệt thông tin.
        </h1>
        <p>Chuyển về trang chủ trong {redirectCount} giây.</p>
       </div>
      </Transition>

      <Transition
        show={showing}
        appear={true}
        className={`transition-all ease-in-out duration-700 delay-1000`}
        enter='transform opacity-0'
        enterFrom=' opacity-0 '
        enterTo='opacity-100'
      >
        <div className={classNames(`mt-8 flex flex-row-reverse`)}>
          <PrimaryButton onClick={handleReturnHome} text='Về trang chủ' />
        </div>
      </Transition>
    </Transition>
  </div>
  )
}

export default ConfirmComplete