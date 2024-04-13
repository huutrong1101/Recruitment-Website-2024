import { Dialog, Transition } from '@headlessui/react'
import { EnvelopeIcon, LockClosedIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline'
import classnames from 'classnames'
import { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import InputIcon from '../../components/InputIcon/InputIcon'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { authRegister } from '../../redux/reducer/AuthSlice'

function TermAndConditionsDialog({ visible, onClose, onOkay }: any) {
  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex items-center justify-center min-h-full p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                  ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ VỚI ỨNG VIÊN
                </Dialog.Title>

                <div className='max-h-[70vh] mt-2 overflow-y-auto'>
                  <p className='text-sm text-gray-500'>
                    Điều khoản sử dụng yêu cầu bạn đồng ý và tuân thủ khi truy cập trang web hoặc sử dụng dịch vụ của
                    chúng tôi. Bạn phải tạo tài khoản và cung cấp thông tin chính xác. Mật khẩu của bạn phải được bảo
                    mật và không được tiết lộ cho người khác. Chúng tôi có thể thu thập thông tin cá nhân của bạn và
                    chia sẻ với các nhà tuyển dụng theo ý bạn đồng ý. Bạn cũng hiểu rằng thông tin cá nhân của bạn có
                    thể được xóa sau một thời gian không hoạt động dài.
                  </p>
                  <br />
                </div>

                <div className='flex flex-row-reverse mt-4'>
                  <button
                    type='button'
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-orange hover:bg-orange-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={onOkay}
                  >
                    OK
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default function AuthenticateSignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors }
    // reset,
  } = useForm()
  const dispatch = useAppDispatch()
  const { registerLoadingState } = useAppSelector((app) => app.Auth)

  const navigate = useNavigate()

  const onSubmit = (data: any) => {
    dispatch(authRegister(data))
      .unwrap()
      .then(() => {
        // toast.success(`Successfully register the`)
        navigate('/email/incomplete')
      })
      .catch((data) => {
        toast.error(data.message)
      })
  }

  const [visibleTermAndCondition, setVisibleTermAndCondition] = useState<boolean>(false)

  const handleCloseDialog = () => {
    setVisibleTermAndCondition(false)
  }

  const handleOpenTermOfServceDialog = () => {
    setVisibleTermAndCondition(true)
  }

  return (
    <form
      className={classnames(
        `py-8 gap-4 items-center justify-center flex flex-col h-[500px] mb-8`,
        `bg-zinc-100 shadow-md`,
        `rounded-xl px-4 md:px-5 lg:px-6`
      )}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex flex-col items-center w-full gap-4 mx-6'>
        <h1 className='text-xl font-semibold capitalize text-emerald-500'>Chào mừng bạn đã quay trở lại</h1>
        <p className='mb-0 text-sm font-normal leading-5 text-left text-gray-600'>
          Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng
        </p>

        <InputIcon
          icon={<UserIcon />}
          placeholder='Tên'
          register={register}
          label='fullName'
          required
          wrapperClassName={classnames({
            'border-red-300': errors && errors.fullName
          })}
        />

        <InputIcon
          icon={<EnvelopeIcon />}
          placeholder='Email'
          register={register}
          label='email'
          type='email'
          autoComplete='username email'
          required
          wrapperClassName={classnames({
            'border-red-300': errors && errors.email
          })}
        />

        <InputIcon
          icon={<LockClosedIcon />}
          placeholder='Mật khẩu'
          type={`password`}
          register={register}
          label='password'
          autoComplete='new-password'
          required
          wrapperClassName={classnames({
            'border-red-300': errors && errors.password
          })}
        />

        <InputIcon
          icon={<LockClosedIcon />}
          placeholder='Nhập lại mật khẩu'
          type={`password`}
          register={register}
          label='confirmPassword'
          autoComplete='new-password'
          required
          wrapperClassName={classnames({
            'border-red-300': errors && errors.confirmPassword
          })}
        />
        {/* <input type="tel" /> */}
        <InputIcon
          icon={<PhoneIcon />}
          register={register}
          label='phone'
          required
          placeholder='Số điện thoại'
          type='tel'
          maxLength={12}
          pattern='([0-9]{8,12})'
          wrapperClassName={classnames({
            'border-red-300': errors && errors.phone
          })}
        />

        {/* AgreeTerms */}
        <div className='flex flex-row w-full gap-4 text-zinc-600'>
          <label>
            <input type='checkbox' {...register('agreeTerms')} required className='mr-3' />
            Tôi đã đọc và đồng ý với
            <b className={`cursor-pointer hover:underline ml-1`} onClick={handleOpenTermOfServceDialog}>
              Điều khoản dịch vụ và Chính sách bảo mật
            </b>
          </label>
        </div>

        <PrimaryButton
          type={'submit'}
          text='Đăng Ký'
          disabled={registerLoadingState === 'pending'}
          isLoading={registerLoadingState === 'pending'}
          // className={classnames({
          //   "bg-zinc-500 hover:bg-zinc-500": loading === "pending",
          // })}
        />
      </div>
      <TermAndConditionsDialog
        visible={visibleTermAndCondition}
        onClose={handleCloseDialog}
        onOkay={handleCloseDialog}
      />
    </form>
  )
}
