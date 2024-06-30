import classNames from 'classnames'
import React from 'react'
import { ArrowRightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { NewInterface } from '../../types/job.type'
import parse from 'html-react-parser'

interface NewCardProps {
  news: NewInterface
}

function NewBigLeftCard({ news }: NewCardProps) {
  return (
    <Link to={`/news/${news._id}`}>
      <div className='flex flex-col h-full bg-white border rounded-lg shadow-lg hover:border-emerald-500'>
        <div className={classNames('w-full shadow')}>
          <img
            src={news.thumbnail}
            alt='blog_image'
            className={classNames('w-full h-[300px] object-cover aspect-video rounded-t-md')}
          />
        </div>
        <div className={classNames('p-6 flex flex-col flex-1')}>
          <div className={classNames('flex flex-col gap-2 flex-1')}>
            <p className='text-sm text-emerald-500'>{news.type}</p>
            <p className='text-lg font-bold line-clamp-2'>{news.name}</p>
            <p className='text-sm'>Ngày đăng tải: {news.createdAt}</p>
          </div>

          <div className={classNames('mt-2 flex-1')}>
            <p className={classNames(`mt-4 text-sm line-clamp-5 text-gray-400`)}>{parse(news.content)}</p>
          </div>

          <div className='flex items-center gap-1 mt-2 text-emerald-500'>
            <p>Xem thêm</p>
            <ArrowRightOutlined />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default NewBigLeftCard
