import { Transition } from '@headlessui/react'
import { Button, Result } from 'antd'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  const handleBackHome = () => {
    navigate('/')
  }
  return (
    <div className={classNames(`w-full min-h-[80vh] flex flex-col items-center justify-center`)}>
      <div className={classNames(`flex flex-col md:flex-row gap-12 w-4/5 justify-center items-center`)}>
        <Transition
          appear={true}
          show={true}
          className={`ease-in-out duration-1000`}
          enterFrom='opacity-0'
          enterTo='opacity-100'
        >
          <Result
            status='404'
            title='404'
            subTitle='Trang bạn truy cập không tồn tại'
            extra={
              <Button type='primary' onClick={handleBackHome}>
                Trở về trang chủ
              </Button>
            }
          />
        </Transition>
      </div>
    </div>
  )
}
