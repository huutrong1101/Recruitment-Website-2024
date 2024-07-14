import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineLock } from 'react-icons/ai'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import OneTimePasswordInputArray from './OneTimePasswordInputArray'
import { UserVerifySendParamsInterface } from '../../types/user.type'
import { sendVerify } from '../../redux/reducer/OneTimePasswordSlice'
import { Button, Form } from 'antd'
import { InputOTP } from 'antd-input-otp'

export default function OneTimePasswordVerify() {
  const [showing, setShowing] = useState(true)
  const [isFilled, setFilled] = useState<boolean>(false)
  const { register, handleSubmit, setValue, getValues } = useForm<UserVerifySendParamsInterface>()

  const { loadingState } = useAppSelector((app) => app.OneTimePassword)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [form] = Form.useForm()

  const handleFinish = (values: any) => {
    const otpArray = values.otp
    const otp = otpArray.join('')

    console.log(`OTP: ${otp}`)

    const code = searchParams.get('code') || ''
    const email = getValues('email')
    const dataWithCode = { email, otp, code }

    dispatch(sendVerify(dataWithCode))
      .unwrap()
      .then(() => {
        toast.success(`Xác minh thành công. Bạn đã có thể đăng nhập vào hệ thống.`)
        navigate('/email/complete')
      })
      .catch((response) => {
        toast.error(response.message)
      })
  }

  useEffect(() => {
    setValue('otp', '')
  }, [])

  const code = searchParams.get('code')

  useEffect(() => {
    const searchEmailValue = searchParams.get('email')
    if (searchEmailValue === '' || searchEmailValue === null || code === '' || code === null) {
      toast.error(`Invalid or undefined email`)
      navigate('/')
    } else {
      setValue('email', searchEmailValue)
    }

    return () => {}
  }, [searchParams])

  const handleVerifyOneTimePassword = (data: UserVerifySendParamsInterface) => {
    const code = searchParams.get('code') || ''
    const dataWithCode = { ...data, code: code }

    dispatch(sendVerify(dataWithCode)) // Gọi action với dữ liệu mới có bao gồm code.
      .unwrap()
      .then(() => {
        toast.success(`Xác minh thành công. Bạn đã có thể đăng nhập vào hệ thống.`)
        navigate('/email/complete')
      })
      .catch((response) => {
        toast.error(response.message)
      })
  }

  return (
    <div
      className='flex flex-col items-center justify-center w-full h-auto py-8'
      // onSubmit={handleSubmit(handleVerifyOneTimePassword)}
    >
      <Transition
        show={showing}
        className={classNames(
          `px-10 py-8 rounded-[35px] w-full md:w-7/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12`,
          `bg-[#176A4B]`,
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
              <AiOutlineLock className={classNames(`text-[#87D3B7] w-1/2 text-9xl`)} />
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
          <h3 className={classNames(`text-[#87D3B7] text-xl font-light leading-tight my-4`)}>
            Vui lòng nhập mã OTP mà chúng tôi đã gửi tới email của bạn.
          </h3>
        </Transition>
        <input type='hidden' {...register('email')} value={''} />

        <Transition
          show={showing}
          appear={true}
          className={`transition-all ease-in-out duration-700 delay-1000`}
          enter='transform opacity-0'
          enterFrom=' opacity-0 '
          enterTo='opacity-100'
        >
          <Form form={form} onFinish={handleFinish}>
            <Form.Item
              name='otp'
              className='center-error-message'
              rules={[{ validator: async () => Promise.resolve() }]}
            >
              <InputOTP autoFocus inputType='numeric' length={6} />
            </Form.Item>

            <Form.Item noStyle>
              <Button block htmlType='submit' type='primary'>
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        </Transition>
      </Transition>
    </div>
  )
}
