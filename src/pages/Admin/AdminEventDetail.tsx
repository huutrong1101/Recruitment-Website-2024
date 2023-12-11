import classnames from 'classnames'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TextareaAutosize from 'react-textarea-autosize'
import classNames from 'classnames'
import { HiCalendarDays, HiClock, HiMapPin } from 'react-icons/hi2'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import axiosInstance from '../../utils/AxiosInstance'
import NotFound from '../../components/NotFound/NotFound'
import { JOB_POSITION } from '../../utils/Localization'

export default function AdminEventDetail() {
  const { eventId } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  // const events:  EventInterface[] = useAppSelector((state) => state.recevent.RecEventRecent);
  // Define the initial state outside the useEffect hook
  const [avatar, setAvatar] = useState('')
  const [dayend, setDayend] = useState('')
  const [daystar, setDaystar] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [time, setTime] = useState('')
  const [location, setlocation] = useState('')
  const [title, settitle] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setdescription] = useState('')

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
          <div className={classnames('flex gap-4 md:flex-row mt-6')}>
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
                </label>
              </div>
              <div className='flex flex-col gap-4 mx-8 mb-6'>
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
                    readOnly={true}
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
                    readOnly={true}
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
                    readOnly={true}
                  />
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
                      readOnly={true}
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
                      readOnly={true}
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
                      readOnly={true}
                    />
                  </div>
                </div>
                <div className={classnames('items-center gap-1 rounded-xl justify-between px-10 mb-5 mt-5')}>
                  <div className='flex items-center gap-2 mt-1 mb-1 text-gray-600 uppercase'>
                    <HiMapPin />
                    <span className='text-xs'>Location</span>
                  </div>
                  <div
                    className={classNames(
                      `cursor-pointer flex items-center`,
                      `justify-between px-1 border rounded-xl w-full py-2 text-gray-500`
                    )}
                  >
                    <p className='ml-3'> {JOB_POSITION[location]}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
