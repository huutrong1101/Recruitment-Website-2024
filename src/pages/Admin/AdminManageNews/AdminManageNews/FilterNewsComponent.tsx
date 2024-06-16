import { Button, Input, Select } from 'antd'
import React from 'react'
import { SearchOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons'

interface ActivityOption {
  value: string
  label: string
}

interface FilterNewsProps {
  optionTypeNews: ActivityOption[]
  searchValue: string
  setSearchValue: (value: string) => void
  selectedType: string | undefined
  setSelectedType: (value: string) => void
  handleResetFilters: () => void
  handleSearch: () => void
}

function FilterNewsComponent({
  optionTypeNews,
  searchValue,
  setSearchValue,
  selectedType,
  setSelectedType,
  handleSearch,
  handleResetFilters
}: FilterNewsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }
  return (
    <div className='flex items-center justify-between w-full'>
      <div className='flex w-full gap-3'>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder='Loại bài viết'
          optionFilterProp='label'
          filterOption={(input, option) => (option ? option.label.toLowerCase().includes(input.toLowerCase()) : false)}
          options={optionTypeNews}
          value={selectedType}
          onChange={(value) => setSelectedType(value)}
        />
        <Input
          placeholder='Nhập tên bài viết'
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

export default FilterNewsComponent
