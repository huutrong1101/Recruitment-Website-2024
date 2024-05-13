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
  selectedType: string | undefined
  setSelectedType: (value: string) => void
  searchValue: string
  setSearchValue: (value: string) => void
  handleResetFilters: () => void
  handleSearch: () => void
  optionsActivity: ActivityOption[]
  optionsLevels: ActivityOption[]
}

function FilterPanelComponent({
  selectedActivity,
  setSelectedActivity,
  selectedType,
  setSelectedType,
  searchValue,
  setSearchValue,
  handleResetFilters,
  handleSearch,
  optionsActivity,
  optionsLevels
}: FilterPanelProps) {
  const handleInputChange = (e: any) => {
    setSearchValue(e.target.value)
  }

  return (
    <div className='flex items-center justify-between w-full'>
      <div className='flex w-2/3 gap-3'>
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
          placeholder='Chọn vị trí công việc'
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
          {optionsLevels.map((option) => (
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
