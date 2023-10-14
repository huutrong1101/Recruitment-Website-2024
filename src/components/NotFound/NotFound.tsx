import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { TbBarrierBlock } from 'react-icons/tb'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className={classNames(`w-full min-h-[80vh] flex flex-col items-center justify-center`)}>
      <div className={classNames(`flex flex-col md:flex-row gap-12 w-4/5`)}>
        <div className={classNames(`text-6xl font-bold flex flex-col items-center gap-4`)}>
          <Transition
            appear={true}
            show={true}
            className={`ease-in-out duration-1000`}
            enterFrom='opacity-0'
            enterTo='opacity-100'
          >
            <TbBarrierBlock />
          </Transition>
          <h1>404</h1>
        </div>
        <div>
          <h2 className={`text-2xl`}>
            The page that you are accessing is not found, or not available. Click{' '}
            <Link className='text-blue-500 underline' to={`/`}>
              here
            </Link>{' '}
            to return home.
          </h2>
        </div>
      </div>
    </div>
  )
}
