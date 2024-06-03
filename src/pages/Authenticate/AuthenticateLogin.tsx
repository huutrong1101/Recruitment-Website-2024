import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import InputIcon from '../../components/InputIcon/InputIcon'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { UserLoginParamsInterface } from '../../types/user.type'
import { authLogin, fetchAdminFromToken, fetchRecFromToken, fetchUserFromToken } from '../../redux/reducer/AuthSlice'
import { getLocalToken } from '../../utils/localToken'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'

export default function AuthenticateLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserLoginParamsInterface>()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')
  const navigate = useNavigate()
  const { loading, signInLoadingState } = useAppSelector((app) => app.Auth)

  const onSubmit = async (data: UserLoginParamsInterface) => {
    try {
      await dispatch(authLogin(data))
        .unwrap()
        .then(async (res: any) => {
          toast.success(`Đăng nhập thành công`)
          const token = getLocalToken()

          const permission = res.metadata.permission

          if (permission === '002') {
            const userData = await dispatch(fetchRecFromToken({ token }))
            if (userData.payload?.firstApproval === true) {
              navigate('/confirm-rec')
            } else {
              navigate('/recruiter/profile')
            }
          } else if (permission === '001') {
            await dispatch(fetchAdminFromToken({ token }))
            navigate('/admin')
          } else {
            await dispatch(fetchUserFromToken({ token }))
            if (from) {
              navigate(from)
            } else {
              navigate('/')
            }
          }
        })
    } catch (err: any) {
      toast.error(`${err.message}`)
      throw err
    }
  }

  return loading === 'pending' ? (
    <LoadSpinner />
  ) : (
    <form
      className={classnames(
        `py-8 gap-4 items-center justify-center flex flex-col mb-3`,
        `bg-zinc-100 shadow-md`,
        `rounded-xl px-4 md:px-5 lg:px-6`
      )}
      onSubmit={handleSubmit(onSubmit)}
      style={{ height: 'auto', minHeight: '400px' }}
    >
      <div className='flex flex-col items-center w-full gap-4 mx-6'>
        <h1 className='text-xl font-semibold capitalize text-emerald-500'>Chào mừng bạn đã quay trở lại</h1>
        <p className='mb-0 text-sm font-normal leading-5 text-left text-gray-600'>
          Cùng xây dựng một hồ sơ nổi bật và nhận được các cơ hội sự nghiệp lý tưởng
        </p>

        {/* Display errors */}

        <InputIcon
          icon={<EnvelopeIcon />}
          type='text'
          placeholder='Địa chỉ email hoặc SĐT'
          register={register}
          label='email'
          required
          validation={{
            required: 'Email không được để trống',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Định dạng email không hợp lệ'
            }
          }}
        />

        <ErrorMessage error={errors.email} />

        <InputIcon
          icon={<LockClosedIcon />}
          placeholder='Mật khẩu'
          type='password'
          register={register}
          label='password'
          required
          autoComplete='current-password'
          validation={{
            required: 'Mật khẩu không được để trống',
            minLength: {
              value: 8,
              message: 'Mật khẩu phải có ít nhất 8 ký tự'
            }
          }}
        />

        <ErrorMessage error={errors.password} />

        {/* Forgot password */}
        <button className='inline-flex flex-col items-center justify-center h-10 text-sm bg-white bg-opacity-0 rounded-lg Button w-44'>
          <div className='Basebutton px-3 py-1.5 justify-center items-center inline-flex'>
            <div className='flex items-center justify-center gap-2 Content'>
              <Link
                to='/forgot-password'
                className='font-semibold leading-7 tracking-wide capitalize Button text-emerald-800'
              >
                Quên mật khẩu ?
              </Link>
            </div>
          </div>
        </button>

        <PrimaryButton
          text='Đăng nhập'
          isLoading={signInLoadingState === 'pending'}
          disabled={signInLoadingState === 'pending'}
        />
      </div>
      <div className='text-base font-normal tracking-normal no-underline'>
        Bạn chưa có tài khoản?{' '}
        <Link to='/auth/signup' className='text-emerald-500'>
          Đăng ký ngay
        </Link>
      </div>
    </form>
  )
}
