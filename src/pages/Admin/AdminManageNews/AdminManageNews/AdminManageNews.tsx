import React, { useEffect, useState } from 'react'
import { Button, Input, Modal, Select, Table, Tooltip } from 'antd'
import { SearchOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { ArrowPathIcon, Cog6ToothIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import { AdminService } from '../../../../services/AdminService'
import FilterNewsComponent from './FilterNewsComponent'
import NewTableComponent from './NewTableComponent'
import { toast } from 'react-toastify'

interface News {
  key: string
  stt: number
  _id: string
  thumbnail: string
  name: string
  type: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
}

interface NewFromApi {
  _id: string
  thumbnail: string
  name: string
  type: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
}

const mapTabKeyToStatus = {
  '1': 'active',
  '2': 'inactive'
}

const optionTypeNews = [
  { value: 'Định hướng nghề nghiệp', label: 'Định hướng nghề nghiệp' },
  { value: 'Bí kíp tìm việc', label: 'Bí kíp tìm việc' },
  { value: 'Chế độ lương thưởng', label: 'Chế độ lương thưởng' },
  { value: 'Kiến thức chuyên ngành', label: 'Kiến thức chuyên ngành' }
]

function AdminManageNews() {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [listNews, setListNews] = useState<News[]>([])
  const [activeTabKey, setActiveTabKey] = useState('1')
  const [totalElement, setTotalElement] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [searchValue, setSearchValue] = useState('')
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [chooseNew, setChooseNew] = useState<NewFromApi | null>()

  const columns: ColumnsType<News> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'index',
      width: 50
    },
    {
      title: 'Hình ảnh bài viết',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (image: string) => <img src={image} alt='Hình ảnh bài viết' className='w-40 h-36' />,
      width: 200
    },
    {
      title: 'Loại bài viết',
      dataIndex: 'type',
      key: 'type',
      width: 150
    },
    {
      title: 'Tiêu đề bài viết',
      dataIndex: 'name',
      key: 'name',
      render: (title: string) => (
        <Tooltip placement='topLeft' title={title}>
          <div className='w-80 multiline-ellipsis'>{title}</div>
        </Tooltip>
      ),
      width: 300
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record: News) => (
        <span className='flex items-center justify-center gap-2'>
          <Tooltip placement='topRight' title='Xem chi tiết'>
            <Link to={`/admin/manage_news/${record.key}`}>
              <Button onClick={() => console.log('Xem chi tiết', record.key)}>
                <PencilSquareIcon className='w-4 h-4' />
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title='Đổi trạng thái'>
            <Button onClick={() => showModal(record)}>
              <ArrowPathIcon className='w-4 h-4' />
            </Button>
          </Tooltip>
        </span>
      ),
      width: 150
    }
  ]

  useEffect(() => {
    fetchDataByTab(activeTabKey, currentPage, pageSize)
  }, [activeTabKey, currentPage, pageSize])

  const mapApiDataToTableData = (apiData: NewFromApi[]): News[] => {
    return apiData.map((data, index) => ({
      key: data._id,
      stt: (currentPage - 1) * pageSize + index + 1,
      _id: data._id,
      thumbnail: data.thumbnail,
      name: data.name,
      type: data.type,
      content: data.content,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }))
  }

  const fetchDataByTab = async (key: string, page: number, size: number) => {
    setIsLoading(true)
    try {
      const params = {
        status: mapTabKeyToStatus[key as keyof typeof mapTabKeyToStatus],
        name: searchValue,
        type: selectedType,
        page: page,
        limit: size
      }

      const response = await AdminService.getListNews(params)
      if (response && response.data) {
        setListNews(mapApiDataToTableData(response.data.metadata.listBlog))
        setTotalElement(response.data.metadata.totalElement)
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error)
      setListNews([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDataForTab = (key: string) => {
    setActiveTabKey(key)
    setCurrentPage(1)
    fetchDataForTab(key)
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const params = {
        status: mapTabKeyToStatus[activeTabKey as keyof typeof mapTabKeyToStatus],
        name: searchValue,
        type: selectedType
      }

      const response = await AdminService.getListNews(params)

      if (response && response.data) {
        setListNews(mapApiDataToTableData(response.data.metadata.listBlog))
        setTotalElement(response.data.metadata.totalElement)
      }
    } catch (error) {
      console.error('Error searching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetFilters = async () => {
    setIsLoading(true)

    try {
      // Reset tất cả các state filter về giá trị ban đầu
      setSelectedType(undefined)
      setSearchValue('')

      const acceptanceStatus = mapTabKeyToStatus[activeTabKey as keyof typeof mapTabKeyToStatus]
      // Gọi API với acceptanceStatus sau khi reset và các tham số khác ở giá trị ban đầu
      const response = await AdminService.getListNews({ status: acceptanceStatus })
      if (response && response.data) {
        setListNews(mapApiDataToTableData(response.data.metadata.listBlog))
        setTotalElement(response.data.metadata.totalElement)
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false) // Kết thúc loading
    }
  }

  const showModal = (record: NewFromApi) => {
    setIsModalVisible(true)
    setChooseNew(record) // Lưu record bài viết hiện tại vào state
  }

  const handleOk = () => {
    if (chooseNew) {
      const formDataObj = new FormData()
      const newStatus = chooseNew.status === 'active' ? 'inactive' : 'active'

      formDataObj.append('status', newStatus)

      toast
        .promise(AdminService.updateNewInformation(formDataObj, chooseNew._id), {
          pending: `Trạng thái của tin tức đang được thay đổi`,
          success: `Thay đổi trạng thái của tin tức thành công`
        })
        .then((response) => {
          setIsModalVisible(false)

          fetchDataByTab(activeTabKey, currentPage, pageSize)
        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleNavigate = () => {
    navigate('/admin/manage_news/addNew')
  }

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='w-full'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='flex-1 text-2xl font-semibold text-center'>Quản lí danh sách công ty trong hệ thống</h1>
          <Button type='primary' icon={<PlusCircleOutlined />} onClick={handleNavigate}>
            Tạo bài viết
          </Button>
        </div>
        <div className='flex flex-col gap-6'>
          <FilterNewsComponent
            optionTypeNews={optionTypeNews}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            handleResetFilters={handleResetFilters}
            handleSearch={handleSearch}
          />
          <NewTableComponent
            isLoading={isLoading}
            listNews={listNews}
            columns={columns}
            currentPage={currentPage}
            pageSize={pageSize}
            totalElement={totalElement}
            activeTabKey={activeTabKey}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
            fetchDataByTab={fetchDataByTab}
            fetchDataForTab={fetchDataForTab}
          />
        </div>
      </div>
      <Modal
        title={'Xác nhận đổi trạng thái'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={'Xác nhận'}
        cancelText='Hủy'
        cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
        width={450}
      >
        <p>Bạn có muốn đổi trạng thái của bài viết này không ? </p>
      </Modal>
    </div>
  )
}

export default AdminManageNews
