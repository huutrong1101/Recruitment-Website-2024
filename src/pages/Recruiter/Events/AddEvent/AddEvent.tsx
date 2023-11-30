import { default as classNames, default as classnames } from 'classnames'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { HiCalendarDays, HiClock, HiMapPin } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'react-toastify'
import axiosInstance from '../../../../utils/AxiosInstance'
import PrimaryButton from '../../../../components/PrimaryButton/PrimaryButton'

export default function AddEvent() {
  //Event Content
  const [time, setTime] = useState('')
  const [title, settitle] = useState('')
  const [name, setName] = useState('')
  const [description, setdescription] = useState('')
  const [location, setlocation] = useState('')
  const [isPending, setIsPending] = useState(false)

  //Upload event avatar
  const [avatar, setAvatar] = useState(null) // Thay đổi giá trị của useState thành null
  //Upload event avatar
  const handleImageUpload = (event: any) => {
    const file = event.target.files[0] // Lấy file từ sự kiện chọn file
    setAvatar(file)
  }
  // SubmitButon
  const [startAt, setstartAt] = useState('')
  const [startAt1, setstartAt1] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Set the default value for "Day Start" to the current date
    const currentDate = moment().format('YYYY-MM-DD')
    setstartAt(currentDate)
    setstartAt1(currentDate)
  }, [])

  const [deadline, setDeadline] = useState('')

  const handleSubmit = (event: any) => {
    event.preventDefault()
    // Check if the avatar is null
    if (!avatar) {
      toast.error('Please choose an image.')
      return
    }
    // Check if the title or description is empty
    if (
      title.trim() === '' ||
      description.trim() === '' ||
      time.trim() === '' ||
      location.trim() === '' ||
      !startAt ||
      !deadline
    ) {
      toast.error('Please fill in all required fields.')
      return
    }
    // Convert the selected dates to Date objects
    const startDateObj = new Date(startAt)
    const endDateObj = new Date(deadline)
    // Check if "Date Start" is earlier than "Date End"
    if (startDateObj >= endDateObj) {
      toast.error('Date Start must be earlier than Date End')
      return
    }
    //
    const formData = new FormData()
    const formattedValueStart = moment(startAt).format('YYYY-MM-DD')
    const formattedValueDeadline = moment(deadline).format('YYYY-MM-DD')

    formData.append('title', title)
    formData.append('name', name)
    formData.append('description', description)
    formData.append('image', avatar)
    formData.append('startAt', startAt)
    formData.append('deadline', deadline)
    formData.append('location', location)
    formData.append('time', '07:35')

    setIsPending(true) // Thiết lập trạng thái pending khi bắt đầu gửi yêu cầu

    console.log({ startAt, deadline, time })

    // Gửi yêu cầu POST đến URL http://localhost:8080/api/v1/recruiter/events/create với FormData
    toast
      .promise(axiosInstance.post('recruiter/events', formData), {
        pending: 'The event is creating and broadcasting to every users via email',
        success: 'Successfully created the event'
      })
      .then(() => navigate('/recruiter/events'))
      .catch((error) => {
        toast.error(error.response?.data?.message || 'An error occurred.')
      })
      .finally(() => {
        setIsPending(false)
      })
  }

  return (
    <>
      <div className={classNames(`recruiter-add-event-wrapper`)}>
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
                    <img src={URL.createObjectURL(avatar)} alt='blog_image' className='rounded-xl' />
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
                  value={title}
                  className='resize-none p-2.5 text-xs w-full text-justify bg-white border rounded-xl outline-none focus:ring-1 ring-emerald-700'
                  placeholder='The title of the event'
                  onChange={(event) => settitle(event.target.value)}
                  required
                />
              </div>

              {/* Title and content */}
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
                  required
                />
              </div>
            </div>

            {/* Create button */}
            <div className={classnames('mt-10 mb-10 flex flex-col items-center justify-center ')}>
              <div className=''>
                <PrimaryButton text='Create' isLoading={isPending} disabled={isPending} />
              </div>

              {/* <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <div className="px-6 text-center">
                  <DialogTitle
                    id="alert-dialog-title"
                    className="text-center"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    <h2
                      className="text-center"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      Are you sure you want to create event name:{" "}
                    </h2>
                    <h2 className="text-center justify">"{title}"</h2>
                  </DialogTitle>
                  <DialogContent>
                    <div className="flex">
                      <ExclamationTriangleIcon className="w-6 h-6 text-red-800" />
                      <p className="flex justify-center px-2 font-semibold text-center text-red-800">
                        WARNING
                      </p>
                    </div>
                  </DialogContent>
                </div>

                <DialogActions>
                  <button
                    className="px-4 py-2 mx-1 my-1 text-white bg-red-700 rounded-lg hover:bg-red-900"
                    onClick={handleClose}
                  >
                    Disagree
                  </button>
                  <button
                    className="rounded-lg bg-[#059669] hover:bg-green-900  px-4 py-2 mx-1 my-1 text-white"
                    onClick={handleSubmit}
                    autoFocus
                  >
                    Agree
                  </button>
                </DialogActions>
              </Dialog> */}
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
                    value={startAt}
                    min={startAt1}
                    onChange={(event) => setstartAt(event.target.value)}
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
                    value={deadline}
                    min={startAt}
                    onChange={(event) => setDeadline(event.target.value)}
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
    </>
  )
}
