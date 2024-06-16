import { Pagination, Spin } from 'antd'
import React from 'react'
import FilterListResume from './FilterListResume'
import { ResumeResponse } from '../../../types/resume.type'
import RecResumeCard from './RecResumeCard'

interface ActivityOption {
  value: string
  label: string
}

interface RecFindResumeProps {
  listResume: ResumeResponse[]
  currentPage: number
  pageSize: number
  totalElement: number
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  fetchDataByTab: (activeKey: string, currentPage: number, pageSize: number) => void
  activeTabKey: string

  loading: boolean
  searchText: string | undefined
  setSearchText: (value: string) => void
  title: string | undefined
  setTitle: (value: string) => void
  english: string | undefined
  setEnglish: (value: string | undefined) => void
  jobType: string | undefined
  setJobType: (value: string | undefined) => void
  experience: string | undefined
  setExperience: (value: string | undefined) => void
  educationLevel: string | undefined
  setEducationLevel: (value: string | undefined) => void
  major: string | undefined
  setMajor: (value: string | undefined) => void
  homeTown: string | undefined
  setHomeTown: (value: string | undefined) => void

  handleSearch: () => void
  handleResetFilters: () => void
  optionsProvinces: ActivityOption[]
  optionsMajors: ActivityOption[]
  optionsEnglish: ActivityOption[]
  isAdvancedSearchModalVisible: boolean
  toggleAdvancedSearchModal: () => void
}

function RecFindResume({
  listResume,
  currentPage,
  pageSize,
  totalElement,
  setCurrentPage,
  setPageSize,
  fetchDataByTab,
  activeTabKey,
  loading,
  searchText,
  setSearchText,
  title,
  setTitle,
  english,
  setEnglish,
  experience,
  setExperience,
  educationLevel,
  setEducationLevel,
  jobType,
  setJobType,
  major,
  setMajor,
  homeTown,
  setHomeTown,
  handleSearch,
  handleResetFilters,
  optionsMajors,
  optionsProvinces,
  optionsEnglish,
  isAdvancedSearchModalVisible,
  toggleAdvancedSearchModal
}: RecFindResumeProps) {
  const handlePageChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize
    setCurrentPage(page)
    setPageSize(newPageSize)
    fetchDataByTab(activeTabKey, page, newPageSize)
  }
  return (
    <>
      <div className='mt-2'>
        <FilterListResume
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
          isShow={false}
        />
      </div>

      {loading ? (
        <div className='flex justify-center my-4'>
          <Spin size='large' />
        </div>
      ) : (
        <>
          {listResume && listResume.length > 0 ? (
            <div className='flex flex-col gap-3 mt-4'>
              {listResume.map((resume, index) => (
                <RecResumeCard key={index} resume={resume} />
              ))}
            </div>
          ) : (
            <div className='flex items-center justify-center p-4'>
              <p className='text-lg text-gray-500'>Không tìm thấy hồ sơ ứng tuyển phù hợp.</p>
            </div>
          )}
          <div className='flex justify-end w-full p-2 my-2'>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalElement}
              onChange={handlePageChange}
              showSizeChanger
              onShowSizeChange={handlePageChange}
              pageSizeOptions={['5', '10', '20', '30', '50']}
              locale={{ items_per_page: ' / trang' }}
            />
          </div>
        </>
      )}
    </>
  )
}

export default RecFindResume
