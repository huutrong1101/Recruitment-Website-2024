import classNames from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { useEffect, useState } from 'react'
import { AdminService } from '../../../services/AdminService'
import { Spin } from 'antd'
import parse from 'html-react-parser'

function AdminManageNewDetail() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { newId } = useParams()

  const { newDetail } = useAppSelector((state) => state.AdminSlice)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true)
      try {
        if (newId) {
          await AdminService.getNewDetail(dispatch, newId)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetails()
  }, [dispatch, newId])

  const handleNavigateEdit = () => {
    navigate(`/admin/manage_news/editNew/${newDetail?._id}`)
  }
  return (
    <>
      {isLoading ? (
        <div className='flex justify-center items-center my-4 min-h-[70vh]'>
          <Spin size='large' />
        </div>
      ) : newDetail ? (
        <div className={classNames('flex flex-col lg:flex-row gap-5 items-center justify-center')}>
          <div className={classNames('bg-white w-full lg:w-[80%]')}>
            <div className='mb-5'>
              <img
                src={newDetail?.thumbnail}
                alt='blog_image'
                className={classNames('w-full object-cover rounded-t-md')}
              />
            </div>

            <div className='flex items-center justify-end w-full gap-3 font-semibold'>
              <button
                className={classNames(
                  `px-3 py-2 w-1/4`,
                  `border-emerald-500 border text-emerald-500 text-center`,
                  `font-semibold`,
                  `rounded-xl`
                )}
                onClick={handleNavigateEdit}
              >
                CHỈNH SỬA
              </button>
              <button
                className={classNames(
                  `px-3 py-2 w-1/4`,
                  `border-emerald-500 border text-emerald-500 text-center`,
                  `font-semibold`,
                  `rounded-xl`
                )}
                // onClick={showModal}
              >
                ĐỔI TRẠNG THÁI
              </button>
            </div>

            <div className={classNames('my-4 px-5 flex gap-3 flex-col')}>
              <h3 className={classNames('text-black text-2xl font-semibold capitalize')}>{newDetail.name}</h3>
              <div className='flex items-center justify-between'>
                <p className='text-base text-emerald-500'>{newDetail.type}</p>
                <p className='text-base'>Ngày đăng tải: {newDetail.createdAt}</p>
              </div>
              <div className={classNames('text-justify text-base text-gray-700 leading-6')}>
                <p className='whitespace-pre-line'>{parse(newDetail.content)}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='flex items-center justify-center w-full'>
          <p>Không tìm thấy công ty phù hợp</p>
        </div>
      )}
    </>
  )
}

export default AdminManageNewDetail
