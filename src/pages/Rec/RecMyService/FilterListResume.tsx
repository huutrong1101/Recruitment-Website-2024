import React, { useState } from 'react'
import { Button, Input, Select, AutoComplete, Modal, Tag, Menu, Dropdown } from 'antd'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { SearchOutlined, SettingOutlined, FileExcelOutlined, DeleteOutlined, FilePdfOutlined } from '@ant-design/icons'
import { educationLevels, experiences, jobTypes } from '../../../utils/contanst'

const { Option } = Select

interface ActivityOption {
  value: string
  label: string
}

interface SelectedFilters {
  educationLevel?: string
  experience?: string
  major?: string
  homeTown?: string
  english?: string
  jobType?: string
}

interface FilterPanelProps {
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
  isShow: boolean

  deleteAllFavorite?: () => void
  showModalDeleteAll?: () => void
  handleCancelDelete?: () => void
  exportToExcel?: () => void
  exportToPDF?: () => void
  isModalDeleteAllVisible?: boolean
}

function FilterListResume({
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
  toggleAdvancedSearchModal,
  isShow,
  deleteAllFavorite,
  showModalDeleteAll,
  handleCancelDelete,
  isModalDeleteAllVisible,
  exportToExcel,
  exportToPDF
}: FilterPanelProps) {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({})

  function countFilledInput() {
    const inputs = [experience, educationLevel, jobType, major, homeTown]
    return inputs.filter((input) => input && input.trim().length > 0).length
  }

  const handleFilterChange = (field: keyof FilterPanelProps, value: string) => {
    switch (field) {
      case 'educationLevel':
        setEducationLevel(value)
        break
      case 'experience':
        setExperience(value)
        break
      case 'major':
        setMajor(value)
        break
      case 'homeTown':
        setHomeTown(value)
        break
      case 'english':
        setEnglish(value)
        break
      case 'jobType':
        setJobType(value)
        break
    }

    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value
    }))
  }

  const handleRemoveFilter = (field: keyof SelectedFilters) => {
    if (field in selectedFilters) {
      const newFilters: Partial<SelectedFilters> = { ...selectedFilters }
      delete newFilters[field]
      setSelectedFilters(newFilters)

      // Đặt lại giá trị cho từng trường select tương ứng
      switch (field) {
        case 'educationLevel':
          setEducationLevel(undefined)
          break
        case 'experience':
          setExperience(undefined)
          break
        case 'major':
          setMajor(undefined)
          break
        case 'homeTown':
          setHomeTown(undefined)
          break
        case 'english':
          setEnglish(undefined)
          break
        case 'jobType':
          setJobType(undefined)
          break
      }
    }
  }

  const handleClearAllFilters = () => {
    setTitle('')
    setEducationLevel(undefined)
    setExperience(undefined)
    setMajor(undefined)
    setHomeTown(undefined)
    setEnglish(undefined)
    setJobType(undefined)

    setSelectedFilters({})
  }

  const handleResetFiltersAndTag = () => {
    handleResetFilters()
    handleClearAllFilters()
  }

  const menu = (
    <Menu>
      <Menu.Item key='1' icon={<FileExcelOutlined />} onClick={exportToExcel}>
        Xuất file Excel
      </Menu.Item>
      <Menu.Item key='2' icon={<FilePdfOutlined />} onClick={exportToPDF}>
        Xuất file PDF
      </Menu.Item>
      <Menu.Item key='3' icon={<DeleteOutlined />} onClick={showModalDeleteAll}>
        Xóa tất cả
      </Menu.Item>
    </Menu>
  )

  const settingButton = (
    <Dropdown overlay={menu}>
      <Button type='primary' className='flex items-center justify-center'>
        <SettingOutlined />
      </Button>
    </Dropdown>
  )

  return (
    <>
      <form>
        <div className='flex flex-col items-center w-full gap-4'>
          <div className='flex items-center w-full gap-2 '>
            <Input
              placeholder='Tiêu đề hồ sơ'
              prefix={<UserCircleIcon />}
              className='w-full'
              type='text'
              style={{ width: '100%' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className='flex items-center justify-end w-full gap-2'>
              <Button type='primary' icon={<SearchOutlined />} onClick={toggleAdvancedSearchModal}>
                Tìm kiếm nâng cao ({countFilledInput()})
              </Button>
              <Button type='primary' icon={<SearchOutlined />} onClick={handleSearch}>
                Tìm kiếm
              </Button>
              <Button danger style={{ backgroundColor: 'transparent' }} onClick={handleResetFiltersAndTag}>
                Xóa bộ lọc
              </Button>
              {isShow && settingButton}
            </div>
          </div>
        </div>

        <Modal
          title='Xác nhận xóa'
          open={isModalDeleteAllVisible}
          onOk={deleteAllFavorite}
          onCancel={handleCancelDelete}
          okText='Có'
          cancelText='Hủy'
          cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
          width={450}
        >
          <div className='flex flex-col gap-1'>
            <p>Bạn có muốn xóa tất cả hồ sơ ra khỏi danh sách yêu thích ?</p>
            <p className='text-red-500'>Lưu ý: Thao tác này sẽ không thể hoàn tác</p>
          </div>
        </Modal>

        <Modal
          title='Tìm kiếm nâng cao'
          open={isAdvancedSearchModalVisible}
          onOk={handleSearch}
          onCancel={toggleAdvancedSearchModal}
          okText='Tìm kiếm'
          cancelText='Hủy'
          cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
          width={900}
        >
          <>
            <div>
              {selectedFilters && (
                <div className='flex items-center gap-2'>
                  <Button type='primary' onClick={handleClearAllFilters}>
                    Xóa tất cả bộ lọc
                  </Button>
                  {Object.entries(selectedFilters).map(([field, value]) => (
                    <Tag closable key={field} onClose={() => handleRemoveFilter(field as keyof SelectedFilters)}>
                      {`${value}`}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
            <div className={classNames('flex gap-4 mt-4')}>
              <div className={classNames('w-1/3')}>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder='Kinh nghiệm làm việc'
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    (option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
                  }
                  value={experience}
                  onChange={(value: string) => handleFilterChange('experience', value)}
                >
                  {experiences.map((experience) => (
                    <Option key={experience.id} value={experience.name}>
                      {experience.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className={classNames('w-1/3')}>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder='Ngành học'
                  filterOption={(input, option) =>
                    option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
                  }
                  options={optionsMajors}
                  value={major}
                  onChange={(value: string) => handleFilterChange('major', value)}
                />
              </div>
              <div className={classNames('w-1/3')}>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder='Học vấn'
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    (option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
                  }
                  value={educationLevel}
                  onChange={(value: string) => handleFilterChange('educationLevel', value)}
                >
                  {educationLevels.map((level) => (
                    <Option key={level.id} value={level.name}>
                      {level.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className={classNames('flex gap-4 mt-4')}>
              <div className={classNames('w-1/3')}>
                <Select
                  placeholder='Loại hình công việc'
                  style={{ width: '100%' }}
                  optionFilterProp='children'
                  filterOption={(input, option) =>
                    (option?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) ?? -1) >= 0
                  }
                  value={jobType}
                  onChange={(value: string) => handleFilterChange('jobType', value)}
                >
                  {jobTypes.map((level) => (
                    <Option key={level.id} value={level.name}>
                      {level.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className={classNames('w-1/3')}>
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder='Tỉnh/Thành phố'
                  filterOption={(input, option) =>
                    option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
                  }
                  options={optionsProvinces}
                  value={homeTown}
                  onChange={(value: string) => handleFilterChange('homeTown', value)}
                />
              </div>
              <div className={classNames('w-1/3')}>
                <AutoComplete
                  options={optionsEnglish}
                  placeholder='Trình độ ngoại ngữ'
                  value={english}
                  onChange={(value) => setEnglish(value)} // chỉ cần truyền 'value' thẳng vào 'setEnglish'
                  style={{ width: '100%', textAlign: 'left' }}
                  filterOption={(inputValue, option) =>
                    !!option && option.label.toUpperCase().includes(inputValue.toUpperCase())
                  }
                />
              </div>
            </div>
          </>
        </Modal>
      </form>
    </>
  )
}

export default FilterListResume
