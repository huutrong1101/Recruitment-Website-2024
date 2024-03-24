import classNames from 'classnames'
import qs from 'query-string'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import JobInformationApplyModal from './JobInformationApplyModal'
import { setJobIsApplied } from '../../redux/reducer/JobDetailSlice'

export default function JobInformationCard({ cardData, jobId }: any) {
  const [visibleApplyDialog, setVisibleApplyDialog] = useState<boolean>(false)
  const { isLoggedIn, user } = useAppSelector((app) => app.Auth)
  const { isApplied } = useAppSelector((state) => state.JobDetail.response)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const toggleVisibleApplyModal = () => {
    setVisibleApplyDialog((isVisible) => !isVisible)
  }

  const handleOnApplySucceeded = () => {
    dispatch(setJobIsApplied(true))

    toggleVisibleApplyModal()
  }

  const handleNavigateToSignIn = () => {
    // navigate(`/auth/login`)
    navigate(`/auth/login?from=${encodeURIComponent(window.location.pathname)}`)
  }

  const handleNavigateToApplicants = () => {
    const searchParams = qs.stringify({ jobId })
    navigate(`/profile/submitted-jobs?${searchParams}`)
  }

  return (
    <div
      className={classNames(
        `w-full bg-white shadow-sm px-4 py-6 rounded-xl border sticky top-4`,
        `flex flex-col gap-4`
      )}
    >
      <h1 className={classNames(`font-semibold text-xl`)}>Thông tin bổ sung</h1>
      <div className={classNames(`flex flex-col gap-3`)}>
        {cardData &&
          cardData.map((item: any) => {
            return <JobInformationCardItem icon={item.icon} name={item.name} value={item.value} key={item.name} />
          })}
      </div>
      <div>
        {!isLoggedIn ? (
          <PrimaryButton text={`Đăng nhập để ứng tuyển`} onClick={handleNavigateToSignIn} />
        ) : user && user.role === 'CANDIDATE' ? (
          <>
            {!isApplied ? (
              <PrimaryButton text={`Nộp hồ sơ`} onClick={toggleVisibleApplyModal} />
            ) : (
              <button
                className={classNames(`px-4 bg-orange py-2 text-emerald-100 rounded-xl w-full`)}
                onClick={handleNavigateToApplicants}
              >
                Bạn đã ứng tuyển
              </button>
            )}
            <JobInformationApplyModal
              visible={visibleApplyDialog}
              onClose={toggleVisibleApplyModal}
              onApplySucceeded={handleOnApplySucceeded}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

interface JobInformationCardItemProps {
  icon: React.ReactElement
  name: string
  value: string
}

function JobInformationCardItem({ icon, name, value }: JobInformationCardItemProps) {
  return (
    <div className={classNames(`flex flex-row items-center gap-4`)}>
      <div className={classNames(`w-1/12 mx-2`)}>{icon}</div>
      <div className={classNames(`flex flex-col flex-1`)}>
        <span>{name}</span>
        <span className={classNames(`text-orange`)}>{value}</span>
      </div>
    </div>
  )
}
