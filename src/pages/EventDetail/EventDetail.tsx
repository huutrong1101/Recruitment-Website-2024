import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import classnames from 'classnames'
import { useEffect, useState } from 'react'
import { BiLogoFacebook, BiLogoGitlab, BiLogoInstagram, BiLogoLinkedin, BiLogoTwitter } from 'react-icons/bi'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import blog_image from '../../../images/blog_image.png'
import avatar from '../../../images/ava.jpg'
import EventCard from '../../components/EventCard/EventCard'
import { EventInterface } from '../../types/event.type'
import { useAppSelector } from '../../hooks/hooks'
import axiosInstance from '../../utils/AxiosInstance'
import Container from '../../components/Container/Container'

export default function EventDetail() {
  const { eventId } = useParams()

  const [event, setEvent] = useState<EventInterface | null>(null)

  const events: EventInterface[] = useAppSelector((state) => state.Home.events)

  useEffect(() => {
    const getEventDetail = async () => {
      const response = await axiosInstance.get(`events/${eventId}`)
      setEvent(response.data.result)
    }
    getEventDetail()
  }, [eventId])

  console.log(event)

  const formattedDate = moment(event?.startAt).format('Do MMMM, YYYY')

  const handleForward = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className={classnames(`event-detail`)}>
      {event && (
        <Container>
          <div className={classnames('flex flex-col lg:flex-row gap-5')}>
            <div className={classnames('bg-white rounded-lg shadow-lg border w-full lg:w-[70%]')}>
              <div>
                <img
                  src={event?.image?.url || blog_image}
                  alt='blog_image'
                  className={classnames('w-full object-cover rounded-t-md')}
                />
              </div>

              <div className={classnames('flex items-center justify-between px-10 mt-4 text-sm text-gray-400')}>
                <div className={classnames('flex items-center gap-1')}>
                  <CalendarDaysIcon className={classnames(`w-[20px]`)} />
                  <p>{formattedDate}</p>
                </div>
                <div className={classnames('flex items-center gap-1')}>
                  <p>By FPT</p>
                </div>
                <div className={classnames('flex items-center gap-1')}>
                  <ClockIcon className={classnames(`w-[20px]`)} />
                  <p>{event?.time}</p>
                </div>
              </div>

              <div className={classnames('mt-4 px-10')}>
                <h3
                  className={classnames('text-black font-outfit text-2xl font-semibold tracking-wider capitalize mb-4')}
                >
                  {event?.title}
                </h3>
                <div className={classnames('mt-2 text-justify text-base text-gray-700 leading-6')}>
                  <p className='whitespace-pre-line'>{event?.description}</p>
                </div>
              </div>

              <div className={classnames('px-10 my-4 flex items-center justify-end')}>
                <h3
                  className={classnames(
                    'text-gray-600 font-outfit text-[17px] font-medium leading-31 tracking-wider capitalize italic '
                  )}
                >
                  - {event?.author} -
                </h3>
              </div>
            </div>

            {/* Author  */}
            <div
              className={classnames('bg-white rounded-lg shadow-lg h-fit sticky top-4 w-full lg:max-w-xs lg:w-[30%]')}
            >
              <div
                className={classnames('flex items-center justify-center p-2 bg-gray-300 rounded-tl-lg rounded-tr-lg')}
              >
                <h3
                  className={classnames(
                    'text-center text-black text-lg font-medium tracking-wider leading-7 capitalize'
                  )}
                >
                  Tác giả
                </h3>
              </div>
              <div className={classnames('flex flex-col gap-1 items-center justify-center my-4')}>
                <img src={avatar} alt='' className={classnames('w-[175px] h-[175px] rounded-full bg-gray-500')} />
                <h3>{event?.author}</h3>
              </div>
              <div className='flex items-center justify-center p-2 bg-gray-300'>
                <h3
                  className={classnames(
                    'text-center text-black text-lg font-medium tracking-wider leading-7 capitalize'
                  )}
                >
                  Contract
                </h3>
              </div>
              <div className={classnames('my-3')}>
                <ul className={classnames('flex items-center justify-center gap-3')}>
                  <li
                    onClick={() => handleForward(event.linkContacts.Facebook)}
                    className='p-1 border border-gray-500 rounded-lg cursor-pointer hover:bg-emerald-300 hover:text-white'
                  >
                    <BiLogoFacebook size={20} />
                  </li>
                  <li
                    onClick={() => handleForward(event.linkContacts.Instagram)}
                    className='p-1 border border-gray-500 rounded-lg cursor-pointer hover:bg-emerald-300 hover:text-white'
                  >
                    <BiLogoInstagram size={20} />
                  </li>
                  <li
                    onClick={() => handleForward(event.linkContacts.LinkedIn)}
                    className='p-1 border border-gray-500 rounded-lg cursor-pointer hover:bg-emerald-300 hover:text-white'
                  >
                    <BiLogoLinkedin size={20} />
                  </li>
                  <li
                    onClick={() => handleForward(event.linkContacts.Gitlab)}
                    className='p-1 border border-gray-500 rounded-lg cursor-pointer hover:bg-emerald-300 hover:text-white'
                  >
                    <BiLogoGitlab size={20} />
                  </li>
                  <li
                    onClick={() => handleForward(event.linkContacts.Twitter)}
                    className='p-1 border border-gray-500 rounded-lg cursor-pointer hover:bg-emerald-300 hover:text-white'
                  >
                    <BiLogoTwitter size={20} />
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className='mt-[80px]'>
            <div className={classnames('text-center')}>
              <h1 className={classnames(`text-3xl font-semibold capitalize`)}>Tin tức liên quan</h1>
            </div>

            <div className='flex flex-wrap mt-3 -mx-4'>
              {/* <!-- Card --> */}
              {events &&
                events.slice(0, 3).map((event) => (
                  <div key={event.eventId} className='w-full px-4 mb-8 md:w-1/3'>
                    <EventCard event={event} />
                  </div>
                ))}
            </div>
          </div>
        </Container>
      )}
    </div>
  )
}
