import React, { useState, useEffect, useRef } from 'react'
import NewCard from '../../components/EventCard/NewCard'
import { NewInterface } from '../../types/job.type'
import { Pagination, Spin } from 'antd'
import { NewService } from '../../services/NewService'
import { useAppDispatch } from '../../hooks/hooks'

interface NewsCategoryProps {
  title: string
  newsList: NewInterface[]
  type: string
}

const NewsCategory: React.FC<NewsCategoryProps> = ({ title, newsList, type }) => {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryNews, setCategoryNews] = useState<NewInterface[]>(newsList)
  const [totalNews, setTotalNews] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const pageSize = 4
  const contentRef = useRef<HTMLDivElement>(null)

  const fetchCategoryNews = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await NewService.getListNewsWithType({ type, page, limit: pageSize })
      setCategoryNews(response.data.metadata.listBlog)
      setTotalNews(response.data.metadata.totalElement)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryNews(currentPage)
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const getContentHeight = () => {
    return contentRef.current ? contentRef.current.clientHeight : 'auto'
  }

  if (categoryNews.length === 0 && !isLoading) {
    return null
  }

  return (
    <div className='flex flex-col gap-2 mb-8'>
      <div className='flex items-center justify-between'>
        <p className='text-xl font-bold leading-8'>{title}</p>
        <div className='flex justify-center'>
          <Pagination simple current={currentPage} pageSize={pageSize} total={totalNews} onChange={handlePageChange} />
        </div>
      </div>
      <div className='relative' style={{ minHeight: getContentHeight() }} ref={contentRef}>
        {isLoading ? (
          <div className='absolute inset-0 flex items-center justify-center'>
            <Spin size='large' />
          </div>
        ) : (
          <div className='flex items-start justify-start gap-5'>
            {categoryNews.map((news) => (
              <div key={news._id} className='w-full mb-8 sm:w-1/2 lg:w-1/4'>
                <NewCard news={news} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsCategory
