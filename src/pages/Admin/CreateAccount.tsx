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
import image from '../../../images/sprite.png'
import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { AuthService } from '../../services/AuthService'

const ROLE = ['RECRUITER', 'INTERVIEWER']

export default function CreateAccount() {
  const {
    register,
    handleSubmit,
    formState: { errors }
    // reset,
  } = useForm()
  const dispatch = useAppDispatch()

  const { registerLoadingState } = useAppSelector((app) => app.Auth)

  const [role, setRole] = useState('')

  const navigate = useNavigate()

  const onSubmit = (data: any) => {
    const newData = { ...data, position: role }
    console.log(newData)

    toast
      .promise(AuthService.createAccount(newData), {
        pending: `Creating account`,
        success: `Completed`
      })
      .then(() => {
        navigate('/admin')
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  return (
    <div className={classnames('flex flex-col md:flex-row gap-12', `min-h-[75vh] my-5`)}>
      <div className='w-full md:w-1/2 lg:w-5/12 xl:w-4/12 '>
        <form
          className={classnames(
            `py-8 gap-4 items-center justify-center flex flex-col h-[600px]`,
            `bg-zinc-100 shadow-md`,
            `rounded-xl px-4 md:px-5 lg:px-6`
          )}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='flex flex-col items-center w-full gap-4 mx-6'>
            <h1 className='text-xl font-semibold'>Create Account</h1>

            <InputIcon
              icon={<UserIcon />}
              placeholder='full name'
              register={register}
              label='fullName'
              required
              wrapperClassName={classnames({
                'border-red-300': errors && errors.fullName
              })}
            />

            <InputIcon
              icon={<EnvelopeIcon />}
              placeholder='email address'
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
              placeholder='password'
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
              placeholder='confirmPassword'
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
              placeholder='phone number'
              type='tel'
              maxLength={12}
              pattern='([0-9]{8,12})'
              wrapperClassName={classnames({
                'border-red-300': errors && errors.phone
              })}
            />

            <Menu as='div' className={classnames(`relative w-full`)}>
              <Menu.Button
                className={classnames(
                  `flex flex-row items-center justify-center cursor-pointer w-full p-2 border rounded-xl`,
                  `bg-white text-zinc-500`,
                  `rounded-md`,
                  `border w-full`
                )}
              >
                <span className={classNames('ml-2 text-zinc-400')}>{role || 'Position'}</span>
                {/* Drop down  */}
              </Menu.Button>

              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Menu.Items className='absolute left-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  <div className='py-1'>
                    {ROLE.map((item, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <p
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                            onClick={() => setRole(item)}
                          >
                            {item}
                          </p>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <PrimaryButton
              type={'submit'}
              text='Create'
              disabled={registerLoadingState === 'pending'}
              isLoading={registerLoadingState === 'pending'}
              // className={classnames({
              //   "bg-zinc-500 hover:bg-zinc-500": loading === "pending",
              // })}
            />
          </div>
        </form>
      </div>
      {/* Browse Job Frame */}
      <div
        className={classnames(`bg-[#176A4B] rounded-3xl px-6 py-4`, `shadow-md`, `relative flex-1 flex flex-col gap-6`)}
      >
        <h1 className={classnames(`text-white`, `font-bold text-3xl leading-10`)}>
          There are more than a thousand career opportunities for you
        </h1>
        <p className={classnames(`text-[#89EFC9] text-[20px]`, `leading-tight`)}>
          We understand that you are expecting to have the best jobs. By joining JobPort, you are going to whitelist
          onto the top recruiter company around the world.
        </p>

        <img
          alt='Authenticate block decoration'
          src={image}
          className={classnames(
            `right-0 opacity-100`,

            `w-[200px]`,
            `hidden sm:block sm:absolute bottom-[-240px] md:bottom-[-32px]`
          )}
        />
      </div>
    </div>
  )
}
