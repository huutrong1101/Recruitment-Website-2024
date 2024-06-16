import React from 'react'

import { Button, Select, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface ActivityOption {
  value: string
  label: string
}

interface FilterPanelProps {
  selectedActivity: string | undefined
  setSelectedActivity: (value: string) => void
  selectedCompany: string | undefined
  setSelectedCompany: (value: string) => void
  selectedType: string | undefined
  setSelectedType: (value: string) => void
  searchValue: string
  setSearchValue: (value: string) => void
  handleResetFilters: () => void
  handleSearch: () => void
  companyOptions: ActivityOption[]
  optionsActivity: ActivityOption[]
  optionsTypes: ActivityOption[]
}

function FilterPanelComponent({
  selectedActivity,
  setSelectedActivity,
  selectedCompany,
  setSelectedCompany,
  selectedType,
  setSelectedType,
  searchValue,
  setSearchValue,
  handleResetFilters,
  handleSearch,
  companyOptions,
  optionsActivity,
  optionsTypes
}: FilterPanelProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  return (
    <div className='flex items-center justify-between w-full'>
      <div className='flex w-2/3 gap-3'>
        <Select
          showSearch
          style={{ width: 400 }}
          placeholder='Chọn công ty'
          optionFilterProp='children'
          filterOption={
            (input, option) =>
              option && option.children
                ? option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                : false // Chỉ gọi toString() khi option.children được định nghĩa
          }
          value={selectedCompany} // Bây giờ 'value' sẽ được controlled bằng 'selectedCompany'
          onChange={(value) => setSelectedCompany(value)} // Cập nhật state khi có sự thay đổi được chọn
        >
          {companyOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>

        <Select
          showSearch
          style={{ width: 200 }}
          placeholder='Chọn lĩnh vực'
          optionFilterProp='children'
          filterOption={
            (input, option) =>
              option && option.children
                ? option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                : false // Chỉ gọi toString() khi option.children được định nghĩa
          }
          filterSort={(optionA, optionB) =>
            (optionA.children?.toString() ?? '')
              .toLowerCase()
              .localeCompare((optionB.children?.toString() ?? '').toLowerCase())
          }
          value={selectedActivity}
          onChange={setSelectedActivity}
        >
          {optionsActivity.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>

        <Select
          showSearch
          style={{ width: 200 }}
          placeholder='Chọn loại hình công việc'
          optionFilterProp='children'
          filterOption={
            (input, option) =>
              option && option.children
                ? option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                : false // Chỉ gọi toString() khi option.children được định nghĩa
          }
          filterSort={(optionA, optionB) =>
            (optionA.children?.toString() ?? '')
              .toLowerCase()
              .localeCompare((optionB.children?.toString() ?? '').toLowerCase())
          }
          value={selectedType}
          onChange={setSelectedType}
        >
          {optionsTypes.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>

        <Input
          placeholder='Nội dung tìm kiếm'
          className='w-1/2'
          value={searchValue} // Giá trị liên kết với state
          onChange={handleInputChange}
        />
      </div>
      <div className='flex items-center gap-3'>
        <Button type='primary' onClick={handleSearch} icon={<SearchOutlined />}>
          Tìm kiếm
        </Button>
        <Button danger onClick={handleResetFilters} style={{ backgroundColor: 'transparent' }}>
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  )
}

export default FilterPanelComponent
