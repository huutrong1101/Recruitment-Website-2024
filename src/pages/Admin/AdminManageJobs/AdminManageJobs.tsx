// Import React và các thành phần từ 'antd'
import { useEffect, useState } from 'react'
import { Button, Select, Tabs, Tooltip } from 'antd'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { Cog6ToothIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { JobService } from '../../../services/JobService'
import { RecruiterResponseState } from '../../../types/user.type'
import FilterPanelComponent from './FilterPanelComponent'
import JobTableComponent from './JobTableComponent'
import { AdminService } from '../../../services/AdminService'
import { Link, useNavigate } from 'react-router-dom'
import { ColumnType } from 'antd/es/table'
import { useTokenAuthorize } from '../../../hooks/useTokenAuthorize'
import { PlusCircleOutlined } from '@ant-design/icons'

// Định nghĩa các interface
interface DataType {
  _id: string
  stt: number
  companyName: string
  jobName: string
  field: string
  levelRequirement: string
  deadline: string
  premiumAccount: boolean
}

interface JobFromApi {
  _id: string
  name: string
  levelRequirement: string
  field: string
  deadline: string
  acceptanceStatus: string
  companyName: string
  companyLogo: string
  premiumAccount: boolean
}

interface ActivityOption {
  value: string
  label: string
}

const getColumns = (activeTabKey: string): Array<ColumnType<DataType>> => [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt'
  },
  {
    title: 'TÊN CÔNG TY',
    dataIndex: 'companyName',
    key: 'companyName'
  },
  {
    title: 'TÊN VIỆC LÀM',
    dataIndex: 'jobName',
    key: 'jobName'
  },
  {
    title: 'LĨNH VỰC',
    dataIndex: 'field',
    key: 'field'
  },
  {
    title: 'LOẠI HÌNH',
    dataIndex: 'levelRequirement',
    key: 'levelRequirement'
  },
  {
    title: 'NGÀY HẾT HẠN',
    dataIndex: 'deadline',
    key: 'deadline'
  },
  {
    title: <Cog6ToothIcon className='w-6 h-6' />,
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => (
      <span>
        <Tooltip placement='topRight' title='Xem chi tiết'>
          <Link to={`/admin/manage_jobs/${record._id}`}>
            <Button>
              <PencilSquareIcon className='w-4 h-4' />
            </Button>
          </Link>
        </Tooltip>
      </span>
    )
  }
]

const mapTabKeyToStatus = {
  '1': 'accept',
  '2': 'waiting',
  '3': 'decline'
}

function AdminManageJobs() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const activities = useAppSelector((state): string[] => state.Job.activities)
  const levels = useAppSelector((state): string[] => state.Job.levelRequirement)
  const listRec = useAppSelector((state): RecruiterResponseState[] => state.AdminSlice.listRec)
  const [activeData, setActiveData] = useState<DataType[]>([])
  const [activeTabKey, setActiveTabKey] = useState('1')
  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined)
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(undefined)
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined)
  const [companyOptions, setCompanyOptions] = useState<ActivityOption[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalElement, setTotalElement] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const optionsActivity: ActivityOption[] = activities.map((activity) => ({
    value: activity,
    label: activity
  }))

  const optionsLevels: ActivityOption[] = levels.map((level) => ({
    value: level,
    label: level
  }))

  const mapApiDataToTableData = (apiData: JobFromApi[]): DataType[] => {
    return apiData.map((job, index) => ({
      _id: job._id,
      stt: (currentPage - 1) * pageSize + index + 1,
      companyName: job.companyName,
      jobName: job.name,
      field: job.field,
      levelRequirement: job.levelRequirement,
      deadline: job.deadline,
      premiumAccount: job.premiumAccount // Thêm thuộc tính này
    }))
  }

  useEffect(() => {
    JobService.getActivity(dispatch)
    JobService.getType(dispatch)
    AdminService.getListRec(dispatch)
  }, [dispatch])

  useEffect(() => {
    // Sử dụng một Set để loại bỏ các giá trị trùng lặp
    const companiesSet = new Set(listRec.map((rec) => rec.companyName))

    // Chuyển đổi Set thành mảng của các options riêng biệt
    const uniqueCompanyOptions: ActivityOption[] = Array.from(companiesSet).map((companyName) => ({
      label: companyName,
      value: companyName
    }))

    setCompanyOptions(uniqueCompanyOptions)
  }, [listRec])

  useEffect(() => {
    fetchDataByTab(activeTabKey, currentPage, pageSize)
  }, [activeTabKey, currentPage, pageSize])

  const fetchDataByTab = async (key: string, page: number, size: number) => {
    setIsLoading(true)
    try {
      const params = {
        acceptanceStatus: mapTabKeyToStatus[key as keyof typeof mapTabKeyToStatus],
        name: searchValue,
        field: selectedActivity,
        levelRequirement: selectedType,
        companyName: selectedCompany,
        page: page,
        limit: size
      }

      const response = await AdminService.getListJobs(params)
      if (response && response.data) {
        setActiveData(mapApiDataToTableData(response.data.metadata.listJob))
        setTotalElement(response.data.metadata.totalElement)
      }
    } catch (error) {
      console.error('An error occurred while fetching data:', error)
      setActiveData([])
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
      const acceptanceStatus = mapTabKeyToStatus[activeTabKey as keyof typeof mapTabKeyToStatus]

      const params = {
        name: searchValue,
        field: selectedActivity,
        levelRequirement: selectedType,
        companyName: selectedCompany,
        acceptanceStatus
      }

      const response = await AdminService.getListJobs(params)

      if (response) {
        setActiveData(mapApiDataToTableData(response.data.metadata.listJob))
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
      setSelectedActivity(undefined)
      setSelectedType(undefined)
      setSelectedCompany(undefined)
      setSearchValue('')

      const acceptanceStatus = mapTabKeyToStatus[activeTabKey as keyof typeof mapTabKeyToStatus]
      // Gọi API với acceptanceStatus sau khi reset và các tham số khác ở giá trị ban đầu
      const response = await AdminService.getListJobs({ acceptanceStatus: acceptanceStatus })
      if (response) {
        setActiveData(mapApiDataToTableData(response.data.metadata.listJob))
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false) // Kết thúc loading
    }
  }

  const handleNavigate = () => {
    navigate('/admin/manage_jobs/addJob')
  }

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='w-full'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='flex-1 text-2xl font-semibold text-center'>Quản lí danh sách công việc trong hệ thống</h1>
          <Button type='primary' icon={<PlusCircleOutlined />} onClick={handleNavigate}>
            Tạo công việc
          </Button>
        </div>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <FilterPanelComponent
              selectedActivity={selectedActivity}
              setSelectedActivity={setSelectedActivity}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              handleResetFilters={handleResetFilters}
              handleSearch={handleSearch}
              companyOptions={companyOptions}
              optionsActivity={optionsActivity}
              optionsTypes={optionsLevels}
            />

            <JobTableComponent
              isLoading={isLoading}
              activeData={activeData}
              columns={getColumns(activeTabKey)}
              fetchDataForTab={fetchDataForTab}
              fetchDataByTab={fetchDataByTab}
              currentPage={currentPage}
              pageSize={pageSize}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
              totalElement={totalElement}
              activeTabKey={activeTabKey}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminManageJobs
