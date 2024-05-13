import React from 'react'
import { Button, Form, Input, Select } from 'antd'
import { FormInstance } from 'antd/lib/form'
import Container from '../../components/Container/Container'

interface Step1FormProps {
  form: FormInstance
  onFormChange: (changedValues: any, allValues: any) => void
  nextStep: () => void
  onFieldOfActivityChange?: (value: string[], option: any) => void // Prop mới này (nếu cần)
  activities: string[]
}

function Step1Form({ form, onFormChange, nextStep, onFieldOfActivityChange, activities }: Step1FormProps) {
  return (
    <Container>
      <div className='w-full'>
        <Form.Item
          name='companyName'
          label='Tên công ty'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên công ty!'
            }
          ]}
          className='w-full'
        >
          <Input />
        </Form.Item>
      </div>
      <div className='flex items-center justify-center gap-2'>
        <Form.Item
          name='companyAddress'
          label='Địa chỉ'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập địa chỉ của công ty!'
            }
          ]}
          className='w-1/2'
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='employeeNumber'
          label='Số lượng nhân viên'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số lượng thành viên của công ty!'
            }
          ]}
          className='w-1/2'
        >
          <Input />
        </Form.Item>
      </div>
      <div className='flex items-center justify-center gap-2'>
        <Form.Item
          name='companyWebsite'
          label='Website'
          rules={[
            {
              type: 'url',
              warningOnly: true, // chỉ hiển thị cảnh báo nếu bạn muốn
              message: 'URL không hợp lệ!'
            },
            {
              required: true,
              message: 'Vui lòng nhập website công ty!'
            }
          ]}
          className='w-1/2'
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='fieldOfActivity'
          label='Lĩnh vực hoạt động'
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất một lĩnh vực hoạt động!', type: 'array' }]}
          className='w-1/2'
        >
          <Select
            mode='multiple'
            showSearch
            style={{ width: '100%' }}
            placeholder='Chọn lĩnh vực hoạt động'
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
            onChange={(values, optionList) => onFieldOfActivityChange?.(values, optionList)} // Thay đổi đoạn này
          >
            {activities.map((activity, index) => (
              <Select.Option key={index} value={activity}>
                {activity}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </div>
      <div className='flex items-center justify-center gap-2'>
        <Form.Item
          name='slug'
          label='Slug'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập giá trị slug!'
            }
          ]}
          className='w-1/2'
        >
          <Input placeholder='/cong-ty-FPT' />
        </Form.Item>

        <Form.Item
          label='Email đăng nhập'
          name='emailLogin'
          rules={[
            {
              type: 'email',
              message: 'Email không hợp lệ!'
            },
            {
              required: true,
              message: 'Vui lòng nhập email đăng nhập!'
            }
          ]}
          className='w-1/2'
        >
          <Input readOnly disabled={true} />
        </Form.Item>
      </div>
      <div className='flex flex-col w-1/2 mt-0'>
        <p>Giá trị slug giúp xác định duy nhất trang công ty trên website.</p>
        <p> Ví dụ: http://localhost:5173/recruiters/cong-ty-FPT</p>
      </div>

      <Form.Item className='flex justify-end'>
        <Button type='primary' onClick={nextStep}>
          Tiếp theo
        </Button>
      </Form.Item>
    </Container>
  )
}

export default Step1Form
