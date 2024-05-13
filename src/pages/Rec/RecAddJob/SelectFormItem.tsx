import { Form, Select } from 'antd'
import React from 'react'

const { Option } = Select

interface SelectFormItemProps {
  name: string
  label: string
  requiredMessage: string
  options: string[]
  className?: string
}

function SelectFormItem({ name, label, requiredMessage, options, className = 'w-1/2' }: SelectFormItemProps) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true, message: requiredMessage }]} className={className}>
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder={`Chọn ${label.toLowerCase()}`}
        optionFilterProp='children'
        filterOption={(input, option) =>
          option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false
        }
      >
        {options.map((option) => (
          <Option value={option} key={option}>
            {option}
          </Option>
        ))}
      </Select>
    </Form.Item>
  )
}

export default SelectFormItem
