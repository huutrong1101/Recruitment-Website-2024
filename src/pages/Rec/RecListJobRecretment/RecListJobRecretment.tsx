// Import React và các thành phần từ 'antd'
import React, { useEffect, useState } from 'react'
import { Button, Input, Select, Table, Tabs } from 'antd'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import type { TableColumnsType } from 'antd'
import { Cog6ToothIcon, EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { fetchListWatingJobs } from '../../../redux/reducer/RecSlice'
import moment from 'moment'
import { JobService } from '../../../services/JobService'
import { RecService } from '../../../services/RecService'
import FilterPanelComponent from './FilterPanelComponent'
import JobTableComponent from './JobTableComponent'
import { Link } from 'react-router-dom'

const { Option } = Select
const { TabPane } = Tabs

// Định nghĩa các interface
interface DataType {
  key: React.Key
  stt: number
  jobName: string
  jobPosition: string
  expirationDate: string
  applicationProfile: number
  status: string
}

interface JobFromApi {
  _id: string
  name: string
  levelRequirement: string
  field: string
  deadline: string
  status: 'active' | 'inactive'
  applicationNumber: number
}

interface ActivityOption {
  value: string
  label: string
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt'
  },
  {
    title: 'TÊN VIỆC LÀM',
    dataIndex: 'jobName', // Tên trường dữ liệu mà bạn muốn hiển thị
    key: 'jobName'
  },
  {
    title: 'VỊ TRÍ CÔNG VIỆC',
    dataIndex: 'jobPosition',
    key: 'jobPosition'
  },
  {
    title: 'NGÀY HẾT HẠN',
    dataIndex: 'expirationDate',
    key: 'expirationDate',
    render: (expirationDate) => moment(expirationDate).format('DD-MM-YYYY')
  },
  {
    title: 'HỒ SƠ ỨNG TUYỂN',
    dataIndex: 'applicationProfile',
    key: 'applicationProfile',
    align: 'center',
    render: (applicationProfile, record) => (
      <div className='flex flex-col items-center justify-center'>
        {applicationProfile} hồ sơ
        {applicationProfile === 0 && <Link to={`/recruiter/profile/jobsPosted/listCandidate/${record.key}`}>Xem</Link>}
      </div>
    )
  },
  {
    title: 'TRẠNG THÁI',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (text, record) => (
      <div className={text === 'Kích hoạt' ? 'p-1 text-white bg-emerald-500' : 'p-1 text-white bg-red-500'}>{text}</div>
    )
  },
  {
    title: <Cog6ToothIcon className='w-6 h-6' />,
    dataIndex: 'action',
    key: 'action',
    render: () => (
      <span>
        <Button>
          <PencilSquareIcon className='w-4 h-4' />
        </Button>
      </span>
    )
  }
]

function RecListJobRecruitment(): JSX.Element {
  const dispatch = useAppDispatch()

  const activities = useAppSelector((state): string[] => state.Job.activities)
  const levelRequirement = useAppSelector((state): string[] => state.Job.levelRequirement)
  const [activeData, setActiveData] = useState<DataType[]>([])
  const [activeTabKey, setActiveTabKey] = useState('1')
  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined)
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined)
  const [searchValue, setSearchValue] = useState('')
  const [totalElement, setTotalElement] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

  // Function để chuyển đổi dữ liệu từ API
  const mapApiDataToTableData = (apiData: JobFromApi[]): DataType[] => {
    return apiData.map((job, index) => ({
      key: job._id,
      stt: index + 1,
      jobName: job.name,
      jobPosition: job.field, // Lấy từ trường 'field'
      expirationDate: job.deadline,
      applicationProfile: job.applicationNumber,
      status: job.status === 'active' ? 'Kích hoạt' : 'Không kích hoạt'
    }))
  }

  useEffect(() => {
    dispatch(fetchListWatingJobs())
  }, [])

  useEffect(() => {
    JobService.getActivity(dispatch)
    JobService.getType(dispatch)
  }, [dispatch])

  useEffect(() => {
    fetchDataByTab(activeTabKey, currentPage, pageSize)
  }, [activeTabKey, currentPage, pageSize])

  // Tạo options từ activities
  const optionsActivity: ActivityOption[] = activities.map((activity) => ({
    value: activity,
    label: activity
  }))

  const optionsLevels: ActivityOption[] = levelRequirement.map((level) => ({
    value: level,
    label: level
  }))

  const fetchDataByTab = async (key: string, page: number, size: number) => {
    setIsLoading(true)
    try {
      let response
      switch (key) {
        case '1':
          response = await RecService.getAcceptedJobs({ page: page, limit: size }) // Giả định rằng nó sẽ trả về AxiosResponse
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listAcceptedJob))
            setTotalElement(response.data.metadata.totalElement)
          }
          break
        case '2':
          response = await RecService.getListWaitingJob() // Giả định rằng nó sẽ trả về AxiosResponse
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listWaitingJob))
          }
          break
        case '3':
          response = await RecService.getDeclinedJobs() // Giả định rằng nó sẽ trả về AxiosResponse
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listDeclinedJob))
          }
          break
        case '4':
          setActiveData([])
          break
        case '5':
          setActiveData([])
          break
        // ... các trường hợp khác tương tự
        default:
          setActiveData([])
          setIsLoading(false)
          return
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
    setCurrentPage(1) // Reset lại trang đầu tiên mỗi khi thay đổi tab
    fetchDataForTab(key)
  }

  const handleSearch = async () => {
    setIsLoading(true) // Bắt đầu quá trình tải dữ liệu
    try {
      let response
      const searchParams = {
        // Chuyển đổi giá trị tìm kiếm sang tham số phù hợp cho API
        name: searchValue,
        field: selectedActivity,
        type: selectedType
      }

      switch (activeTabKey) {
        case '1':
          // Thực hiện tìm kiếm dựa trên tab đang chọn
          response = await RecService.getAcceptedJobs(searchParams)
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listAcceptedJob))
          }
          break
        case '2':
          response = await RecService.getListWaitingJob(searchParams)
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listWaitingJob))
          }
          break
        case '3':
          response = await RecService.getDeclinedJobs(searchParams)
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listDeclinedJob))
          }
          break
        default:
          console.log('Tab khác')
          response = { data: { metadata: { list: [] } } }
      }

      if (response && response.data) {
        // Cập nhật danh sách hiển thị dựa trên kết quả tìm kiếm
        setActiveData(mapApiDataToTableData(response.data.metadata.list))
      }
    } catch (error) {
      console.error('An error occurred while searching:', error)
    } finally {
      setIsLoading(false) // Kết thúc quá trình tải dữ liệu
    }
  }

  const handleResetFilters = () => {
    setSelectedActivity(undefined)
    setSelectedType(undefined)
    setSearchValue('')

    // Gọi lại hàm lấy dữ liệu ban đầu dựa trên tab hiện tại sau khi đã xóa bộ lọc
    fetchDataByTab(activeTabKey, currentPage, pageSize)
  }

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='w-full p-4 border rounded-xl border-zinc-100'>
        <h1 className='flex-1 text-2xl font-semibold md:mb-4'>Danh sách việc làm đã đăng tuyển</h1>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <FilterPanelComponent
              selectedActivity={selectedActivity}
              setSelectedActivity={setSelectedActivity}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              handleResetFilters={handleResetFilters}
              handleSearch={handleSearch}
              optionsActivity={optionsActivity}
              optionsLevels={optionsLevels}
            />
            <JobTableComponent
              isLoading={isLoading}
              activeData={activeData}
              columns={columns}
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

export default RecListJobRecruitment