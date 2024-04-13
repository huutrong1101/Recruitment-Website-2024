import classNames from 'classnames'
import moment from 'moment'
import { ChangeEvent, useEffect, useState } from 'react'
import { HiArrowUpTray } from 'react-icons/hi2'
import { toast } from 'react-toastify'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import Modal from '../../components/Modal/Modal'
import UserResume from '../../components/UserResume/UserResume'
import { UserService } from '../../services/UserService'
import { getCandidateResume } from '../../services/CandidateService'

function ResumeDeleteModal({ visible, onAccept, onCancel }: any) {
  return (
    <Modal
      isOpen={visible}
      onClose={onCancel}
      title='Bạn có muốn xóa hồ sơ này ?'
      cancelTitle='Không'
      successClass='text-green-900 bg-green-100 hover:bg-green-200 focus-visible:ring-green-500'
      successTitle='Có'
      handleSucces={onAccept}
      titleClass=''
      size=''
    >
      <p className='text-sm text-gray-500'>Nếu bạn đồng ý, hồ sơ này sẽ được xóa khỏi danh sách. </p>
    </Modal>
  )
}

export default function UserProfileMyResume() {
  let [visibleDeleteModal, setVisibleDeleteModal] = useState(false)

  let [isUpload, setIsUpload] = useState(false)

  const [priorityCV, setPriorityCV] = useState('')

  const handleSetPriorityCV = (id: any) => {
    setPriorityCV(id)
  }

  const [resumeList, setResumeList] = useState<object[]>([])

  const [resumeDeleteID, setResumeDeleteID] = useState<string | null>(null)

  const [isLoadingUpload, setIsLoadingUpload] = useState(false)

  useEffect(() => {
    setIsLoadingUpload(true)
    getCandidateResume()
      .then((response) => {
        const { result } = response.data
        setResumeList([...result.content].sort((a: any, b: any) => b.createdDay - a.createdDay))
      })
      .catch(() => toast.error(`There was an error when fetching resume`))
      .finally(() => {
        setIsLoadingUpload(false)
      })
  }, [])

  const handleDelete = (resumeId: string) => {
    setResumeDeleteID(resumeId)
    openModal()
  }

  const handleDeleteSuccess = () => {
    toast
      .promise(UserService.deleteResume(resumeDeleteID), {
        pending: `Hồ sơ đang được xóa`,
        success: `Hồ sơ được xóa thành công`,
        error: `Có lỗi trong quá trình xóa hồ sơ`
      })
      .then(() => {
        // Clean up
        setResumeList([...resumeList].filter((resume) => (resume as any).resumeId !== resumeDeleteID))
        setResumeDeleteID(null)
        closeModal()
      })
  }

  const handleEdit = (url: string) => {
    window.open(url, '_blank')
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (!fileList) {
      return toast.error(`File is empty or not found`)
    }

    if (fileList.length === 0) {
      return toast.error(`File is empty`)
    }

    const formData = new FormData()
    formData.append('resumeFile', fileList[0])

    toast
      .promise(UserService.uploadResume(formData), {
        pending: `Uploading your resume`,
        success: `Your resume was uploaded`,
        error: `Failed to upload your resume`
      })
      .then((response) => {
        setResumeList([...resumeList, response.data.result])
      })

    closeModalUpload()
  }

  function closeModal() {
    setVisibleDeleteModal(false)
  }

  function openModal() {
    setVisibleDeleteModal(true)
  }

  function closeModalUpload() {
    setIsUpload(false)
  }

  function limitFileName(name: string, maxLength: number) {
    if (name.length <= maxLength) {
      return name
    } else {
      const truncatedName = name.substring(0, maxLength - 3)
      return `${truncatedName}...${name.slice(-4)}`
    }
  }

  return (
    <div className={classNames(`flex-1 flex flex-col gap-4`)}>
      {/* Resume */}
      <div className='p-4 border rounded-xl border-zinc-100'>
        <div className='flex items-center justify-between mb-5 border-b-zinc-500'>
          <h1 className={classNames(`text-2xl font-semibold flex-1 md:mb-4`)}>Danh sách hồ sơ</h1>
          <div className='flex flex-row-reverse gap-2'>
            <label
              htmlFor='file-input'
              className={classNames(
                `Button bg-emerald-600 hover:bg-emerald-800 text-white`,
                `transition-colors ease-in-out duration-100`,
                `rounded-lg flex-col justify-center items-center inline-flex`,
                'text-base px-4 py-2 w-full md:!w-5/12'
              )}
            >
              <HiArrowUpTray size={25} />
            </label>

            <input
              type='file'
              id='file-input'
              className='hidden'
              accept='application/pdf'
              onChange={handleFileUpload}
            />
          </div>
        </div>

        <div className={classNames(`flex flex-col gap-4 w-full border-t border-gray-200 pt-5`)}>
          <div className={classNames(`flex flex-wrap -mx-4`)}>
            {isLoadingUpload ? (
              <div className='flex items-center justify-center w-full my-4'>
                <LoadSpinner className='text-3xl text-emerald-500' />
              </div>
            ) : (
              <>
                {resumeList.length > 0 ? (
                  <>
                    {resumeList.map((resume: any) => {
                      const truncatedName = limitFileName(resume.name, 25)
                      const date = moment(resume.createdDay).format('Do MMM, YYYY')
                      return (
                        <UserResume
                          key={resume.resumeId}
                          id={resume.resumeId}
                          priorityCV={priorityCV}
                          name={truncatedName}
                          date={date}
                          onDelete={() => {
                            handleDelete(resume.resumeId)
                          }}
                          onEdit={() => {
                            handleEdit(resume.resumeUpload)
                          }}
                          onClick={() => handleSetPriorityCV(resume.resumeId)}
                        />
                      )
                    })}
                  </>
                ) : (
                  <div className='flex items-center justify-center w-full'>Bạn chưa có hồ sơ nào</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <ResumeDeleteModal visible={visibleDeleteModal} onAccept={handleDeleteSuccess} onCancel={closeModal} />
    </div>
  )
}
