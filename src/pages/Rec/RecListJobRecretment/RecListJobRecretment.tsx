// Import React và các thành phần từ 'antd'
import React, { useEffect, useState } from 'react'
import { Button, Input, Modal, Select, Table, Tabs, Tooltip } from 'antd'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import type { TableColumnsType } from 'antd'
import { Cog6ToothIcon, EyeIcon, PencilSquareIcon, StarIcon } from '@heroicons/react/24/outline'
import { fetchListWatingJobs } from '../../../redux/reducer/RecSlice'
import moment from 'moment'
import { JobService } from '../../../services/JobService'
import { RecService } from '../../../services/RecService'
import FilterPanelComponent from './FilterPanelComponent'
import JobTableComponent from './JobTableComponent'
import { Link } from 'react-router-dom'
import { MdOutlineSettingsSuggest, MdSettings } from 'react-icons/md'

const { Option } = Select
const { TabPane } = Tabs

// Định nghĩa các interface
interface DataType {
  key: string
  stt: number
  jobName: string
  jobPosition: string
  expirationDate: string
  applicationProfile: number
  status: string
  banReason: string
}

interface JobFromApi {
  _id: string
  name: string
  levelRequirement: string
  field: string
  deadline: string
  status: 'active' | 'inactive'
  applicationNumber: number
  banReason: string
}

interface ActivityOption {
  value: string
  label: string
}

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
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalReason, setIsModalReason] = useState(false)
  const [currentJob, setCurrentJob] = useState<DataType | null>(null)

  console.log(currentJob)

  let columns: TableColumnsType<DataType> = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt'
    },
    {
      title: 'TÊN VIỆC LÀM',
      dataIndex: 'jobName', // Tên trường dữ liệu mà bạn muốn hiển thị
      key: 'jobName',
      render: (text, record) => (
        <Tooltip title='Xem chi tiết'>
          <Link to={`/recruiter/profile/editJob/${record.key}`}>
            <p className='font-medium'>{record.jobName}</p>
          </Link>
        </Tooltip>
      )
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
          <p className='text-red-500 '> {applicationProfile} hồ sơ</p>
          {applicationProfile !== 0 && (
            <Link
              className='px-2 text-white bg-emerald-500'
              to={`/recruiter/profile/jobsPosted/listCandidate/${record.key}`}
            >
              Xem
            </Link>
          )}
        </div>
      )
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (text, record) => (
        <Tooltip title='Đổi trạng thái'>
          <div
            className={
              text === 'Kích hoạt'
                ? 'p-1 text-white bg-emerald-500 cursor-pointer'
                : 'p-1 text-white bg-red-500 cursor-pointer'
            }
            onClick={() => showModal(record)}
          >
            {text}
          </div>
        </Tooltip>
      )
    },
    {
      title: 'HOẠT ĐỘNG',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (text, record) => (
        <Tooltip title='Gợi ý ứng viên'>
          <Link
            className='flex items-center justify-center'
            to={`/recruiter/profile/jobsPosted/suggestCandidate/${record.key}`}
          >
            <MdOutlineSettingsSuggest className='w-6 h-6' />
          </Link>
        </Tooltip>
      )
    }
  ]

  if (activeTabKey === '2') {
    columns = columns.filter((column) => column.key !== 'applicationProfile' && column.key !== 'status')
    columns.push({
      title: 'HÀNH ĐỘNG',
      key: 'action',
      render: (_, record) => (
        <div
          className='p-1 text-center text-white cursor-pointer bg-emerald-500'
          onClick={() => showModalReason(record)}
        >
          Xem lý do
        </div>
      )
    })
  }

  if (activeTabKey === '4') {
    columns = columns.filter((column) => column.key !== 'applicationProfile' && column.key !== 'status')
  }
  // Function để chuyển đổi dữ liệu từ API
  const mapApiDataToTableData = (apiData: JobFromApi[]): DataType[] => {
    return apiData.map((job, index) => ({
      key: job._id,
      stt: (currentPage - 1) * pageSize + index + 1,
      jobName: job.name,
      jobPosition: job.field,
      expirationDate: job.deadline,
      applicationProfile: job.applicationNumber,
      status: job.status === 'active' ? 'Kích hoạt' : 'Không kích hoạt',
      banReason: job.banReason
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
          response = await RecService.getShowListJobs({ page: page, limit: size })
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listAcceptedJob))
            setTotalElement(response.data.metadata.totalElement)
          }
          break

        case '2':
          response = await RecService.getBannedJobs({ page: page, limit: size })
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listBannedJob))
            setTotalElement(response.data.metadata.totalElement)
          }
          break
        case '3':
          response = await RecService.getNearingExpirationJob({ page: page, limit: size })
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listNearingExpirationJob))
            setTotalElement(response.data.metadata.totalElement)
          }
          break
        case '4':
          response = await RecService.getExpiredJob({ page: page, limit: size })
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listExpiredJob))
            setTotalElement(response.data.metadata.totalElement)
          }
          break
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
    setCurrentPage(1)
    fetchDataForTab(key)
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      let response
      const searchParams = {
        name: searchValue,
        field: selectedActivity,
        levelRequirement: selectedType
      }

      switch (activeTabKey) {
        case '1':
          response = await RecService.getShowListJobs(searchParams)
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listAcceptedJob))
            setTotalElement(response.data.metadata.totalElement)
          }
          break
        case '2':
          response = await RecService.getBannedJobs(searchParams)
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listBannedJob))
            setTotalElement(response.data.metadata.totalElement)
          }
          break
        case '3':
          response = await RecService.getNearingExpirationJob(searchParams)
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listNearingExpirationJob))
            setTotalElement(response.data.metadata.totalElement)
          }
          break
        case '4':
          response = await RecService.getExpiredJob(searchParams)
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listExpiredJob))
            setTotalElement(response.data.metadata.totalElement)
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

    fetchDataByTab(activeTabKey, currentPage, pageSize)
  }

  const showModal = (job: DataType) => {
    setCurrentJob(job)
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    if (currentJob) {
      // Giả sử bạn có một dịch vụ để thay đổi trạng thái job
      try {
        await RecService.changeJobStatus(currentJob.key, currentJob.status === 'Kích hoạt' ? 'inactive' : 'active')
        fetchDataByTab(activeTabKey, currentPage, pageSize)
      } catch (error) {
        console.error('Failed to update job status:', error)
      } finally {
        setIsModalVisible(false)
        setCurrentJob(null)
      }
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setCurrentJob(null)
  }

  const showModalReason = (record: DataType) => {
    setCurrentJob(record)
    setIsModalReason(true)
  }

  const handleCancelReason = () => {
    setIsModalReason(false)
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
            <Modal
              title='Chuyển đổi trạng thái'
              open={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              okText='Xác nhận'
              cancelText='Hủy'
              cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
            >
              <p>{`Bạn có chắc chắn muốn ${currentJob?.status === 'Kích hoạt' ? 'Hủy kích hoạt' : 'Kích hoạt'} công việc này không?`}</p>
            </Modal>

            <Modal
              title='Lý do bị khóa'
              open={isModalReason}
              onCancel={handleCancelReason}
              footer={[
                <Button key='ok' type='primary' onClick={handleCancelReason}>
                  OK
                </Button>
              ]}
            >
              <p>{currentJob?.banReason}</p>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecListJobRecruitment
