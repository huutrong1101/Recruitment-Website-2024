import classnames from 'classnames'
import Container from '../../components/Container/Container'
import { Button, Input, Select, Spin } from 'antd'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import qs from 'query-string'
import { SearchOutlined } from '@ant-design/icons'
import { NewService } from '../../services/NewService'
import parse from 'html-react-parser'
import NewCard from '../../components/EventCard/NewCard'

export default function NewDetail() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { newId } = useParams()

  const newDetail = useAppSelector((state) => state.New.newDetail)

  const provinces = useAppSelector((state) => state.Job.province)
  const [search, setSearch] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [relatedNews, setRelatedNews] = useState([])

  const optionsProvinces = provinces.map((option) => ({ value: option, label: option }))

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true) // Bắt đầu loading khi fetch dữ liệu mới
      try {
        if (newId) {
          await NewService.getNewFromId(dispatch, newId) // Đợi fetch dữ liệu mới

          const response = await NewService.getListRelatedNews(newId)

          if (response && response.data) {
            setRelatedNews(response.data.metadata.listBlog)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false) // Kết thúc loading sau khi fetch dữ liệu kết thúc
      }
    }

    fetchDetails()
  }, [dispatch, newId])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const params: any = {
      name: search,
      province: selectedProvince
    }

    const filteredParams = Object.fromEntries(Object.entries(params).filter(([key, value]) => value))

    navigate({
      pathname: '/jobs',
      search: qs.stringify(filteredParams)
    })
  }

  return (
    <Container>
      {isLoading ? (
        <div className='flex justify-center items-center my-4 min-h-[70vh]'>
          <Spin size='large' />
        </div>
      ) : newDetail ? (
        <>
          <div className={classnames('flex flex-col lg:flex-row gap-5')}>
            <div className={classnames('bg-white rounded-lg shadow-lg border w-full lg:w-[70%]')}>
              <div>
                <img
                  src={newDetail.thumbnail}
                  alt='blog_image'
                  className={classnames('w-full object-cover rounded-t-md')}
                />
              </div>

              <div className={classnames('my-4 px-5 flex gap-3 flex-col')}>
                <h3 className={classnames('text-black text-2xl font-semibold capitalize')}>{newDetail.name}</h3>
                <div className='flex items-center justify-between'>
                  <p className='text-base text-emerald-500'>{newDetail.type}</p>
                  <p className='text-base'>Ngày đăng tải: {newDetail.createdAt}</p>
                </div>
                <div className={classnames('text-justify text-base text-gray-700 leading-6')}>
                  <p className='whitespace-pre-line'>{parse(newDetail.content)}</p>
                </div>
              </div>
            </div>

            <div className={classnames('w-full lg:max-w-xs lg:w-[30%] h-fit sticky top-4')}>
              <div className='p-3 bg-white border rounded-lg shadow-lg'>
                <p className='text-lg font-bold text-emerald-500'>Tìm việc ngay</p>
                <div className='flex flex-col gap-2 mt-2'>
                  <div>
                    <Input
                      placeholder='Tìm kiếm theo tên'
                      prefix={<UserCircleIcon />}
                      className='w-full'
                      type='text'
                      style={{ width: '100%' }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className='flex items-center justify-center w-full gap-2'>
                    <Select
                      showSearch
                      style={{ width: '95%' }}
                      placeholder='Tỉnh/Thành phố'
                      filterOption={(input, option) =>
                        option ? (option.label as string).toLowerCase().includes(input.toLowerCase()) : false
                      }
                      options={optionsProvinces}
                      onChange={(value) => setSelectedProvince(value)}
                    />
                    <Button type='primary' icon={<SearchOutlined />} onClick={handleSubmit} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-[80px]'>
            <div className={classnames('text-center')}>
              <h1 className={classnames(`text-3xl font-semibold capitalize`)}>Tin tức liên quan</h1>
            </div>
            <div className='flex flex-wrap -mx-4 mt-[10px]'>
              {relatedNews && relatedNews.length > 0 ? (
                relatedNews.slice(0, 3).map((relatedNew, index) => (
                  <div className='w-full px-3 mb-6 sm:w-1/2 lg:w-1/3' key={index}>
                    <NewCard news={relatedNew} />
                  </div>
                ))
              ) : (
                <div className='flex items-center justify-center w-full'>
                  <p>Hiện chưa có bài viết nào cùng lĩnh vực</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center w-full'>
          <p>Không tìm thấy tin tức phù hợp</p>
        </div>
      )}
    </Container>
  )
}
