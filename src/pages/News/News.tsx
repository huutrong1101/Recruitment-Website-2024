import React, { useEffect, useState } from 'react'
import Container from '../../components/Container/Container'
import NewBigLeftCard from '../../components/EventCard/NewBigLeftCard'
import NewBigRightCard from '../../components/EventCard/NewBigRightCard'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { NewService } from '../../services/NewService'
import { Spin } from 'antd'
import NewsCategory from './NewsCategory'
import { NewInterface } from '../../types/job.type'

const News: React.FC = () => {
  const dispatch = useAppDispatch()
  const listNews: NewInterface[] = useAppSelector((state) => state.New.listNews)

  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5)

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      await NewService.getListNews(dispatch, { page: currentPage, limit: pageSize })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [dispatch, currentPage, pageSize])

  const featuredNews = listNews.slice(0, 4)
  const firstNews = featuredNews[0]
  const remainingNews = featuredNews.slice(1)

  const careerGuidanceNews = listNews.filter((news) => news.type === 'Định hướng nghề nghiệp')
  const jobTipsNews = listNews.filter((news) => news.type === 'Bí kiếp tìm việc')
  const salaryInfoNews = listNews.filter((news) => news.type === 'Chế độ lương thưởng')
  const professionalKnowledgeNews = listNews.filter((news) => news.type === 'Kiến thức chuyên ngành')

  return (
    <Container>
      <div className='mb-4 text-center'>
        <h1 className='text-3xl font-bold leading-8 text-center text-green-600'>Cẩm nang nghề nghiệp</h1>
        <p>
          Khám phá thông tin hữu ích liên quan tới nghề nghiệp bạn quan tâm. Chia sẻ kinh nghiệm, kiến thức chuyên môn
          giúp bạn tìm được công việc phù hợp và phát triển bản thân.
        </p>
      </div>

      {isLoading ? (
        <div className='flex justify-center my-4 min-h-[70vh]'>
          <Spin size='large' />
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-2 mb-8'>
            <p className='text-xl font-bold leading-8'>Bài viết mới nhất</p>
            <div className='flex items-start justify-center gap-4'>
              <div className='w-1/2'>{firstNews && <NewBigLeftCard news={firstNews} />}</div>
              <div className='flex flex-col w-1/2 gap-3'>
                {remainingNews.map((news) => (
                  <NewBigRightCard key={news._id} news={news} />
                ))}
              </div>
            </div>
          </div>

          <NewsCategory title='Định hướng nghề nghiệp' newsList={careerGuidanceNews} type='Định hướng nghề nghiệp' />
          <NewsCategory title='Bí kiếp tìm việc' newsList={jobTipsNews} type='Bí kiếp tìm việc' />
          <NewsCategory title='Chế độ lương thưởng' newsList={salaryInfoNews} type='Chế độ lương thưởng' />
          <NewsCategory
            title='Kiến thức chuyên ngành'
            newsList={professionalKnowledgeNews}
            type='Kiến thức chuyên ngành'
          />
        </>
      )}
    </Container>
  )
}

export default News
