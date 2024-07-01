import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { NewInterface } from '../../types/job.type'
import parse from 'html-react-parser'

interface NewCardProps {
  news: NewInterface
}

export default function NewCard({ news }: NewCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/news/${news._id}`)
  }

  return (
    <>
      {news && (
        <div onClick={handleClick} className='cursor-pointer'>
          <div className='flex flex-col h-full bg-white border rounded-lg shadow-lg hover:border-emerald-500'>
            <div className={classNames('w-full shadow')}>
              <img
                src={news.thumbnail}
                alt='blog_image'
                className={classNames('w-full h-[150px] object-cover aspect-video rounded-t-md')}
              />
            </div>
            <div className={classNames('p-2 flex flex-col flex-1')}>
              {/* Description */}
              <div className={classNames('mt-2 flex-1')}>
                <div className={classNames('flex flex-col gap-1')}>
                  <span className='text-sm text-emerald-500'>{news.type}</span>
                  <span className='text-base font-bold line-clamp-2'>{news.name}</span>
                  <span className='text-sm'>Ngày đăng tải: {news.createdAt}</span>
                </div>
                <div className={classNames('mt-1')}>
                  <div className={classNames('text-sm line-clamp-4 text-gray-400')}>{parse(news.content)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
