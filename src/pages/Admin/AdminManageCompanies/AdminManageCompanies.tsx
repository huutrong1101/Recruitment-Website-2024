import React, { useEffect, useState } from 'react'
import { Button, Select, Input, Tabs, Table, Tooltip } from 'antd'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { RecruiterResponseState } from '../../../types/user.type'
import { AdminService } from '../../../services/AdminService'
import { PlusCircleOutlined } from '@ant-design/icons'
import { JobService } from '../../../services/JobService'
import { ColumnType } from 'antd/es/table'
import { Cog6ToothIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'
import FilterPanelCompany from './FilterPanelCompany'
import CompanyTableComponent from './CompanyTableComponent'

const { TabPane } = Tabs

interface CompanyFromApi {
  _id: string
  name: string
  email: string
  contactEmail: string
  phone: string
  status: string
  verifyEmail: boolean
  position: string
  companyName: string
  fieldOfActivity: string[]
  companyAddress: string
  companyWebsite: string
  employeeNumber: number
  about: string
  companyCoverPhoto: string
  companyLogo: string
  acceptanceStatus: string
  premiumAccount: boolean
}

interface DataType {
  _id: string
  stt: number
  companyName: string
  field: string[]
  name: string
  premiumAccount: boolean
}

interface ActivityOption {
  value: string
  label: string
}

const mapTabKeyToStatus = {
  '1': 'accept',
  '2': 'waiting',
  '3': 'decline'
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
    title: 'TÊN NGƯỜI ĐẠI DIỆN',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'LĨNH VỰC',
    dataIndex: 'field',
    key: 'field',
    render: (fields) => fields.join(', ') // Thay đổi tại đây
  },
  {
    title: <Cog6ToothIcon className='w-6 h-6' />,
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => (
      <span>
        <Tooltip placement='topRight' title='Xem chi tiết'>
          <Link to={`/admin/manage_companies/${record._id}`}>
            <Button>
              <PencilSquareIcon className='w-4 h-4' />
            </Button>
          </Link>
        </Tooltip>
      </span>
    )
  }
]

function AdminManageCompanies() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const listRec = useAppSelector((state): RecruiterResponseState[] => state.AdminSlice.listRec)
  const activities = useAppSelector((state): string[] => state.Job.activities)

  const [selectedActivity, setSelectedActivity] = useState<string | undefined>(undefined)
  const [searchValue, setSearchValue] = useState('')
  const [activeTabKey, setActiveTabKey] = useState('1')
  const [activeData, setActiveData] = useState<DataType[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalElement, setTotalElement] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  console.log(activeData)

  useEffect(() => {
    JobService.getActivity(dispatch)
    JobService.getProvince(dispatch)
    AdminService.getListRec(dispatch)
  }, [dispatch])

  useEffect(() => {
    fetchDataByTab(activeTabKey, currentPage, pageSize)
  }, [activeTabKey, currentPage, pageSize])

  const optionsActivity: ActivityOption[] = activities.map((activity) => ({
    value: activity,
    label: activity
  }))

  const mapApiDataToTableData = (apiData: CompanyFromApi[]): DataType[] => {
    return apiData.map((company, index) => ({
      _id: company._id,
      stt: (currentPage - 1) * pageSize + index + 1,
      companyName: company.companyName,
      field: company.fieldOfActivity,
      name: company.name,
      premiumAccount: company.premiumAccount
    }))
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const acceptanceStatus = mapTabKeyToStatus[activeTabKey as keyof typeof mapTabKeyToStatus]

      const params = {
        searchText: searchValue,
        field: selectedActivity,
        acceptanceStatus
      }

      const response = await AdminService.getListCompany(params)

      if (response) {
        setActiveData(mapApiDataToTableData(response.data.metadata.listRecruiter))
      }
    } catch (error) {
      console.error('Error searching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetFilters = async () => {
    setSelectedActivity(undefined)
    setSearchValue('')

    const acceptanceStatus = mapTabKeyToStatus[activeTabKey as keyof typeof mapTabKeyToStatus]

    setIsLoading(true)
    try {
      // Gọi API với acceptanceStatus sau khi reset và các tham số khác ở giá trị ban đầu
      const response = await AdminService.getListCompany({ acceptanceStatus: acceptanceStatus })
      if (response) {
        setActiveData(mapApiDataToTableData(response.data.metadata.listRecruiter))
      }
    } catch (error) {
      console.error('Error searching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDataByTab = async (key: string, page: number, size: number) => {
    setIsLoading(true)
    try {
      let response
      switch (key) {
        case '1':
          response = await AdminService.getListCompany({ acceptanceStatus: 'accept', page: page, limit: size })
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listRecruiter))
            setTotalElement(response.data.metadata.totalElement)
          }
          break
        case '2':
          response = await AdminService.getListCompany({ acceptanceStatus: 'waiting', page: page, limit: size })
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listRecruiter))
            setTotalElement(response.data.metadata.totalElement)
          }
          break
        case '3':
          response = await AdminService.getListCompany({ acceptanceStatus: 'decline', page: page, limit: size })
          if (response && response.data) {
            setActiveData(mapApiDataToTableData(response.data.metadata.listRecruiter))
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
    setCurrentPage(1) // Reset lại trang đầu tiên mỗi khi thay đổi tab
    fetchDataForTab(key)
  }

  const handleNavigate = () => {
    navigate('/admin/manage_companies/addCompany')
  }

  console.log(activeData)

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='w-full'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='flex-1 text-2xl font-semibold text-center'>Quản lí danh sách công ty trong hệ thống</h1>
          <Button type='primary' icon={<PlusCircleOutlined />} onClick={handleNavigate}>
            Tạo công ty
          </Button>
        </div>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <FilterPanelCompany
              selectedActivity={selectedActivity}
              setSelectedActivity={setSelectedActivity}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              handleResetFilters={handleResetFilters}
              handleSearch={handleSearch}
              optionsActivity={optionsActivity}
            />
          </div>

          <CompanyTableComponent
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
  )
}

export default AdminManageCompanies
