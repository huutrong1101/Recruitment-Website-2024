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

interface FormData {
  newPassword: string
  confirmPassword: string
}

export default function ConfirmPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>()

  const [showing, setShowing] = useState(false)

  const navigate = useNavigate()

  const [token, setToken] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowing(true)
    }, 1)

    // Lấy giá trị của tham số "token" từ URL
    const searchParams = new URLSearchParams(window.location.search)
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    // Lưu giá trị token vào state
    setToken(token || '')
    setEmail(email || '')

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  const handleSend = (data: any) => {
    const newData = new FormData()
    newData.append('confirmNewPassword', data.confirmPassword)
    newData.append('newPassword', data.newPassword)

    toast
      .promise(AuthService.createNewPassword(token, email, newData), {
        pending: `Đang cập nhật mật khẩu mới`,
        success: `Mật khẩu mới đã được cập nhật. Hãy đăng nhập lại nhé.`
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
              <h1 className={classNames(`text-white text-3xl font-semibold leading-10 my-4`)}>Đặt lại mật khẩu</h1>
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
          <div className='flex flex-col gap-1 mb-2'>
            {errors.newPassword && errors.newPassword.message && (
              <p className='text-sm font-bold text-red-500'>{errors.newPassword.message}</p>
            )}
            {errors.confirmPassword && errors.confirmPassword.message && (
              <p className='text-sm font-bold text-red-500'>{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className='flex flex-col gap-5'>
            {/* <InputIcon /> */}
            <InputIcon
              icon={<HiKey />}
              placeholder={`Nhập mật khẩu mới`}
              type={`password`}
              register={register}
              label={`newPassword`}
              required
              validation={{
                required: 'Vui lòng nhập mật khẩu',
                minLength: {
                  value: 8,
                  message: 'Mật khẩu phải chứa ít nhất 8 ký tự'
                }
              }}
            />

            <InputIcon
              icon={<HiKey />}
              placeholder={`Nhập lại mật khẩu mới`}
              type={`password`}
              register={register}
              label={`confirmPassword`}
              required
              validation={{
                required: 'Vui lòng nhập lại mật khẩu',
                minLength: {
                  value: 8,
                  message: 'Mật khẩu phải chứa ít nhất 8 ký tự'
                },
                validate: (value) => value === watch('newPassword') || 'Mật khẩu xác nhận không khớp'
              }}
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
            <PrimaryButton text='Cập nhật mật khẩu' type='submit' />
          </div>
        </Transition>
      </Transition>
    </form>
  )
}
