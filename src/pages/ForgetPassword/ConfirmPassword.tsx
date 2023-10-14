import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiKey } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import InputIcon from '../../components/InputIcon/InputIcon'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { AuthService } from '../../services/AuthService'

export default function ConfirmPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  const [showing, setShowing] = useState(false)

  const navigate = useNavigate()

  const [token, setToken] = useState<string>('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowing(true)
    }, 1)

    // Lấy giá trị của tham số "token" từ URL
    const searchParams = new URLSearchParams(window.location.search)
    const token = searchParams.get('token')

    // Lưu giá trị token vào state
    setToken(token || '')

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  const handleSend = (data: any) => {
    toast
      .promise(AuthService.createNewPassword(token, data), {
        pending: `Creating your new password`,
        success: `Your new password was created. Let's login `
      })
      .then((response) => {
        navigate('/auth/login')
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
                Create Your New Password
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
          <div className='flex flex-col gap-5'>
            <InputIcon
              icon={<HiKey />}
              placeholder={`New password`}
              type={`password`}
              register={register}
              label={`newPassword`}
              required
            />
            <InputIcon
              icon={<HiKey />}
              placeholder={`Confirm new password`}
              type={`password`}
              register={register}
              label={`confirmPassword`}
              required
            />
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
            <PrimaryButton text='Send' type='submit' />
          </div>
        </Transition>
      </Transition>
    </form>
  )
}
