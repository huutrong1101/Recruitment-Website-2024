import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import moment from 'moment'
import { Link } from 'react-router-dom'
import blog_image from '../../../images/blog_image.png'
import { EventInterface } from '../../types/event.type'

interface EventCardProps {
  event: EventInterface
}

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = moment(event.startAt).format('Do MMMM, YYYY')

  const maxCharacters = 26 // Số ký tự tối đa bạn muốn hiển thị
  const title = event.title

  let shortenedTitle = title

  if (title.length > maxCharacters) {
    shortenedTitle = title.substring(0, maxCharacters) + '...'
  }

  function limitWords(text: string, limit: number) {
    const words = text.split(' ')
    const limitedText = words.slice(0, limit).join(' ')

    if (words.length > limit) {
      return `${limitedText} ...`
    }

    return limitedText
  }

  return (
    <Link to={`/events/${event.eventId}`}>
      <div className='bg-white border rounded-lg shadow-lg hover:border-emerald-700'>
        <div className={classNames('w-full shadow')}>
          <img
            src={event.image.url || blog_image}
            alt='blog_image'
            className={classNames('w-full h-[150px] object-cover aspect-video rounded-t-md')}
          />
        </div>
        <div className={classNames('p-6')}>
          <div className={classNames('flex items-center justify-between text-xs')}>
            <div className={classNames('flex items-center gap-1 text-gray-500')}>
              <CalendarDaysIcon className={classNames(`w-[20px]`)} />
              <p>{formattedDate}</p>
            </div>
            <div className={classNames('flex items-center gap-1 text-gray-500')}>
              <ClockIcon className={classNames(`w-[20px]`)} />
              <p>{moment(event.time, 'HH:mm:ss').format('HH:mm')}</p>
            </div>
          </div>

          {/* Description */}
          <div className={classNames('mt-2')}>
            <h3 className={classNames('text-black text-base font-medium tracking-wider capitalize line-clamp-2')}>
              {event.title}
            </h3>

            <p className={classNames(`mt-4 text-xs line-clamp-4 text-gray-400`)}>{limitWords(event.description, 10)}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
