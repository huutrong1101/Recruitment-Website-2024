import classnames from 'classnames'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import { HiCalendarDays, HiClock, HiMapPin } from 'react-icons/hi2'
import Dialog from '../../../components/Modal/Dialog'
import LoadSpinner from '../../../components/LoadSpinner/LoadSpinner'
import axiosInstance from '../../../utils/AxiosInstance'
import NotFound from '../../../components/NotFound/NotFound'
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton'

interface DialogDataState {
  visible: boolean
  currentDeleteEvent: any | null
  loading: boolean
}

function DeleteEventDialog({
  visible,
  onClose,
  dialogData,
  onDelete,
  size
}: {
  visible: boolean
  onClose: () => void
  dialogData: DialogDataState
  onDelete: () => void
  size?: string
}) {
  return (
    <>
      <Dialog
        visible={visible}
        onClose={onClose}
        title={`Do you want to delete the current event?`}
        size={size || ''}
        buttons={[
          <button
            onClick={onClose}
            className={classNames(
              `bg-emerald-200 hover:bg-emerald-300 px-4 py-2 rounded-xl text-emerald-900 flex flex-row items-center gap-4 disabled:bg-gray-300 disabled:cursor-no-drop`,
              `cursor-pointer`
            )}
          >
            Cancel
          </button>,
          <button
            onClick={onDelete}
            className={classNames(
              `bg-red-200 px-4 py-2 rounded-xl text-red-900`,
              `disabled:bg-red-100 disabled:cursor-no-drop flex flex-row gap-2`
            )}
            disabled={dialogData.loading}
          >
            {dialogData.loading && <LoadSpinner />}
            Delete
          </button>
        ]}
      >
        <span className='text-sm text-gray-600'>
          Once you deleted, the data is permanently removed and it cannot be recovered.
        </span>
      </Dialog>
    </>
  )
}

export default function ReccerEventDetail() {
  const { eventId } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  // const events:  EventInterface[] = useAppSelector((state) => state.recevent.RecEventRecent);
  // Define the initial state outside the useEffect hook
  const [avatar, setAvatar] = useState('')
  const [avatar1, setAvatar1] = useState(null)
  const [dayend, setDayend] = useState('')
  const [daystar, setDaystar] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [time, setTime] = useState('')
  const [location, setlocation] = useState('')
  const [title, settitle] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setdescription] = useState('')
  const [openSave, setOpenSave] = React.useState(false)

  const [dialogData, setDialogData] = useState<DialogDataState>({
    visible: false,
    currentDeleteEvent: null,
    loading: false
  })

  const navigate = useNavigate()

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0]
    setAvatar1(file)
    setAvatar(URL.createObjectURL(file))
  }

  useEffect(() => {
    setIsLoading(true)
    const getEventDetail = async () => {
      try {
        const response = await axiosInstance(`/events/${eventId}`)

        // Set state with the response data
        setAvatar(response.data.result.image.url)
        setDayend(moment(response.data.result.deadline).format('YYYY-MM-DD'))
        setDaystar(moment(response.data.result.createdAt).format('YYYY-MM-DD'))
        setTime(response.data.result.time)
        setName(response.data.result.name)
        setlocation(response.data.result.location)
        settitle(response.data.result.title)
        setdescription(response.data.result.description)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    getEventDetail()
  }, [eventId])

  const handleSubmit = (event: any) => {
    event.preventDefault()

    console.log('check')

    if (title === null || title === undefined) {
      throw new Error(`Title is null or not found.`)
    }

    // Convert the selected dates to Date objects
    const startDateObj = new Date(daystar)
    const endDateObj = new Date(dayend)
    // Check if "Date Start" is earlier than "Date End"
    if (startDateObj >= endDateObj) {
      toast.error('Date Start must be earlier than Date End')
      return
    }
    //
    if (!avatar) {
      toast.error('Please choose an image.')
      return
    }
    // Check if the title or description is empty
    if (
      (title as string).trim() === '' ||
      description.trim() === '' ||
      time.trim() === '' ||
      location.trim() === '' ||
      !daystar ||
      !dayend
    ) {
      toast.error('Please fill in all required fields.')
      return
    }
    const formData = new FormData()
    const formattedValueStart = moment(daystar).format('YYYY-MM-DD')
    const formattedValueDeadline = moment(dayend).format('YYYY-MM-DD')
    // formData.append('title', title)
    // formData.append('description', description)
    // formData.append('file', avatar1 !== null ? avatar1 : new File([], ''))
    // formData.append('startAt', formattedValueStart)
    // formData.append('deadline', formattedValueDeadline)
    // formData.append('location', location)
    // formData.append('time', time)

    formData.append('title', title)
    formData.append('description', description)
    formData.append('image', avatar1 !== null ? avatar1 : new File([], ''))
    formData.append('startAt', daystar)
    formData.append('deadline', dayend)
    formData.append('location', location)
    formData.append('time', '07:35')
    formData.append('name', name)

    if (isSubmitting) return

    setIsSubmitting(true)
    // Gửi yêu cầu POST đến URL http://localhost:8080/api/v1/recruiter/events/create với FormData
    toast
      .promise(axiosInstance.put(`/recruiter/events/${eventId}`, formData), {
        pending: 'Saving the current event',
        success: `Successfully save the event data.`
      })
      .then(() => {
        navigate('/recruiter/events/')
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'An error occurred.')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
    // setOpenSave(false);
  }

  const setCurrentDeleteEvent = ({ id, title }: { id: string; title: string }) => {
    setDialogData((dialogData) => ({
      ...dialogData,
      currentDeleteEvent: {
        id,
        title
      }
    }))
  }

  const toggleVisibleDialog = () => {
    setDialogData((dialogData) => ({
      ...dialogData,
      visible: !dialogData.visible
    }))
  }

  const handleDelete = (event: any) => {
    event && event.preventDefault()

    setDialogData({ ...dialogData, loading: true })
    toast
      .promise(axiosInstance.delete(`recruiter/events/${eventId}`), {
        pending: 'Deleting the event'
      })
      .then(() => {
        toast.success(`Deleted the selected event`)
        navigate(`/recruiter/events`)
      })
      .catch((err) => toast.error(err.response.data.message))
      .finally(() => {
        setDialogData({ ...dialogData, loading: false })
      })
  }

  if (!eventId || (!isLoading && title === null)) {
    return <NotFound />
  }

  return (
    <>
      {isLoading ? (
        <div className='flex items-center justify-center w-full min-h-[25vh] text-[13px] mt-20 mb-20'>
          <LoadSpinner className='text-3xl text-[#059669] ' />
        </div>
      ) : (
        <div className={classNames(`job-detail`)}>
          <form className={classnames('flex gap-4 md:flex-row mt-6')} onSubmit={handleSubmit}>
            {/* Input fields */}
            <div className={classnames('w-full md:w-8/12 border shadow rounded-xl')}>
              {/* Img */}
              <div className={classNames(`rounded-xl mb-5`, `text-justify`)}>
                {/* <h1 className="text-2xl font-normal leading-7 text-zinc-900">
                Image here
              </h1> */}
                <label htmlFor='avatar'>
                  {avatar ? (
                    <div className='flex justify-center'>
                      <img src={avatar} alt='blog_image' className='rounded-xl' />
                    </div>
                  ) : (
                    <div
                      className='flex justify-center px-6 py-24 bg-white shadow cursor-pointer hover:bg-gray-50 focus:ring ring-emerald-700 rounded-t-xl'
                      tabIndex={0}
                    >
                      <span className='text-zinc-400'>
                        Click to select thumbnail for the event
                        <span className='text-xs text-red-300'> (*)</span>
                      </span>
                    </div>
                  )}
                  <input
                    type='file'
                    id='avatar'
                    className={classnames('object-cover ig-center hidden aspect-video')}
                    onChange={handleImageUpload}
                    required
                  />
                </label>
              </div>
              <div className='flex flex-col gap-4 mx-8'>
                {/* Title and content */}
                <div className={classnames(' items-left rounded-xl flex-1')}>
                  <label className='mx-4 text-sm font-normal leading-7 text-gray-600' htmlFor='title'>
                    Title
                  </label>
                  <input
                    id='title'
                    name='title'
                    value={title || ''}
                    className='resize-none p-2.5 text-xs w-full text-justify bg-white border rounded-xl outline-none focus:ring-1 ring-emerald-700'
                    placeholder='The title of the event'
                    onChange={(event) => settitle(event.target.value)}
                    required
                  />
                </div>

                <div className={classnames(' items-left rounded-xl flex-1')}>
                  <label className='mx-4 text-sm font-normal leading-7 text-gray-600' htmlFor='name'>
                    Name
                  </label>
                  <input
                    id='name'
                    name='name'
                    value={name}
                    className='resize-none p-2.5 text-xs w-full text-justify bg-white border rounded-xl outline-none focus:ring-1 ring-emerald-700'
                    placeholder='The name of the event'
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className={classNames(`text-justify`)}>
                  <label className='mx-4 text-sm font-normal leading-7 text-gray-600' htmlFor='description'>
                    Description
                  </label>

                  <TextareaAutosize
                    minRows={10}
                    id='description'
                    name='description'
                    className='resize-none p-2.5 text-xs w-full text-justify bg-white border rounded-xl outline-none focus:ring-1 ring-emerald-700'
                    onChange={(event) => setdescription(event.target.value)}
                    placeholder='Please enter your content in the box below to create a perfect event. We look forward to introducing it to everyone!'
                    value={description}
                    required
                  />
                </div>
              </div>

              {/* Create button */}
              <div className={classnames('mt-10 mb-10 flex flex-col items-center justify-center ')}>
                <div className='flex flex-row w-full gap-2 px-10'>
                  <PrimaryButton
                    text='Delete'
                    className='bg-red-600 hover:bg-red-700'
                    onClick={() => {
                      setCurrentDeleteEvent({
                        id: eventId,
                        title: title || 'Empty title'
                      })
                      toggleVisibleDialog()
                    }}
                  />
                  <PrimaryButton text='Save changes' onClick={handleSubmit} />
                </div>
              </div>
            </div>

            {/* Calendar selection */}
            <div className={classnames('w-full md:w-2/12 flex-1 relative')}>
              <div className='sticky border shadow rounded-xl top-24'>
                <div className='items-center justify-between gap-1 px-10 mt-4'>
                  <div className='flex items-center gap-2 mt-1 mb-1 text-gray-600 uppercase'>
                    <HiCalendarDays />
                    <span className='text-xs'>Day Start</span>
                  </div>

                  <div className=''>
                    <input
                      type='date'
                      id='startAt'
                      className={classNames(
                        `text-emerald-800 border text-sm`,
                        ` font-medium leading-tight w-full px-2 py-2 rounded-xl cursor-text`
                      )}
                      value={daystar}
                      // min={}
                      onChange={(event) => setDaystar(event.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className='items-center justify-between gap-1 px-10 mt-5 mb-5'>
                  <div className='flex items-center gap-2 mt-1 mb-1 text-gray-600 uppercase'>
                    <HiCalendarDays />
                    <span className='text-xs'>Day End</span>
                  </div>
                  <div className=''>
                    <input
                      type='date'
                      id='deadline'
                      className={classNames(
                        `text-emerald-800 border text-sm`,
                        ` font-medium leading-tight w-full px-2 py-2 rounded-xl cursor-text`
                      )}
                      value={dayend}
                      min={daystar}
                      onChange={(event) => setDayend(event.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className={classnames('items-center gap-1 justify-between px-10 mb-5 mt-5')}>
                  <div className='flex items-center gap-2 mt-1 mb-1 text-gray-600 uppercase'>
                    <HiClock />
                    <span className='text-xs'>Time</span>
                  </div>
                  <div className=''>
                    <input
                      type='time'
                      id='time'
                      className={classNames(
                        `text-emerald-800 border text-sm`,
                        ` font-medium leading-tight w-full px-2 py-2 rounded-xl cursor-text`
                      )}
                      value={time}
                      placeholder='12:00 AM'
                      onChange={(event) => setTime(event.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className={classnames('items-center gap-1 rounded-xl justify-between px-10 mb-5 mt-5')}>
                  <div className='flex items-center gap-2 mt-1 mb-1 text-gray-600 uppercase'>
                    <HiMapPin />
                    <span className='text-xs'>Location</span>
                  </div>
                  <div className=''>
                    <select
                      value={location}
                      onChange={(event) => setlocation(event.target.value)}
                      className={classNames(
                        `cursor-pointer flex items-center`,
                        `justify-between px-1 border rounded-xl w-full py-2 text-gray-500`
                      )}
                      required
                    >
                      {/* <option value="" disabled>
                        
                      </option> */}
                      <option value='FTOWN1'>F-Town1</option>
                      <option value='FTOWN2'>F-Town2</option>
                      <option value='FTOWN3'>F-Town3</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Delete dialog */}
      <DeleteEventDialog
        visible={dialogData.visible}
        dialogData={dialogData}
        // deleteEvent={dialogData.currentDeleteEvent}
        onClose={toggleVisibleDialog}
        onDelete={() => handleDelete(null)}
      />
    </>
  )
}
