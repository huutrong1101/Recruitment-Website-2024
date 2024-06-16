import { useAppSelector } from '../../hooks/hooks'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import BlogCard from '../../components/EventCard/NewCard'
import { NewInterface } from '../../types/job.type'
import NewCard from '../../components/EventCard/NewCard'

function Blog() {
  const listNews: NewInterface[] = useAppSelector((state) => state.New.listNews)

  return (
    <div className='mt-[80px]'>
      <div className={classNames('text-center')}>
        <h3 className={classNames('tracking-wider text-2xl font-bold text-center')}>CẨM NANG NGHỀ NGHIỆP</h3>
      </div>

      <div className='flex flex-wrap -mx-4 mt-[20px]'>
        <div className='flex items-start justify-start gap-5'>
          {listNews.slice(0, 4).map((news) => (
            <div key={news._id} className='w-full mb-8 sm:w-1/2 lg:w-1/4'>
              <NewCard news={news} />
            </div>
          ))}
        </div>
      </div>

      <div className={classNames('flex items-center justify-center')}>
        <Link to='/news' className={classNames('bg-emerald-500 text-white p-3 rounded-md flex')}>
          Xem thêm cẩm nang nghề nghiệp
        </Link>
      </div>
    </div>
  )
}

export default Blog
