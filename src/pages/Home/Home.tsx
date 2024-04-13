import classNames from 'classnames'
import Banner from './Banner'
import Container from '../../components/Container/Container'
import InterestJobs from './InterestJobs'
import LatestJob from './LatestJob'
import FeaturedRecruiter from './FeaturedRecruiter'
import Blog from './Blog'
import Select from './Select'

export default function Home() {
  return (
    <div className={classNames('h-full')}>
      {/* Banner không bị bao bởi Container khi hiển thị */}
      <Banner />

      {/* Các phần còn lại được bao bởi Container */}
      <div className='my-[25px] md:my-[50px]'>
        <Container>
          <Select />
          <InterestJobs />
          <LatestJob />
          <FeaturedRecruiter />
          <Blog />
        </Container>
      </div>
    </div>
  )
}
