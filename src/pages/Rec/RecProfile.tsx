import classNames from 'classnames'
import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiEnvelope, HiKey, HiMapPin, HiPhone, HiUserCircle } from 'react-icons/hi2'
import { toast } from 'react-toastify'
import DummyAvatar from '../../components/DummyAvatar/DummyAvatar'
import PrimaryInputFile from '../../components/InputFile/PrimaryInputFile'
import InputIcon from '../../components/InputIcon/InputIcon'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { UserService } from '../../services/UserService'
import { setRec, setUser } from '../../redux/reducer/AuthSlice'
import { RecruiterResponseState } from '../../types/user.type'

function UserProfileInformation() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const { recruiter, loading } = useAppSelector((app) => app.Auth)
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
    formData.append('avatar', fileList[0])

    setUploading(true)
    toast
      .promise(UserService.changeUserAvatar(formData), {
        pending: `Uploading your avatar`,
        success: `Your avatar was updated`
      })
      .then((response) => {
        const result = response.data.metadata
        dispatch(setRec({ ...recruiter, avatar: result.avatar }))
        setUploading(false)
      })
      .catch((error) => {
        toast.error(error.response.data.message)
        setUploading(false)
      })
  }

  const handleUpdateProfile = (data: any) => {
    const updatedFields: Partial<RecruiterResponseState> = {}
    ;(Object.keys(data) as Array<keyof RecruiterResponseState>).forEach((key) => {
      const newData = data[key]
      const originalData = recruiter && recruiter[key]

      if (JSON.stringify(newData) !== JSON.stringify(originalData)) {
        updatedFields[key] = newData
      }
    })

    if (Object.keys(updatedFields).length > 0) {
      toast
        .promise(UserService.updateRecProfile(updatedFields), {
          pending: `Thông tin người đại diện đang được cập nhật`,
          success: `Cập nhật thông tin thành công`
        })
        .then((response: any) => {
          const result = response.data.metadata
          dispatch(setRec(result))
        })
        .catch((error: any) => toast.error(error.response.data.message))
    } else {
      toast.info('Không có thông tin nào được cập nhật!')
    }
  }

  return (
    <div className='p-4 border rounded-xl border-zinc-100'>
      <h1 className={classNames(`text-2xl font-semibold flex-1 md:mb-4`)}>Thông tin người đại diện</h1>
      {/* Whether is loading */}
      {loading === 'pending' ? (
        <LoadSpinner />
      ) : recruiter === null || recruiter === undefined ? (
        // User is not found
        <div>User not found</div>
      ) : (
        <div className={classNames(`flex flex-col md:flex-row gap-6`)}>
          {/* Avatar edit block */}
          <div className={classNames(`flex-row w-full md:w-3/12 flex md:flex-col gap-4 px-4 items-center`)}>
            <div className={classNames(`w-3/12 md:w-auto`)}>
              {recruiter.avatar === undefined || recruiter.avatar === null ? (
                <DummyAvatar iconClassName='text-6xl flex items-center justify-center' wrapperClassName='h-32 w-32' />
              ) : (
                <img
                  src={recruiter.avatar}
                  alt={`${recruiter.name}'s avatar`}
                  className={`rounded-full aspect-square w-full`}
                />
              )}
            </div>
            <div>
              <PrimaryInputFile
                text={`Đổi avatar`}
                onSelectedFile={handleUploadAvatar}
                accept='image/png, image/jpeg'
                isLoading={isUploading}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* General information fields */}
          <form className={classNames(`flex-1 flex flex-col gap-2`)} onSubmit={handleSubmit(handleUpdateProfile)}>
            <InputIcon
              icon={<HiUserCircle />}
              placeholder={`Họ và tên người đại diện`}
              type={`text`}
              register={register}
              label={`name`}
              defaultValue={recruiter.name}
              required
            />

            <InputIcon
              icon={<HiEnvelope />}
              type={`text`}
              placeholder={`Email người đại diện`}
              register={register}
              label={`contactEmail`}
              required
              defaultValue={recruiter.contactEmail}
            />

            <InputIcon
              type={`text`}
              icon={<HiMapPin />}
              placeholder={`Chức vụ`}
              register={register}
              required
              label='position'
              defaultValue={recruiter.position}
            />

            <InputIcon
              icon={<HiPhone />}
              type='text'
              placeholder={`Điện thoại`}
              register={register}
              required
              label='phone'
              defaultValue={recruiter.phone}
            />

            {/* Submit button */}
            <div className='flex flex-row-reverse'>
              <PrimaryButton type='submit' text={`Cập nhật`} size={'sm'} className={`md:!w-3/12`} />
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
    const { email, ...rest } = data

    toast
      .promise(UserService.changePassword(rest), {
        pending: `Mật khẩu của bạn đang được cập nhật`,
        success: `Cập nhật mật khẩu thành công`
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const { recruiter } = useAppSelector((app) => app.Auth)

  return (
    <div className='p-4 border rounded-xl border-zinc-100'>
      <h1 className={classNames(`text-2xl font-semibold flex-1 md:mb-4`)}>Thông tin đăng nhập</h1>
      <div className={classNames(`flex flex-col md:flex-row gap-6`)}>
        {/* Avatar edit block */}
        <div className={classNames(`w-full md:w-3/12 flex flex-col gap-4 px-4`)}></div>

        {/* General information fields */}
        <form onSubmit={handleSubmit(handleChangePassword)} className={classNames(`flex-1 flex flex-col gap-2`)}>
          <InputIcon
            icon={<HiEnvelope />}
            type={`text`}
            placeholder={`Email đăng nhập`}
            register={register}
            label={`email`}
            required
            defaultValue={recruiter?.email}
            readOnly
          />

          <InputIcon
            icon={<HiKey />}
            placeholder={`Mật khẩu hiện tại`}
            type='password'
            register={register}
            label={`currentPassword`}
            required
          />
          <InputIcon
            icon={<HiKey />}
            placeholder={`Mật khẩu mới`}
            type={`password`}
            register={register}
            label={`newPassword`}
            required
          />
          <InputIcon
            icon={<HiKey />}
            placeholder={`Nhập lại mật khẩu mới`}
            type={`password`}
            register={register}
            label={`confirmNewPassword`}
            required
          />

          {/* Submit button */}
          <div className='flex flex-row-reverse'>
            <PrimaryButton text={`Đổi mật khẩu`} size={'sm'} className={`md:!w-5/12`} />
          </div>
        </form>
      </div>
    </div>
  )
}

export default function RecProfile() {
  return (
    <div className={classNames(`flex-1 flex flex-col gap-4`)}>
      {/* Information */}
      <UserProfileInformation />

      {/* Password */}
      <UserProfilePassword />
    </div>
  )
}
