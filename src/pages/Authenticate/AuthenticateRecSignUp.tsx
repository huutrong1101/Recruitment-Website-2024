import classnames from 'classnames'
import InputIcon from '../../components/InputIcon/InputIcon'
import { EnvelopeIcon, LockClosedIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useAppDispatch } from '../../hooks/hooks'
import { authRecRegister } from '../../redux/reducer/AuthSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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
                  THOẢ THUẬN NGƯỜI DÙNG
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
                    className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-emerald-500 hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
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

const signUpSchema = yup.object().shape({
  companyName: yup.string().required('Không được để trống.'),
  name: yup.string().required('Không được để trống.'),
  position: yup.string().required('Không được để trống.'),
  phone: yup
    .string()
    .matches(/^[0-9]{10,12}$/, 'Số điện thoại không hợp lệ')
    .required('Không được để trống.'),
  contactEmail: yup.string().email('Email không hợp lệ.').required('Không được để trống.'),
  email: yup.string().email('Email không hợp lệ.').required('Không được để trống.'),
  password: yup.string().min(8, 'Mật khẩu phải ít nhất 8 ký tự.').required('Không được để trống.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Không được để trống.'),
  agreeTerms: yup.boolean().oneOf([true], 'Bạn phải đồng ý với các điều khoản và điều kiện.')
})

function AuthenticateRecSignUp() {
  const [visibleTermAndCondition, setVisibleTermAndCondition] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const handleCloseDialog = () => {
    setVisibleTermAndCondition(false)
  }

  const handleOpenTermOfServceDialog = () => {
    setVisibleTermAndCondition(true)
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
    // reset,
  } = useForm({
    resolver: yupResolver(signUpSchema)
  })

  const onSubmit = (data: any) => {
    setLoading(true)
    const { agreeTerms, ...formData } = data

    dispatch(authRecRegister(formData))
      .unwrap()
      .then(() => {
        navigate(`/email/incomplete?type=recruiter&email=${encodeURIComponent(data.email)}`)
      })
      .catch((errorData) => {
        toast.error(errorData.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <form
      className={classnames(
        `py-8 gap-4 items-center justify-center flex flex-col mb-8`,
        `bg-zinc-100 shadow-md`,
        `rounded-xl px-4 md:px-5 lg:px-6`
      )}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex flex-col w-full gap-4 mx-6'>
        <h1 className='text-xl font-semibold text-center capitalize text-emerald-500'>Đăng ký nhà tuyển dụng</h1>

        {/* Section: Thông tin liên hệ */}
        <div className='flex flex-col gap-4 pb-5 border-b-2'>
          <h3 className='font-bold'>Thông tin liên hệ</h3>

          <InputIcon
            icon={<UserIcon />}
            placeholder='Tên công ty'
            register={register}
            label='companyName'
            required
            wrapperClassName={classnames({
              'border-red-300': errors && errors.companyName
            })}
          />
          {errors.companyName?.message && <p className='text-red-500'>{errors.companyName.message}</p>}

          <div className='flex items-center gap-2'>
            <div className='w-1/2'>
              <InputIcon
                icon={<UserIcon />}
                placeholder='Họ và tên người đại diện'
                register={register}
                label='name'
                required
                wrapperClassName={classnames({
                  'border-red-300': errors && errors.name
                })}
              />
              {errors.name?.message && <p className='text-red-500'>{errors.name.message}</p>}
            </div>
            <div className='w-1/2'>
              <InputIcon
                icon={<UserIcon />}
                placeholder='Chức vụ'
                register={register}
                label='position'
                required
                wrapperClassName={classnames({
                  'border-red-300': errors && errors.position
                })}
              />
              {errors.position?.message && <p className='text-red-500'>{errors.position.message}</p>}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-1/2'>
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
              {errors.phone?.message && <p className='text-red-500'>{errors.phone.message}</p>}
            </div>
            <div className='w-1/2'>
              <InputIcon
                icon={<EnvelopeIcon />}
                placeholder='Email người đại diện'
                register={register}
                label='contactEmail'
                type='email'
                autoComplete='username email'
                required
                wrapperClassName={classnames({
                  'border-red-300': errors && errors.contactEmail
                })}
              />
              {errors.contactEmail?.message && <p className='text-red-500'>{errors.contactEmail.message}</p>}
            </div>
          </div>
        </div>

        {/* Section: Thông tin đăng nhập */}
        <div className='flex flex-col gap-4'>
          <h3 className='font-bold'>Thông tin đăng nhập</h3>

          <InputIcon
            icon={<EnvelopeIcon />}
            placeholder='Email đăng nhập'
            register={register}
            label='email'
            type='email'
            autoComplete='username email'
            required
            wrapperClassName={classnames({
              'border-red-300': errors && errors.email
            })}
          />
          {errors.email?.message && <p className='text-red-500'>{errors.email.message}</p>}
          <div className='flex items-center gap-2'>
            <div className='w-1/2'>
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
              {errors.password?.message && <p className='text-red-500'>{errors.password.message}</p>}
            </div>
            <div className='w-1/2'>
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
              {errors.confirmPassword?.message && <p className='text-red-500'>{errors.confirmPassword.message}</p>}
            </div>
          </div>
        </div>

        <div className='flex flex-row w-full gap-4 text-zinc-600'>
          <label>
            <input type='checkbox' {...register('agreeTerms')} required className='mr-3' />
            Tôi đã đọc và đồng ý với
            <b className={`cursor-pointer hover:underline ml-1`} onClick={handleOpenTermOfServceDialog}>
              Điều khoản dịch vụ và Chính sách bảo mật
            </b>
          </label>
        </div>

        <TermAndConditionsDialog
          visible={visibleTermAndCondition}
          onClose={handleCloseDialog}
          onOkay={handleCloseDialog}
        />

        <PrimaryButton type={'submit'} text='Đăng Ký' isLoading={loading} disabled={loading} />
      </div>
    </form>
  )
}

export default AuthenticateRecSignUp
