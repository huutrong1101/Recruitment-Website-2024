import React from 'react'
import { Link } from 'react-router-dom'
import { NewInterface } from '../../types/job.type'
import parse from 'html-react-parser'

interface NewCardProps {
  news: NewInterface
}

function NewBigRightCard({ news }: NewCardProps) {
  return (
    <Link to={`/news/${news._id}`}>
      <div className='flex items-center bg-white border rounded-lg shadow-lg hover:border-emerald-500'>
        <div className='w-3/5 p-3'>
          <div className='flex flex-col gap-1'>
            <p className='text-sm text-emerald-500'>{news.type}</p>
            <p className='text-base font-bold line-clamp-2'>{news.name}</p>
            <p className='text-sm'>Ngày đăng tải: {news.createdAt}</p>
          </div>

          <div className='mt-1'>
            <p className='text-sm text-gray-400 line-clamp-3'>{parse(news.content)}</p>
          </div>
        </div>
        <div className='w-2/5 h-full'>
          <img src={news.thumbnail} alt='blog_image' className='object-cover w-full h-full rounded-r-md' />
        </div>
      </div>
    </Link>
  )
}

export default NewBigRightCard
