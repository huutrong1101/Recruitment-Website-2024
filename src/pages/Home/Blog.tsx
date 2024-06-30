import { useAppSelector } from '../../hooks/hooks'
import { Link } from 'react-router-dom'
import { NewInterface } from '../../types/job.type'
import NewCard from '../../components/EventCard/NewCard'

function Blog() {
  const listNews: NewInterface[] = useAppSelector((state) => state.New.listNews)

  return (
    <div className='mt-20'>
      <div className='text-center'>
        <h3 className='text-2xl font-bold tracking-wider'>CẨM NANG NGHỀ NGHIỆP</h3>
      </div>

      <div className='flex flex-wrap mt-5 -mx-4'>
        {listNews.slice(0, 4).map((news) => (
          <div key={news._id} className='w-full px-4 mb-8 sm:w-1/2 lg:w-1/4'>
            <NewCard news={news} />
          </div>
        ))}
      </div>

      <div className='flex items-center justify-center'>
        <Link to='/news' className='flex p-3 text-white rounded-md bg-emerald-500'>
          Xem thêm cẩm nang nghề nghiệp
        </Link>
      </div>
    </div>
  )
}

export default Blog
