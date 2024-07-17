import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { Form, Input, Button, DatePicker, Select, Radio } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { JobService } from '../../../services/JobService'
import moment from 'moment'
import { toast } from 'react-toastify'
import { RecService } from '../../../services/RecService'
import { Link, useNavigate } from 'react-router-dom'
import SelectFormItem from './SelectFormItem'

const { Option } = Select

interface FormData {
  name?: string
  location?: string
  province?: string
  type?: string
  levelRequirement?: string
  experience?: string
  salary?: string
  field?: string
  description?: string
  requirement?: string
  benefit?: string
  quantity?: string
  deadline?: string
  genderRequirement?: string
}

function RecAddJob() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { recruiter } = useAppSelector((app) => app.Auth)

  const [formData, setFormData] = useState<FormData>({})
  const [form] = Form.useForm()
  const [salaryType, setSalaryType] = useState('')
  const [salary, setSalary] = useState('')

  const provinces = useAppSelector((state) => state.Job.province)
  const experiences = useAppSelector((state) => state.Job.experience)
  const jobTypes = useAppSelector((state) => state.Job.type)
  const levelRequirement = useAppSelector((state) => state.Job.levelRequirement)
  const genderRequirement = useAppSelector((state) => state.Job.genderRequirement)
  const activities = useAppSelector((state) => state.Job.activities)

  useEffect(() => {
    JobService.getProvince(dispatch)
    JobService.getExperience(dispatch)
    JobService.getLevelRequirement(dispatch)
    JobService.getGenderRequirement(dispatch)
    JobService.getActivity(dispatch)
  }, [])

  useEffect(() => {
    form.setFieldsValue({ salary: salary })
  }, [salaryType, salary, form])

  // Hàm xử lý khi giá trị của Radio.Group thay đổi
  const handleSalaryTypeChange = (e: any) => {
    const newSalaryType = e.target.value
    setSalaryType(newSalaryType)

    let newSalaryValue = ''
    switch (newSalaryType) {
      case 'negotiable':
        newSalaryValue = 'Thỏa thuận'
        break
      case 'starting':
        newSalaryValue = form.getFieldValue('startingSalary') || ''
        break
      case 'range':
        // Xử lý cho trường hợp 'range' tại đây
        // ...
        break
      default:
        newSalaryValue = ''
    }

    setSalary(newSalaryValue)
    form.setFieldsValue({ salary: newSalaryValue })
  }

  const handleFormChange = (changedValues: any, allValues: any) => {
    setFormData({ ...formData, ...changedValues })
  }

  const validateQuantity = (_: any, value: any) => {
    if (value === 'o') {
      return Promise.resolve()
    }
    if (/^[1-9]\d*$/.test(value)) {
      return Promise.resolve()
    }
    return Promise.reject('Số lượng phải là số nguyên dương hoặc chữ o')
  }

  const onFinish = () => {
    let formValues = form.getFieldsValue(true)

    if (formValues.salaryRange) {
      delete formValues.salaryRange
    }

    if (formValues.startingSalary) {
      delete formValues.startingSalary
    }

    toast
      .promise(RecService.createJob(formValues), {
        pending: `Công việc của bạn đang được khởi tạo`,
        success: `Công việc đã được khởi tạo thành công.`
      })
      .then((response) => {
        navigate('/recruiter/profile/jobsPosted')
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  const validateSalary = (_: any, value: string) => {
    if (/^[1-9]\d*$/.test(value)) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('Mức lương khởi điểm phải là số nguyên dương'))
  }

  // Hàm định dạng lại giá trị tiền tệ
  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(value))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '')
    const numericValue = parseInt(rawValue, 10) || ''
    form.setFieldsValue({ startingSalary: numericValue })
    setSalary(numericValue.toString())
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '')
    const numericValue = parseInt(rawValue, 10) || ''
    const max = form.getFieldValue(['salaryRange', 'max']) || ''
    form.setFieldsValue({
      salaryRange: { min: numericValue },
      salary: `${numericValue}-${max}`
    })
    setSalary(`${numericValue}-${max}`)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '')
    const numericValue = parseInt(rawValue, 10) || ''
    const min = form.getFieldValue(['salaryRange', 'min']) || ''
    form.setFieldsValue({
      salaryRange: { max: numericValue },
      salary: `${min}-${numericValue}`
    })
    setSalary(`${min}-${numericValue}`)
  }

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='w-full p-4 border rounded-xl border-zinc-100'>
        <div className='mb-2'>
          <h1 className='flex-1 text-2xl font-semibold md:mb-4'>Đăng tin tuyển dụng</h1>
          <p className='flex items-center gap-2'>
            <ExclamationCircleIcon className='w-4 h-4' />
            {recruiter && (
              <p>
                Lưu ý: Bạn đã đăng tuyển{' '}
                <span className='font-semibold text-emerald-500'>
                  {recruiter.postCount}/{recruiter.limitPost}
                </span>{' '}
                số lượng công việc cho phép trong tháng này. Hãy{' '}
                <Link to='/recruiter/profile/service' className='font-semibold text-emerald-500'>
                  nâng cấp tài khoản
                </Link>{' '}
                để có thể tăng số lượng công việc có thể đăng tuyển nhé!
              </p>
            )}
          </p>
        </div>
        <div className='flex-col gap-6 marker:flex md:flex-row'>
          <Form
            name='recAddJob'
            form={form}
            onFinish={onFinish}
            onValuesChange={handleFormChange}
            labelCol={{ span: 24 }}
          >
            <div className='flex items-center justify-center gap-2'>
              <Form.Item
                name='name'
                label='Tên công việc'
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên công việc!'
                  }
                ]}
                className='w-1/2'
              >
                <Input />
              </Form.Item>

              <SelectFormItem
                name='experience'
                label='Kinh nghiệm'
                requiredMessage='Vui lòng chọn yêu cầu kinh nghiệm!'
                options={experiences}
              />
            </div>
            <div className='flex items-center justify-center gap-2'>
              <SelectFormItem
                name='levelRequirement'
                label='Vị trí công việc'
                requiredMessage='Vui lòng chọn vị trí công việc!'
                options={levelRequirement}
              />

              <SelectFormItem
                name='type'
                label='Loại hình công việc'
                requiredMessage='Vui lòng chọn loại hình công việc!'
                options={jobTypes}
              />
            </div>
            <div className='flex items-center justify-center gap-2'>
              <SelectFormItem
                name='field'
                label='Lĩnh vực'
                requiredMessage='Vui lòng chọn lĩnh vực!'
                options={activities}
              />

              <SelectFormItem
                name='genderRequirement'
                label='Yêu cầu giới tính'
                requiredMessage='Vui lòng chọn giới tính!'
                options={genderRequirement}
              />
            </div>
            <div className='flex items-center justify-center gap-2'>
              <SelectFormItem
                name='province'
                label='Tỉnh thành'
                requiredMessage='Vui lòng chọn tỉnh thành!'
                options={provinces}
              />

              <Form.Item
                name='deadline'
                label='Hạn nộp hồ sơ'
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn hạn nộp hồ sơ'
                  }
                ]}
                className='w-1/2'
              >
                <DatePicker
                  className='w-full'
                  placeholder='Hạn nộp hồ sơ'
                  format='DD-MM-YYYY'
                  disabledDate={(current) => {
                    return current && current < moment().endOf('day')
                  }}
                />
              </Form.Item>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <Form.Item
                name='location'
                label='Địa chỉ'
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập địa chỉ'
                  }
                ]}
                className='w-1/2'
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='quantity'
                label='Số lượng tuyển (o- Không giới hạn)'
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số lượng'
                  },
                  {
                    validator: validateQuantity
                  }
                ]}
                className='w-1/2'
              >
                <Input />
              </Form.Item>
            </div>

            <Form.Item
              label='Mức lương'
              // Bỏ prop `name`, vì chúng ta sẽ quản lý state này thông qua local state thay vì Form.Item
              required
              rules={[{ required: true, message: 'Vui lòng chọn một lựa chọn mức lương!' }]}
            >
              <Radio.Group value={salaryType} onChange={handleSalaryTypeChange}>
                <Radio value='negotiable'>Thỏa thuận</Radio>
                <Radio value='starting'>Lương khởi điểm</Radio>
                <Radio value='range'>Khung lương</Radio>
              </Radio.Group>
            </Form.Item>

            {salaryType === 'starting' && (
              <Form.Item
                name='startingSalary'
                label='Mức lương khởi điểm'
                rules={[
                  { required: true, message: 'Vui lòng nhập mức lương khởi điểm' },
                  { validator: validateSalary }
                ]}
              >
                <Input value={salary} onChange={handleChange} addonAfter='VND' placeholder='Nhập mức lương khởi điểm' />
                {salary && <div className='mt-1 text-green-600'>{formatCurrency(salary)}</div>}
              </Form.Item>
            )}

            {salaryType === 'range' && (
              <Form.Item name='salaryRange' label='Mức lương'>
                <Input.Group compact>
                  <Form.Item
                    name={['salaryRange', 'min']}
                    noStyle
                    rules={[{ required: true, message: 'Mức lương tối thiểu!' }, { validator: validateSalary }]}
                  >
                    <Input style={{ width: '50%' }} placeholder='Min' onChange={handleMinChange} />
                  </Form.Item>
                  <Form.Item
                    name={['salaryRange', 'max']}
                    noStyle
                    rules={[{ required: true, message: 'Mức lương tối đa!' }, { validator: validateSalary }]}
                  >
                    <Input style={{ width: '50%' }} placeholder='Max' onChange={handleMaxChange} />
                  </Form.Item>
                </Input.Group>
                <div className='mt-1 text-green-600'>
                  {formatCurrency(form.getFieldValue(['salaryRange', 'min']) || 0)} -{' '}
                  {formatCurrency(form.getFieldValue(['salaryRange', 'max']) || 0)}
                </div>
              </Form.Item>
            )}

            <Form.Item
              name='description'
              label='Mô tả công việc'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mô tả công việc'
                }
              ]}
            >
              <div style={{ minHeight: '200px', maxHeight: '600px' }}>
                <CKEditor
                  editor={ClassicEditor}
                  data={form.getFieldValue('about') || ''}
                  onChange={(_: any, editor: any) => {
                    const data = editor.getData()
                    form.setFieldsValue({ description: data })
                  }}
                />
              </div>
            </Form.Item>
            <Form.Item
              name='requirement'
              label='Yêu cầu công việc'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập yêu cầu công việc'
                }
              ]}
            >
              <div style={{ minHeight: '200px', maxHeight: '600px' }}>
                <CKEditor
                  editor={ClassicEditor}
                  data={form.getFieldValue('about') || ''}
                  onChange={(_: any, editor: any) => {
                    const data = editor.getData()
                    form.setFieldsValue({ requirement: data })
                  }}
                />
              </div>
            </Form.Item>
            <Form.Item
              name='benefit'
              label='Phúc lợi'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập phúc lợi công việc'
                }
              ]}
            >
              <div style={{ minHeight: '200px', maxHeight: '600px' }}>
                <CKEditor
                  editor={ClassicEditor}
                  data={form.getFieldValue('about') || ''}
                  onChange={(_: any, editor: any) => {
                    const data = editor.getData()
                    form.setFieldsValue({ benefit: data })
                  }}
                />
              </div>
            </Form.Item>
            <Form.Item className='flex justify-end'>
              <Button type='primary' htmlType='submit'>
                Đăng tin
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default RecAddJob
