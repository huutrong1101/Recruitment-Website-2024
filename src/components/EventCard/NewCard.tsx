import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { NewInterface } from '../../types/job.type'
import parse from 'html-react-parser'

interface NewCardProps {
  news: NewInterface
}

export default function NewCard({ news }: NewCardProps) {
  return (
    <>
      {news && (
        <Link to={`/news/${news._id}`}>
          <div className='bg-white border rounded-lg shadow-lg hover:border-emerald-500'>
            <div className={classNames('w-full shadow')}>
              <img
                src={news.thumbnail}
                alt='blog_image'
                className={classNames('w-full h-[150px] object-cover aspect-video rounded-t-md')}
              />
            </div>
            <div className={classNames('p-2')}>
              {/* Description */}
              <div className={classNames('mt-2')}>
                <div className={classNames('flex flex-col gap-1')}>
                  <p className='text-sm text-emerald-500'>{news.type}</p>
                  <p className='text-base font-bold line-clamp-2'>{news.name}</p>
                  <p className='text-sm'>Ngày đăng tải: {news.createdAt}</p>
                </div>

                <div className={classNames('mt-1')}>
                  <p className={classNames(`text-sm line-clamp-4 text-gray-400`)}>{parse(news.content)}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  )
}
