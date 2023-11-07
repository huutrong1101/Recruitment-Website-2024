import classNames from 'classnames'
import { useState, ChangeEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import PrimaryInputFile from '../../components/InputFile/PrimaryInputFile'
import { useForm } from 'react-hook-form'
import DummyAvatar from '../../components/DummyAvatar/DummyAvatar'
import { toast } from 'react-toastify'
import { UserService } from '../../services/UserService'
import { setUser } from '../../redux/reducer/AuthSlice'
import InputIcon from '../../components/InputIcon/InputIcon'
import { HiCalendar, HiEnvelope, HiKey, HiMapPin, HiPhone, HiUserCircle } from 'react-icons/hi2'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import { AiOutlineComment } from 'react-icons/ai'
import moment from 'moment'

function UserProfileInformation() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const { user, loading } = useAppSelector((app) => app.Auth)

  const dispatch = useAppDispatch()

  const [isUploading, setUploading] = useState<boolean>(false)

  const handleUploadAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList === null) {
      return toast.error(`File is empty or not found`)
    }

    if (fileList.length === 0) {
      return toast.error(`File is empty`)
    }

    const formData = new FormData()
    formData.append('avatarFile', fileList[0])

    setUploading(true)
    toast
      .promise(UserService.changeUserAvatar(formData), {
        pending: `Uploading your avatar`,
        success: `Your avatar was updated`
      })
      .then((response) => {
        const { result } = response.data
        dispatch(setUser({ ...user, avatar: result }))
        setUploading(false)
      })
      .catch((error) => toast.error(error.response.message))
  }

  const handleUpdateProfile = (data: any) => {
    toast
      .promise(UserService.updateProfile(data), {
        pending: `Updating your profile`,
        success: `Your profile was updated`
      })
      .then((response) => {
        const { result } = response.data
        console.log(result)
        // dispatch(setUser(result))
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  return (
    <div className='p-4 border rounded-xl border-zinc-200'>
      <h1 className={classNames(`text-2xl font-semibold flex-1 md:mb-4`)}>Information</h1>
      {/* Whether is loading */}
      {loading === 'pending' ? (
        <LoadSpinner />
      ) : user === null || user === undefined ? (
        // User is not found
        <div>User not found</div>
      ) : (
        <div className={classNames(`flex flex-col md:flex-row gap-6`)}>
          {/* Avatar edit block */}
          <div className={classNames(`flex-row w-full md:w-3/12 flex md:flex-col gap-4 px-4 items-center`)}>
            <div className={classNames(`w-3/12 md:w-auto`)}>
              {/* <img
              src={Avatar}
              alt={"Hi"}
              className={classNames(`rounded-full`)}
            /> */}
              {user.avatar === undefined || user.avatar === null ? (
                <DummyAvatar iconClassName='text-6xl flex items-center justify-center' wrapperClassName='h-32 w-32' />
              ) : (
                <img
                  src={user.avatar}
                  alt={`${user.fullName}'s avatar`}
                  className={`rounded-full aspect-square w-full`}
                />
              )}
            </div>
            <div>
              {/* <InputIcon icon={<HiUserCircle />} type="file" /> */}
              {/* <PrimaryButton text={`Change`} /> */}
              <PrimaryInputFile
                text={`Change`}
                onSelectedFile={handleUploadAvatar}
                accept='image/png, image/jpeg'
                isLoading={isUploading}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* General information fields */}
          <form className={classNames(`flex-1 flex flex-col gap-2`)} onSubmit={handleSubmit(handleUpdateProfile)}>
            <div>
              <InputIcon
                icon={<HiUserCircle />}
                placeholder={`Full Name`}
                type={`text`}
                register={register}
                label={`fullName`}
                defaultValue={user.fullName}
                required
              />

              {/* {errors.fullName && (
                <small className={`text-xs text-red-600`}>
                  Full name is required
                </small>
              )} */}
            </div>

            <InputIcon
              icon={<HiEnvelope />}
              type={`text`}
              placeholder={`Email`}
              register={register}
              label={`email`}
              required
              defaultValue={user.email}
              readOnly
            />

            <InputIcon
              type={`text`}
              icon={<HiMapPin />}
              placeholder={`Address`}
              register={register}
              required
              label='address'
              defaultValue={user.address || ''}
            />

            <InputIcon
              icon={<HiPhone />}
              type='text'
              placeholder={`Phone`}
              register={register}
              required
              label='phone'
              defaultValue={user.phone}
              readOnly
            />

            <InputIcon
              icon={<HiCalendar />}
              type='date'
              placeholder={`Date of birth`}
              register={register}
              required
              label='dateOfBirth'
              defaultValue={moment(user.dateOfBirth).format('YYYY-MM-DD')}
            />

            <InputIcon
              icon={<AiOutlineComment />}
              type='text'
              placeholder={`About yourself`}
              register={register}
              defaultValue={user.about || ''}
              label={`about`}
            />

            {/* Submit button */}
            <div className='flex flex-row-reverse'>
              <PrimaryButton type='submit' text={`Save`} size={'sm'} className={`md:!w-3/12`} />
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function UserProfilePassword() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const handleChangePassword = (data: any) => {
    toast
      .promise(UserService.changePassword(data), {
        pending: `Updating your password`,
        success: `Your password was updated`
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const { user } = useAppSelector((app) => app.Auth)

  return (
    <div className='p-4 border rounded-xl border-zinc-200'>
      <h1 className={classNames(`text-2xl font-semibold flex-1 md:mb-4`)}>Password</h1>
      <div className={classNames(`flex flex-col md:flex-row gap-6`)}>
        {/* Avatar edit block */}
        <div className={classNames(`w-full md:w-3/12 flex flex-col gap-4 px-4`)}></div>

        {/* General information fields */}
        <form onSubmit={handleSubmit(handleChangePassword)} className={classNames(`flex-1 flex flex-col gap-2`)}>
          <input type='hidden' name='email' value={user?.email} />
          <InputIcon
            icon={<HiKey />}
            placeholder={`Current password`}
            type='password'
            register={register}
            label={`currentPassword`}
            required
          />
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
            label={`confirmNewPassword`}
            required
          />

          {/* Submit button */}
          <div className='flex flex-row-reverse'>
            <PrimaryButton text={`Change password`} size={'sm'} className={`md:!w-5/12`} />
          </div>
        </form>
      </div>
    </div>
  )
}

export default function InterviewProfile() {
  return (
    <div className={classNames(`flex items-center justify-center w-full my-4`)}>
      <div className={classNames(`flex flex-col gap-4 w-[80%]`)}>
        {/* Information */}
        <UserProfileInformation />

        {/* Password */}
        <UserProfilePassword />
      </div>
    </div>
  )
}
