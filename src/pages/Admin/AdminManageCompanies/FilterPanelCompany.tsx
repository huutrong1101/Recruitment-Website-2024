import { Button, Select, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface ActivityOption {
  value: string
  label: string
}

interface FilterPanelProps {
  selectedActivity: string | undefined
  setSelectedActivity: (value: string) => void
  searchValue: string
  setSearchValue: (value: string) => void
  handleResetFilters: () => void
  handleSearch: () => void
  optionsActivity: ActivityOption[]
}

function FilterPanelCompany({
  selectedActivity,
  setSelectedActivity,
  searchValue,
  setSearchValue,
  handleResetFilters,
  handleSearch,
  optionsActivity
}: FilterPanelProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className='flex items-center justify-between w-full'>
      <div className='flex w-full gap-3'>
        <Select
          showSearch
          style={{ width: 300 }}
          placeholder='Chọn lĩnh vực'
          optionFilterProp='children'
          filterOption={
            (input, option) =>
              option && option.children
                ? option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                : false // Chỉ gọi toString() khi option.children được định nghĩa
          }
          value={selectedActivity} // Bây giờ 'value' sẽ được controlled bằng 'selectedCompany'
          onChange={(value) => setSelectedActivity(value)} // Cập nhật state khi có sự thay đổi được chọn
        >
          {optionsActivity.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>

        <Input
          placeholder='Nhập tên công ty'
          className='w-1/2'
          value={searchValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>
      <div className='flex items-center gap-3'>
        <Button type='primary' icon={<SearchOutlined />} onClick={handleSearch}>
          Tìm kiếm
        </Button>
        <Button danger style={{ backgroundColor: 'transparent' }} onClick={handleResetFilters}>
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  )
}

export default FilterPanelCompany
