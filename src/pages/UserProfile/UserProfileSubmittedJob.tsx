import React, { useEffect, useState } from 'react'
import { Button, Table, TableColumnsType, Select, Modal } from 'antd'
import { Input } from 'antd'
import { AuthService } from '../../services/AuthService'
import { JobInterface } from '../../types/job.type'
import classNames from 'classnames'
import { SearchProps } from 'antd/es/input'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'

const { Option } = Select

interface DataType {
  key: string
  index: number
  jobName: string
  jobPosition: string
  companyName: string
  date: string
  status: string
  reason: string
}

const statusClasses: { [key: string]: string } = {
  'Đã nhận': 'bg-emerald-500 text-white',
  'Không nhận': 'bg-red-500 text-white',
  'Đã nộp': 'bg-gray-500 text-white'
}

const UserProfileSubmittedJob = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [activeData, setActiveData] = useState<DataType[]>([])
  const [totalElement, setTotalElement] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedJob, setSelectedJob] = useState<DataType | null>(null)

  const [isReasonModalVisible, setIsReasonModalVisible] = useState(false)
  const [selectedRejectReason, setSelectedRejectReason] = useState('')

  useEffect(() => {
    fetchJobs(currentPage, pageSize, searchTerm, selectedStatus)
  }, [currentPage, pageSize])

  const fetchJobs = async (page: number, limit: number, searchTerm: string, status?: string) => {
    setLoading(true) // Bắt đầu tải, hiển thị spinner loading
    const params = { name: searchTerm, page, limit, status }
    try {
      const response = await AuthService.getJobApply(params)
      if (response && response.data) {
        const data = response.data.metadata.listApplication
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

  const convertJobsToTableData = (jobs: any[]): DataType[] => {
    return jobs.map((job, index) => ({
      key: job.jobId,
      index: index + 1,
      jobName: job.name,
      jobPosition: job.levelRequirement,
      companyName: job.companyName,
      date: job.updatedAt,
      status: job.status,
      reason: job.reasonDecline
    }))
  }

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    setSearchTerm(value)
    fetchJobs(currentPage, pageSize, value, selectedStatus)
  }

  const handlePageChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize
    setCurrentPage(page)
    setPageSize(newPageSize)
    fetchJobs(page, newPageSize, searchTerm, selectedStatus)
  }

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    fetchJobs(currentPage, pageSize, searchTerm, value)
  }

  const handleStatusClick = (record: DataType) => {
    if (record.status === 'Đã nộp') {
      setSelectedJob(record)
      setIsModalVisible(true)
    } else if (record.status === 'Không nhận') {
      setSelectedRejectReason(record.reason)
      setIsReasonModalVisible(true)
    }
  }

  const handleModalOk = async () => {
    if (selectedJob) {
      toast
        .promise(AuthService.withdrawJobApplication(selectedJob.key), {
          pending: `Thu hồi hồ sơ đang được diễn ra`,
          success: `Hồ sơ của bạn đã được thu hồi`
        })
        .then(() => {
          setIsModalVisible(false)
          fetchJobs(currentPage, pageSize, searchTerm, selectedStatus)
        })
        .catch((error) => toast.error(error.response.data.message))
    }
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'STT',
      dataIndex: 'index',
      className: 'border border-gray-200'
    },
    {
      title: 'TÊN CÔNG VIỆC',
      dataIndex: 'jobName',
      className: 'border border-gray-200'
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
      title: 'THỜI GIAN CẬP NHẬT',
      dataIndex: 'date',
      className: 'border border-gray-200'
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      render: (_, record) => (
        <div className='w-full'>
          <div
            className={classNames('flex items-center justify-center p-1', statusClasses[record.status], {
              'cursor-pointer': record.status === 'Đã nộp' || record.status === 'Không nhận'
            })}
            onClick={() => {
              if (record.status === 'Đã nộp' || record.status === 'Không nhận') {
                handleStatusClick(record)
              }
            }}
          >
            {record.status}
          </div>
        </div>
      ),
      className: 'border border-gray-200'
    }
  ]

  console.log(activeData)

  return (
    <div className={`px-4 py-4 bg-zinc-100 mt-2 rounded-xl flex flex-col gap-2 flex-1`}>
      <div className={classNames(`flex flex-col gap-4`)}>
        <div className='flex items-center justify-between'>
          <h1 className={classNames(`font-semibold text-xl pt-2`)}>CÔNG VIỆC ỨNG TUYỂN</h1>

          <div className='flex items-center gap-2'>
            <Select
              placeholder='Chọn trạng thái'
              onChange={handleStatusChange}
              allowClear
              // size='large'
              style={{ width: 200 }} // Width cố định cho Select
            >
              <Option value='Đã nhận'>Đã nhận</Option>
              <Option value='Không nhận'>Không nhận</Option>
              <Option value='Đã nộp'>Đã nộp</Option>
            </Select>
            <Input.Search
              placeholder='Tìm kiếm'
              onSearch={onSearch}
              enterButton
              // size='large'
              style={{ width: '70%' }}
            />
          </div>
        </div>
        <p className='flex items-center gap-2'>
          <div className='flex flex-col'>
            <div className='flex items-center gap-3'>
              <ExclamationCircleIcon className='w-4 h-4' />
              <p className='font-bold'>Lưu ý: </p>
            </div>
            <ul>
              <li>
                Bạn có thể <span className='text-emerald-500'>rút hồ sơ ứng tuyển</span> ở những công việc có trạng thái
                <span className='text-emerald-500'> "Đã nộp"</span> bằng cách nhấn vào trạng thái đó.
              </li>
              <li>
                Bạn có thể <span className='text-emerald-500'>xem lý do</span> ở những công việc có trạng thái{' '}
                <span className='text-emerald-500'> "Không nhận"</span> bằng cách nhấn vào trạng thái đó.
              </li>
            </ul>
          </div>
        </p>
        <div>
          <Table
            className='border border-gray-200'
            columns={columns}
            dataSource={activeData}
            size='middle'
            loading={loading}
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
        <Modal
          title='Rút hồ sơ ứng tuyển'
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText='Có'
          cancelText='Hủy'
          cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
        >
          <p>
            Bạn có chắc chắn muốn rút hồ sơ ứng tuyển cho công việc "{selectedJob?.jobName}" tại công ty "
            {selectedJob?.companyName}" không?
          </p>
        </Modal>

        <Modal
          title='Lý do không được nhận'
          visible={isReasonModalVisible}
          onOk={() => setIsReasonModalVisible(false)}
          onCancel={() => setIsReasonModalVisible(false)}
          okText='Đóng'
          cancelText='Hủy'
          cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
        >
          <p>{selectedRejectReason}</p>
        </Modal>
      </div>
    </div>
  )
}

export default UserProfileSubmittedJob
