import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined, FileExcelOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Pagination, Spin } from 'antd'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { RecService } from '../../../services/RecService'
import FilterListResume from './FilterListResume'
import RecResumeCard from './RecResumeCard'
import { Tabs } from 'antd'
import RecListFavoriteResume from './RecListFavoriteResume'
import RecFindResume from './RecFindResume'
import { ResumeResponse } from '../../../types/resume.type'
const { TabPane } = Tabs

function RecFindCandidate() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [searchText, setSearchText] = useState('')
  const [title, setTitle] = useState('')
  const [english, setEnglish] = useState<string | undefined>(undefined)
  const [experience, setExperience] = useState<string | undefined>(undefined)
  const [educationLevel, setEducationLevel] = useState<string | undefined>(undefined)
  const [jobType, setJobType] = useState<string | undefined>(undefined)
  const [major, setMajor] = useState<string | undefined>(undefined)
  const [homeTown, setHomeTown] = useState<string | undefined>(undefined)

  const [activeTabKey, setActiveTabKey] = useState('1')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalElement, setTotalElement] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isAdvancedSearchModalVisible, setIsAdvancedSearchModalVisible] = useState(false)
  const [listResume, setListResume] = useState<ResumeResponse[]>([])

  const provinces = useAppSelector((state) => state.Job.province)
  const listEnglish = useAppSelector((state) => state.Job.english)
  const majors = useAppSelector((state) => state.Job.majors)
  const optionsMajors = majors.map((option) => ({ value: option, label: option }))
  const optionsProvinces = provinces.map((option) => ({ value: option, label: option }))
  const optionsEnglish = listEnglish.map((option) => ({ value: option, label: option }))

  useEffect(() => {
    RecService.getListResumeStatus(dispatch)
    RecService.getEnglish(dispatch)
  }, [])

  useEffect(() => {
    fetchDataByTab(activeTabKey, currentPage, pageSize)
  }, [activeTabKey, currentPage, pageSize])

  const fetchDataByTab = async (key: string, page: number, size: number) => {
    setLoading(true)
    try {
      let response
      switch (key) {
        case '1':
          response = await RecService.getListAdvancedResume({ page: page, limit: size })
          if (response && response.data) {
            const data = response.data.metadata.listResume
            const total = response.data.metadata.totalElement
            setListResume(data)
            setTotalElement(total)
          }
          break
        case '2':
          response = await RecService.getListFavoriteResume({ page: page, limit: size })
          if (response && response.data) {
            const data = response.data.metadata.listFavoriteResume
            const total = response.data.metadata.totalElement
            setListResume(data)
            setTotalElement(total)
          }
          break
        default:
          break
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
      setListResume([])
    } finally {
      setLoading(false) // Hoàn thành tải dữ liệu, set loading là false
    }
  }

  const toggleAdvancedSearchModal = () => {
    setIsAdvancedSearchModalVisible(!isAdvancedSearchModalVisible)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      let response
      const searchParams = {
        searchText,
        title,
        educationLevel: educationLevel,
        english: english,
        jobType: jobType,
        experience: experience,
        major: major,
        homeTown: homeTown
      }

      setIsAdvancedSearchModalVisible(false)

      switch (activeTabKey) {
        case '1':
          response = await RecService.getListAdvancedResume(searchParams)
          if (response && response.data) {
            const data = response.data.metadata.listResume
            const total = response.data.metadata.totalElement
            setListResume(data)
            setTotalElement(total)
          }
          break
        case '2':
          response = await RecService.getListFavoriteResume(searchParams)
          if (response && response.data) {
            const data = response.data.metadata.listFavoriteResume
            const total = response.data.metadata.totalElement
            setListResume(data)
            setTotalElement(total)
          }
          break

        default:
          break
      }
    } catch (error) {
      console.error('An error occurred while searching:', error)
    } finally {
      setLoading(false) // Kết thúc quá trình tải dữ liệu
    }
  }

  const handleResetFilters = () => {
    setSearchText('')
    setTitle('')
    setEnglish(undefined)
    setExperience(undefined)
    setMajor(undefined)
    setJobType(undefined)
    setHomeTown(undefined)
    setEducationLevel(undefined)

    fetchDataByTab(activeTabKey, currentPage, pageSize)
  }

  const fetchDataForTab = (key: string) => {
    setActiveTabKey(key)
    setCurrentPage(1)
    fetchDataByTab(key, 1, pageSize)
  }

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='w-full border rounded-xl border-zinc-100'>
        <div className='flex items-center justify-center gap-5 p-2 rounded-tl-lg bg-slate-200 rounded-tr-xl'>
          <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer' }} className='font-bold' />
          <h6 className='flex-1 text-lg font-semibold uppercase'>TÌM KIẾM ỨNG VIÊN</h6>
        </div>
        <Tabs defaultActiveKey='1' className='p-2' onChange={(activeKey) => fetchDataForTab(activeKey)}>
          <TabPane tab='Tìm kiếm' key='1'>
            <RecFindResume
              listResume={listResume}
              fetchDataByTab={fetchDataByTab}
              currentPage={currentPage}
              pageSize={pageSize}
              totalElement={totalElement}
              activeTabKey={activeTabKey}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
              loading={loading}
              searchText={searchText}
              setSearchText={setSearchText}
              title={title}
              setTitle={setTitle}
              english={english}
              setEnglish={setEnglish}
              experience={experience}
              setExperience={setExperience}
              educationLevel={educationLevel}
              setEducationLevel={setEducationLevel}
              major={major}
              setMajor={setMajor}
              jobType={jobType}
              setJobType={setJobType}
              homeTown={homeTown}
              setHomeTown={setHomeTown}
              handleSearch={handleSearch}
              handleResetFilters={handleResetFilters}
              optionsMajors={optionsMajors}
              optionsProvinces={optionsProvinces}
              optionsEnglish={optionsEnglish}
              isAdvancedSearchModalVisible={isAdvancedSearchModalVisible}
              toggleAdvancedSearchModal={toggleAdvancedSearchModal}
            />
          </TabPane>
          <TabPane tab='Danh sách yêu thích' key='2'>
            <RecListFavoriteResume
              listResume={listResume}
              setListResume={setListResume}
              fetchDataByTab={fetchDataByTab}
              currentPage={currentPage}
              pageSize={pageSize}
              totalElement={totalElement}
              activeTabKey={activeTabKey}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
              loading={loading}
              searchText={searchText}
              setSearchText={setSearchText}
              title={title}
              setTitle={setTitle}
              english={english}
              setEnglish={setEnglish}
              experience={experience}
              setExperience={setExperience}
              educationLevel={educationLevel}
              setEducationLevel={setEducationLevel}
              major={major}
              setMajor={setMajor}
              jobType={jobType}
              setJobType={setJobType}
              homeTown={homeTown}
              setHomeTown={setHomeTown}
              handleSearch={handleSearch}
              handleResetFilters={handleResetFilters}
              optionsMajors={optionsMajors}
              optionsProvinces={optionsProvinces}
              optionsEnglish={optionsEnglish}
              isAdvancedSearchModalVisible={isAdvancedSearchModalVisible}
              toggleAdvancedSearchModal={toggleAdvancedSearchModal}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default RecFindCandidate
