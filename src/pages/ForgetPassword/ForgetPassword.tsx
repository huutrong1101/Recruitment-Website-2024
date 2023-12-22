import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiEnvelope } from 'react-icons/hi2'
import { toast } from 'react-toastify'
import InputIcon from '../../components/InputIcon/InputIcon'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { AuthService } from '../../services/AuthService'

export default function ForgetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const [showing, setShowing] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowing(true)
    }, 1)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  const handleSend = (data: any) => {
    toast
      .promise(AuthService.forgetPassword(data), {
        pending: `Sending mail to your email`,
        success: `Check your email to reset your password`
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  return (
    <form
      className={classNames(`px-10 py-8 rounded-[35px] w-full md:w-6/12`, `bg-[#176A4B]`, `flex flex-col shadow-lg`)}
      onSubmit={handleSubmit(handleSend)}
    >
      <Transition show={showing}>
        {/* Icons */}
        <div>
          <Transition appear={true} show={showing}>
            <Transition.Child
              className='flex flex-col items-center transition-all duration-700 ease-in-out'
              enter=' transform-gpu opacity-0 scale-50 rotate-180'
              enterFrom='transform-gpu opacity-0  scale-50 rotate-180'
              enterTo='transform-gpu opacity-100 scale-100 rotate-0'
            >
              <h1 className={classNames(`text-white text-3xl font-semibold leading-10 my-4`)}>
                Forget your password ?
              </h1>
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
          <InputIcon
            icon={<HiEnvelope />}
            type={`text`}
            placeholder={`Your email address`}
            register={register}
            label={`email`}
            required
          />
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
            <PrimaryButton text='Send' type='submit' />
          </div>
        </Transition>
      </Transition>
    </form>
  )
}
