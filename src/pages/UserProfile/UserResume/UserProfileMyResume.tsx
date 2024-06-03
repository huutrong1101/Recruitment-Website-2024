import classNames from 'classnames'
import Search, { SearchProps } from 'antd/es/input/Search'
import { Button, Pagination, Table, TableColumnsType } from 'antd'
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import CandidateCardCV from '../../../components/CandidateCard/CandidateCardCV'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AuthService } from '../../../services/AuthService'
import { ResumeResponse } from '../../../types/resume.type'
import { Spin } from 'antd'

export default function UserProfileMyResume() {
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [activeData, setActiveData] = useState<ResumeResponse[]>([])
  const [totalElement, setTotalElement] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNavigateToAddResume = () => {
    navigate('/profile/resume/add')
  }

  useEffect(() => {
    fetchListResume(currentPage, pageSize, searchTerm)
  }, [currentPage, pageSize])

  const fetchListResume = async (page: number, limit: number, searchTerm: string) => {
    setLoading(true)
    const params = { name: searchTerm, page, limit }
    try {
      const response = await AuthService.getListResume(params)
      if (response && response.data) {
        const data = response.data.metadata.listResume
        const total = response.data.metadata.totalElement
        setActiveData(data)
        setTotalElement(total)
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setPageSize(pageSize)
    fetchListResume(page, pageSize, searchTerm)
  }

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    setSearchTerm(value)
    fetchListResume(currentPage, pageSize, value)
  }

  console.log(activeData)

  return (
    <div className={classNames(`flex-1 flex flex-col gap-4`)}>
      <div className='p-4 border rounded-xl border-zinc-100'>
        <div className='flex items-center justify-between pb-4 border-b border-b-zinc-200'>
          <h1 className={classNames(`font-semibold text-xl pt-2`)}>Danh sách CV</h1>
          <div className='flex items-center gap-2'>
            <Search placeholder='Tìm kiếm' onSearch={onSearch} enterButton />
            <Button type='primary' className={'flex items-center gap-1'} onClick={handleNavigateToAddResume}>
              <PlusIcon className='w-4 h-4 text-white' />
              Thêm mới
            </Button>
          </div>
        </div>

        <Spin spinning={loading} size='large'>
          <div className='flex flex-col gap-3 p-2 mt-2'>
            {activeData && activeData.length > 0 ? (
              activeData.map((resume) => <CandidateCardCV resume={resume} key={resume._id} />)
            ) : (
              <div className='flex items-center justify-center'>Hiện tại chưa có cv nào!</div>
            )}
          </div>
        </Spin>

        <div className='flex items-center justify-end mt-2'>
          <Pagination current={currentPage} pageSize={pageSize} total={totalElement} onChange={handlePageChange} />
        </div>
      </div>
    </div>
  )
}
