import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiEnvelope } from 'react-icons/hi2'
import { toast } from 'react-toastify'
import InputIcon from '../../components/InputIcon/InputIcon'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { AuthService } from '../../services/AuthService'

interface FormData {
  email: string
}

export default function ForgetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const [showing, setShowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowing(true)
    }, 1)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  const handleSend = async (data: any) => {
    setLoading(true)
    try {
      await toast
        .promise(AuthService.forgetPassword(data), {
          pending: `Mail xác nhận đang được gửi`,
          success: `Kiểm tra email để đổi mật khẩu mới`
        })
        .catch((error) => toast.error(error.response.data.message))
    } catch (error: any) {
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
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
              <h1 className={classNames(`text-white text-3xl font-semibold leading-10 my-4`)}>Quên mật khẩu</h1>
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
          <div className='relative'>
            <InputIcon
              icon={<HiEnvelope />}
              type={`text`}
              placeholder={`Nhập địa chỉ email của tài khoản`}
              register={register}
              label={`email`}
              validation={{
                required: 'Vui lòng nhập email',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Địa chỉ email không hợp lệ'
                }
              }}
            />
            {errors.email && errors.email.message && (
              <p className='absolute mt-1 text-sm font-bold text-red-500'>{errors.email.message}</p>
            )}
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
            <PrimaryButton text={loading ? 'Đang gửi...' : 'Gửi'} type='submit' disabled={loading} />
          </div>
        </Transition>
      </Transition>
    </form>
  )
}
