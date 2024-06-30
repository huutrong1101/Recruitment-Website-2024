import { useEffect, useState } from 'react'
import Container from '../../components/Container/Container'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import RecuiterCard from '../../components/RecuiterCard/RecuiterCard'
import { Input, Pagination, Spin } from 'antd'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { RecruiterResponseState } from '../../types/user.type'
import { RecService } from '../../services/RecService'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import qs from 'query-string'

function Recruiters() {
  const dispatch = useAppDispatch()
  const listRec: RecruiterResponseState[] = useAppSelector((state) => state.RecJobs.listRec)
  const totalRec = useAppSelector((state) => state.RecJobs.totalRec)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const [searchText, setSearchText] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1)
  const [pageSize] = useState(6)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const page = parseInt(searchParams.get('page') || '1', 10)

    const search = searchParams.get('search') || ''

    setCurrentPage(page)

    fetchRecruiters({
      search,
      page,
      limit: pageSize
    })
  }, [location.search, currentPage, pageSize])

  const fetchRecruiters = async (params: any) => {
    try {
      setIsLoading(true)
      await RecService.getListRec(dispatch, {
        searchText: params.search,
        page: params.page || 1,
        limit: pageSize
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    const params = {
      search: searchText
    }

    const filteredParams: any = Object.fromEntries(Object.entries(params).filter(([key, value]) => value))

    navigate({
      pathname: '/recruiters',
      search: qs.stringify(filteredParams)
    })

    fetchRecruiters({ ...filteredParams, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params: any = {
      search: searchText,
      page: String(page)
    }

    const filteredParams: any = Object.fromEntries(Object.entries(params).filter(([key, value]) => value))

    if (page === 1) {
      delete filteredParams.page
    }

    navigate({
      pathname: '/recruiters',
      search: qs.stringify(filteredParams)
    })

    fetchRecruiters(params)
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const searchQuery = params.get('search') || ''
    const page = Number(params.get('page')) || 1

    setSearchText(searchQuery)
    setCurrentPage(page)
  }, [location.search])

  return (
    <Container>
      <div className='mb-4 text-center'>
        <h1 className='text-3xl font-bold leading-8 text-center text-green-600'>Khám phá công ty nổi bật</h1>
        <p>Tra cứu thông tin công ty và tìm kiếm nơi làm việc tốt nhất dành cho bạn</p>
      </div>
      <div className='flex flex-row gap-3 mt-1'>
        <Input
          size='large'
          placeholder='Nhập tên công ty'
          prefix={<UserCircleIcon className='text-gray-500' />}
          className='w-full'
          type='text'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
        />
        <button
          type='submit'
          className='flex items-center justify-center flex-shrink-0 px-4 py-2 text-white rounded-md bg-emerald-500 hover:bg-emerald-700'
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>
      </div>

      <div className='w-full'>
        {isLoading ? (
          <div className='flex justify-center my-4 min-h-[70vh]'>
            <Spin size='large' />
          </div>
        ) : (
          <div className='flex flex-wrap mt-5 -mx-4'>
            {listRec && listRec.length > 0 ? (
              <>
                {listRec.map((recruiter) => (
                  <div className='flex w-full px-4 mb-8 md:w-1/3' key={recruiter._id}>
                    <RecuiterCard recruiter={recruiter} />
                  </div>
                ))}
              </>
            ) : (
              <div className='flex flex-col justify-center w-full mb-10 min-h-[70vh] items-center text-3xl gap-4'>
                <img
                  src='https://cdni.iconscout.com/illustration/premium/thumb/error-404-4344461-3613889.png'
                  alt=''
                  className='h-[300px]'
                />
                <span>Không tìm thấy công ty phù hợp.</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className='flex justify-center mt-2 mb-5'>
        <Pagination current={currentPage} pageSize={pageSize} total={totalRec} onChange={handlePageChange} />
      </div>
    </Container>
  )
}

export default Recruiters
