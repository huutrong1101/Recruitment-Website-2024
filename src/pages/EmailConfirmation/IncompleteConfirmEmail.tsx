import { Transition } from '@headlessui/react'
import { EnvelopeIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'

export default function IncompleteConfirmEmail() {
  const navigate = useNavigate()
  const handleResendEmail = () => {
    toast.warning(`Resend email logic not initialize.`)
    // navigate("/email/complete");
  }

  return (
    <div
      className={classNames(
        `px-10 py-8 rounded-[35px] w-full md:w-7/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12`,
        `bg-[#176A4B]`,
        `flex flex-col shadow-lg`
      )}
    >
      {/* Icons */}
      <div>
        <Transition appear={true} show={true}>
          <Transition.Child
            className='flex flex-col items-center transition-all duration-700 ease-in-out'
            enter=' transform opacity-0 scale-50'
            enterFrom='transform opacity-0  scale-50'
            enterTo='transform opacity-100 scale-100'
          >
            <EnvelopeIcon className={classNames(`text-[#87D3B7] w-1/2`)} />
          </Transition.Child>
        </Transition>
      </div>

      <Transition
        appear={true}
        show={true}
        className={`transition-all ease-in-out duration-700 delay-700`}
        enter='transform opacity-0'
        enterFrom='transform opacity-0 translate-y-12'
        enterTo='transform opacity-100 translate-y-0'
      >
        <h1 className={classNames(`text-white text-3xl font-bold leading-10 my-4`)}>
          Everything is ready, only need one more step.
        </h1>
      </Transition>

      <Transition
        appear={true}
        show={true}
        className={`transition-all ease-in-out duration-700 delay-1000`}
        enter='transform opacity-0'
        enterFrom='transform opacity-0 translate-y-12'
        enterTo='transform opacity-100 translate-y-0'
      >
        <h2 className={classNames(`text-[#87D3B7]  leading-normal text-xl`)}>
          Your email need to be verified, please check your email.
        </h2>
      </Transition>

      <Transition
        show={true}
        appear={true}
        className={`transition-all ease-in-out duration-700 delay-1000`}
        enter='transform opacity-0'
        enterFrom=' opacity-0 '
        enterTo='opacity-100'
      >
        <div className={classNames(`mt-8 flex flex-row-reverse`)}>
          <PrimaryButton text='Resend the email' onClick={handleResendEmail} />
        </div>
      </Transition>
    </div>
  )
}
