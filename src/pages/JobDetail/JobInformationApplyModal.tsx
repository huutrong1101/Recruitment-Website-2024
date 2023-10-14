import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { AiFillEye } from 'react-icons/ai'
import { GrDocumentPdf } from 'react-icons/gr'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import Dialog from '../../components/Modal/Dialog'
import { useAppSelector } from '../../hooks/hooks'
import { getCandidateResume, sendApplyRequestToJob } from '../../services/CandidateService'
import { LoadingStatus, ResumeResponse } from '../../types/services'

export interface JobInformationApplyModal {
  visible: boolean
  onClose: () => void
  onApplySucceeded: () => void
}

export default function JobInformationApplyModal({ visible, onClose, onApplySucceeded }: JobInformationApplyModal) {
  const { jobId } = useParams()
  const [resumeListLoadingState, setResumeListLoadingState] = useState(false)
  const [resumeList, setResumeList] = useState<ResumeResponse[]>([])
  const [resumeSelectedIndex, setResumeSelectedIndex] = useState(0)
  const user = useAppSelector((app) => app.Auth.user)
  const [submitLoadingState, setSubmitLoadingState] = useState<LoadingStatus>('idle')

  useEffect(() => {
    setResumeListLoadingState(true)
    getCandidateResume()
      .then((response) => {
        const { result } = response.data
        setResumeList(result)
      })
      .finally(() => setResumeListLoadingState(false))
  }, [])

  const handleApply = () => {
    // Prevent user from submit when the resume list is loading
    if (resumeListLoadingState) {
      return toast.warn(`The resume list is loading, please wait`)
    }

    setSubmitLoadingState('pending')
    const { resumeId } = resumeList[resumeSelectedIndex]
    if (!jobId) {
      return toast.error(`Job id cannot be undefined or null`)
    }
    sendApplyRequestToJob({ jobId, resumeId })
      .then(() => {
        onApplySucceeded()
        setSubmitLoadingState('fulfill')
        toast.success(`You applicant is submit and will be reviewed.`)
      })
      .catch(() => {
        toast.error(`Cannot apply to the job`)
        setSubmitLoadingState('failed')
      })
      .finally()
  }

  const handleSelectResume = (_index: number) => {
    setResumeSelectedIndex(_index)
  }

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      title=''
      titleClass='text-lg font-semibold leading-6text-gray-900'
      // cancelTitle="Cancel"
      // successClass="text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus-visible:ring-emerald-500"
      // successTitle="Apply"
      size='max-w-full md:max-w-lg xl:max-w-sm'
      // handleSucces={handleApply}
      buttons={[
        <button onClick={onClose} className={`bg-red-200 px-4 py-2 rounded-xl text-red-900`}>
          Cancel
        </button>,
        <button
          onClick={handleApply}
          className={classNames(
            `bg-emerald-200 hover:bg-emerald-300 px-4 py-2 rounded-xl text-emerald-900 flex flex-row items-center gap-4 disabled:bg-gray-300 disabled:cursor-no-drop`,
            `cursor-pointer`,
            {
              'bg-emerald-50': submitLoadingState === 'pending' || resumeListLoadingState
            }
          )}
          disabled={submitLoadingState === 'pending' || resumeListLoadingState || resumeList.length === 0}
        >
          {submitLoadingState === 'pending' && <LoadSpinner />}
          Submit
        </button>
      ]}
    >
      <div className={classNames(`flex flex-col gap-6`)}>
        {/* Information */}
        <div className={`bg-gray-50 p-4 rounded-xl`}>
          {/* <h1 className={`text-gray-400`}>General Information</h1> */}
          {/* <div className={classNames(`flex flex-col gap-4`)}>
            {[...new Array(5)].map((_, _index) => (
              // <InputIcon text={`no text`} register={}/>
              <input
                placeholder="Hi"
                className={classNames(`w-full px-4 py-1 rounded-xl border`)}
              />
            ))}
          </div> */}
          <div className={classNames(`flex flex-col`)}>
            <h3 className={classNames(`text-2xl my-2 font-semibold`)}>{user?.fullName}</h3>
            <span>{user?.phone || 'No phone number'}</span>
            <span>{user?.email || 'No email'}</span>
            <span>{user?.address || 'No address'}</span>
            <span className={classNames(`text-zinc-500`)}>{user?.about || ''}</span>
          </div>
          <div className='mt-6'>
            <Link to={`/profile`} className={classNames(`text-blue-600 hover:text-blue-500`)}>
              Edit my profile
            </Link>
          </div>
        </div>

        <div className={``}>
          {/* Header */}
          <div className={`flex flex-row items-center`}>
            <h1 className={classNames(`font-light text-gray-500 flex-1`)}>Select your resume</h1>
            <Link
              className={classNames(
                `text-sm hover:underline text-blue-600`,
                `p-2 rounded-xl`
                // `hover:bg-blue-50 `
              )}
              to={`/profile/resume`}
            >
              Manage resume
            </Link>
          </div>

          <div className={classNames(`mt-4 min-h-[15vh]`)}>
            {resumeListLoadingState ? (
              <div className={`flex flex-row items-center justify-center text-3xl min-h-[15vh]`}>
                <LoadSpinner />
              </div>
            ) : (
              <>
                <div className={classNames(`flex flex-col gap-2 max-h-[15vh] overflow-y-auto `)}>
                  {resumeList.length === 0 ? (
                    <div
                      className={classNames(
                        `flex flex-col items-center justify-center min-h-[15vh] text-gray-400`,
                        `gap-4`
                      )}
                    >
                      <GrDocumentPdf className={classNames(`text-3xl`)} />
                      <span>You have not uploaded any resume.</span>
                    </div>
                  ) : (
                    resumeList.map((resumeItem, _index) => (
                      <button
                        className={classNames(
                          `px-4 py-2 border rounded-xl hover:border-emerald-600 hover:text-emerald-600`,
                          `flex flex-row gap-4 items-center`,
                          `cursor-pointer`,
                          {
                            'bg-emerald-600 hover:text-gray-50 !text-gray-100': _index === resumeSelectedIndex
                          },
                          `text-gray-950`
                        )}
                        onClick={() => handleSelectResume(_index)}
                      >
                        {/* <AiOutlineCheckCircle /> */}
                        <span className={classNames(`flex-1 text-left`)}>{resumeItem.name}</span>
                        <Link
                          to={resumeItem.resumeUpload}
                          target='_blank'
                          className={classNames(`hover:bg-emerald-500 p-2 rounded-full`, `hover:text-emerald-100`)}
                        >
                          <AiFillEye />
                        </Link>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
}
