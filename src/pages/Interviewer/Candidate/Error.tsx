import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { TbBarrierBlock } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { STATUS } from '../../../utils/contanst'

const Error = (props: any) => {
  const { errorCode } = props
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
          <h1>{errorCode}</h1>
        </div>
        <div>
          <h2 className={`text-2xl`}>
            {errorCode === STATUS.ERROR500 && (
              <p>
                Oops! Something went wrong on our end. We are experiencing technical difficulties and our team is
                already working to fix it. Please try again later. We apologize for the inconvenience.
              </p>
            )}
            {errorCode === STATUS.ERROR404 && (
              <p>
                Oops! The page you are looking for could not be found. It might have been moved, deleted, or never
                existed in the first place. Please check the URL.
              </p>
            )}
            Click{' '}
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
export default Error
