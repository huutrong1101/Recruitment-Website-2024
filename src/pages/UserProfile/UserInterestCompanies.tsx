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
import { RecruiterResponseState } from '../../types/user.type'

interface DataType {
  key: React.Key
  index: number
  companyName: string
  fieldOfActivity: string[]
  activeJobCount: number
  slug: string
}

interface Props {
  handleDeleteFavorite: (key: React.Key) => void
  handleNavigateToCompanyPage: (slug: string) => void
}

function UserInterestCompanies() {
  const navigate = useNavigate()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalDeleteAllVisible, setIsModalDeleteAllVisible] = useState(false)
  const [deleteCompanyKey, setDeleteCompanyKey] = useState<React.Key | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [activeData, setActiveData] = useState<DataType[]>([])
  const [totalElement, setTotalElement] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  useEffect(() => {
    fetchCompanies(currentPage, pageSize, searchTerm)
  }, [currentPage, pageSize])

  const columns = (props: Props): TableColumnsType<DataType> => [
    {
      title: 'STT',
      dataIndex: 'index',
      className: 'border border-gray-200'
    },
    {
      title: 'TÊN CÔNG TY',
      dataIndex: 'companyName',
      className: 'border border-gray-200',
      render: (text: string, record: DataType) => (
        <Tooltip title='Xem chi tiết'>
          <a className='font-medium' onClick={() => handleNavigateToCompanyPage(record.slug)}>
            {text}
          </a>
        </Tooltip>
      )
    },
    {
      title: 'LĨNH VỰC',
      dataIndex: 'fieldOfActivity',
      render: (fieldOfActivity: string[]) => fieldOfActivity.join(', '),
      className: 'border border-gray-200'
    },
    {
      title: 'CÔNG VIỆC ĐANG TUYỂN',
      dataIndex: 'activeJobCount',
      className: 'border border-gray-200',
      align: 'center'
    }
  ]

  const fetchCompanies = async (page: number, limit: number, searchTerm: string) => {
    setLoading(true)
    const params = { name: searchTerm, page, limit }
    try {
      const response = await AuthService.getCompanyFavorite(params)
      if (response && response.data) {
        const data = response.data.metadata.listFavoriteRecruiter
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

  const showModal = (key: React.Key) => {
    setDeleteCompanyKey(key)
    setIsModalVisible(true)
  }

  const handleOk = () => {
    toast
      .promise(AuthService.deleteFavoriteCompany(deleteCompanyKey), {
        pending: `Công ty đang được xóa khỏi danh sách`,
        success: `Xóa công ty thành công`
      })
      .then(() => {
        setIsModalVisible(false)
        fetchCompanies(currentPage, pageSize, searchTerm) // Gọi lại sau khi xóa để cập nhật danh sách
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
      .promise(AuthService.deleteAllFavoriteCompany(), {
        pending: `Công việc đang được xóa khỏi danh sách`,
        success: `Xóa công việc thành công`
      })
      .then(() => {
        setIsModalDeleteAllVisible(false)
        fetchCompanies(currentPage, pageSize, searchTerm) // Gọi lại sau khi xóa để cập nhật danh sách
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const handleCancelDelete = () => {
    setIsModalDeleteAllVisible(false)
  }

  const handleDeleteFavorite = (key: React.Key) => {
    showModal(key)
  }

  const handleNavigateToCompanyPage = (slug: string) => {
    navigate(`/recruiters/${slug}`)
  }

  const convertJobsToTableData = (companies: RecruiterResponseState[]): DataType[] => {
    return companies.map((company, index) => ({
      key: company._id,
      index: index + 1, // Hoặc một số thứ tự tùy chỉnh nếu bạn muốn
      companyName: company.companyName,
      fieldOfActivity: company.fieldOfActivity,
      activeJobCount: company.activeJobCount,
      slug: company.slug
    }))
  }

  const handlePageChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize
    setCurrentPage(page)
    setPageSize(newPageSize)
    fetchCompanies(page, newPageSize, searchTerm)
  }

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    setSearchTerm(value)
    fetchCompanies(currentPage, pageSize, value)
  }

  const handleBatchDelete = () => {
    const jobIdsAsString = selectedRowKeys.map((key) => String(key))
    toast
      .promise(AuthService.deleteListFavoriteCompany(jobIdsAsString), {
        pending: `Các công ty đang được xóa khỏi danh sách`,
        success: `Xóa công ty thành công`
      })
      .then(() => {
        fetchCompanies(currentPage, pageSize, searchTerm)
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
          <h1 className={classnames(`font-semibold text-xl pt-2`)}>CÔNG TY THEO DÕI</h1>

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
                  Bạn đã chọn <span className='font-bold text-red-500'>{selectedRowKeys.length}</span> công ty
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
            columns={columns({ handleDeleteFavorite, handleNavigateToCompanyPage })}
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
          <p>Bạn có muốn xóa công ty này ra khỏi danh sách yêu thích không ?</p>
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
          <p>Bạn có muốn xóa tất cả công ty ra khỏi danh sách yêu thích ?</p>
          <p className='text-red-500'>Lưu ý: Thao tác này sẽ không thể hoàn tác</p>
        </div>
      </Modal>
    </div>
  )
}

export default UserInterestCompanies
