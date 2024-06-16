import { ArrowRightIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button, Table, TableColumnsType, Tooltip } from 'antd'
import Search, { SearchProps } from 'antd/es/input/Search'
import classnames from 'classnames'
import React, { useEffect, useState } from 'react'
import { AuthService } from '../../services/AuthService'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { JobInterface } from '../../types/job.type'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'antd'
import { toast } from 'react-toastify'
import { UserService } from '../../services/UserService'

interface DataType {
  key: React.Key
  index: number
  jobName: string
  jobPosition: string
  companyName: string
  date: string
}

interface Props {
  handleDeleteFavorite: (key: React.Key) => void
  handleNavigateToJobPage: (key: React.Key) => void
}

function UserInterestJob() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const jobs: JobInterface[] = useAppSelector((state) => state.Job.jobFavorite)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalDeleteAllVisible, setIsModalDeleteAllVisible] = useState(false)
  const [deleteJobKey, setDeleteJobKey] = useState<React.Key | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [activeData, setActiveData] = useState<DataType[]>([])
  const [totalElement, setTotalElement] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  useEffect(() => {
    fetchJobs(currentPage, pageSize, searchTerm)
  }, [currentPage, pageSize])

  const fetchJobs = async (page: number, limit: number, searchTerm: string) => {
    setLoading(true)
    const params = { name: searchTerm, page, limit }
    try {
      const response = await AuthService.getJobFavorite(params)
      if (response && response.data) {
        const data = response.data.metadata.listFavoriteJob
        const total = response.data.metadata.totalElement
        setActiveData(convertJobsToTableData(data))
        setTotalElement(total)
      }
    } catch (error) {
      // Xử lý lỗi nếu cần...
      console.error('Fetching jobs failed:', error)
    } finally {
      setLoading(false) // Khi hoàn thành hoặc có lỗi, dừng spinner loading
    }
  }

  const columns = (props: Props): TableColumnsType<DataType> => [
    {
      title: 'STT',
      dataIndex: 'index',
      className: 'border border-gray-200'
    },
    {
      title: 'TÊN CÔNG VIỆC',
      dataIndex: 'jobName',
      className: 'border border-gray-200',
      render: (text: string, record: DataType) => (
        <Tooltip title='Xem chi tiết'>
          <a className='font-medium' onClick={() => handleNavigateToJobPage(record.key)}>
            {text}
          </a>
        </Tooltip>
      )
    },
    {
      title: 'VỊ TRÍ CÔNG VIỆC',
      dataIndex: 'jobPosition',
      className: 'border border-gray-200'
    },
    {
      title: 'TÊN CÔNG TY',
      dataIndex: 'companyName',
      className: 'border border-gray-200'
    },
    {
      title: 'NGÀY HẾT HẠN',
      dataIndex: 'date',
      className: 'border border-gray-200'
    }
  ]

  const showModal = (key: React.Key) => {
    setDeleteJobKey(key)
    setIsModalVisible(true)
  }

  const handleOk = () => {
    toast
      .promise(UserService.deleteFavoriteJob(deleteJobKey), {
        pending: `Công việc đang được xóa khỏi danh sách`,
        success: `Xóa công việc thành công`
      })
      .then(() => {
        setIsModalVisible(false)
        fetchJobs(currentPage, pageSize, searchTerm) // Gọi lại sau khi xóa để cập nhật danh sách
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const showModalDeleteAll = () => {
    setIsModalDeleteAllVisible(true)
  }

  const handleDelete = () => {
    toast
      .promise(UserService.deleteAllFavoriteJob(), {
        pending: `Công việc đang được xóa khỏi danh sách`,
        success: `Xóa công việc thành công`
      })
      .then(() => {
        setIsModalDeleteAllVisible(false)
        fetchJobs(currentPage, pageSize, searchTerm) // Gọi lại sau khi xóa để cập nhật danh sách
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const handleCancelDelete = () => {
    setIsModalDeleteAllVisible(false)
  }

  const handleDeleteFavorite = (key: React.Key) => {
    showModal(key)
  }

  const handleNavigateToJobPage = (key: React.Key) => {
    navigate(`/jobs/${key}`)
  }

  const convertJobsToTableData = (jobs: JobInterface[]): DataType[] => {
    return jobs.map((job, index) => ({
      key: job._id,
      index: (currentPage - 1) * pageSize + index + 1,
      jobName: job.name,
      jobPosition: job.levelRequirement, // Hoặc trường thông tin trí vị trí công việc nếu có
      companyName: job.companyName,
      date: job.deadline // Định dạng lại nếu cần
    }))
  }

  const handlePageChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize
    setCurrentPage(page)
    setPageSize(newPageSize)
    fetchJobs(page, newPageSize, searchTerm)
  }

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    setSearchTerm(value)
    fetchJobs(currentPage, pageSize, value)
  }

  const handleBatchDelete = () => {
    const jobIdsAsString = selectedRowKeys.map((key) => String(key))
    toast
      .promise(UserService.deleteListFavoriteJob(jobIdsAsString), {
        pending: `Các công việc đang được xóa khỏi danh sách`,
        success: `Xóa công việc thành công`
      })
      .then(() => {
        fetchJobs(currentPage, pageSize, searchTerm)
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys)
    }
  }

  return (
    <div className={`px-4 py-4 bg-zinc-100 mt-2 rounded-xl flex flex-col gap-2 flex-1`}>
      <div className={classnames(`flex flex-col gap-4`)}>
        <div className='flex items-center justify-between'>
          <h1 className={classnames(`font-semibold text-xl pt-2`)}>CÔNG VIỆC QUAN TÂM</h1>

          <div className='flex items-center gap-2'>
            <Search placeholder='Tìm kiếm' onSearch={onSearch} enterButton />
            <Button type='primary' className={'flex items-center gap-1'} onClick={showModalDeleteAll}>
              <TrashIcon className='w-5 h-5' />
              Xóa tất cả
            </Button>
          </div>
        </div>
        <div>
          {selectedRowKeys.length > 0 ? (
            <div className='flex items-center justify-between w-full mb-3'>
              {selectedRowKeys.length > 0 && (
                <p>
                  Bạn đã chọn <span className='font-bold text-red-500'>{selectedRowKeys.length}</span> công việc
                </p>
              )}

              <Button type='primary' disabled={!selectedRowKeys.length} onClick={handleBatchDelete}>
                Xóa những mục đã chọn
              </Button>
            </div>
          ) : (
            <div className='flex items-center justify-end w-full mb-3'>
              <Button type='primary' disabled={!selectedRowKeys.length} onClick={handleBatchDelete}>
                Xóa những mục đã chọn
              </Button>
            </div>
          )}
          <Table
            className='border border-gray-200'
            columns={columns({ handleDeleteFavorite, handleNavigateToJobPage })}
            dataSource={activeData}
            size='middle'
            loading={loading}
            rowSelection={rowSelection}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              onChange: handlePageChange,
              onShowSizeChange: handlePageChange,
              total: totalElement,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '30', '50'],
              locale: { items_per_page: ' / trang' }
            }}
          />
        </div>
      </div>
      <Modal
        title='Xác nhận xóa'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText='Có'
        cancelText='Hủy'
        cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
        width={450}
      >
        <div className='flex flex-col gap-1'>
          <p>Bạn có muốn xóa công việc này ra khỏi danh sách yêu thích không ?</p>
          <p className='text-red-500'>Lưu ý: Thao tác này sẽ không thể hoàn tác</p>
        </div>
      </Modal>

      <Modal
        title='Xác nhận xóa'
        visible={isModalDeleteAllVisible}
        onOk={handleDelete}
        onCancel={handleCancelDelete}
        okText='Có'
        cancelText='Hủy'
        cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
        width={450}
      >
        <div className='flex flex-col gap-1'>
          <p>Bạn có muốn xóa tất cả công việc ra khỏi danh sách yêu thích ?</p>
          <p className='text-red-500'>Lưu ý: Thao tác này sẽ không thể hoàn tác</p>
        </div>
      </Modal>
    </div>
  )
}

export default UserInterestJob
