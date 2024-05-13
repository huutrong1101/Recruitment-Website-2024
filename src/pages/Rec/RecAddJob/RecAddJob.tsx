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
import { useNavigate } from 'react-router-dom'
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

  const onFinish = () => {
    const formValues = form.getFieldsValue(true)

    console.log(formValues)

    toast
      .promise(RecService.createJob(formValues), {
        pending: `Công việc của bạn đang được khởi tạo`,
        success: `Công việc đã được khởi tạo thành công. Hãy chờ đợi để admin xét duyệt`
      })
      .then((response) => {
        navigate('/recruiter/profile/jobsPosted')
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
  }

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='w-full p-4 border rounded-xl border-zinc-100'>
        <div className='mb-2'>
          <h1 className='flex-1 text-2xl font-semibold md:mb-4'>Đăng tin tuyển dụng</h1>
          <p className='flex items-center gap-2'>
            <ExclamationCircleIcon className='w-4 h-4' /> Lưu ý: Sau khi thêm mới việc làm thành công, việc làm sẽ
            chuyển sang trạng thái chờ duyệt
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
                rules={[{ required: true, message: 'Vui lòng nhập mức lương khởi điểm' }]}
              >
                <Input
                  onChange={(e) => {
                    form.setFieldsValue({ salary: e.target.value })
                    setSalary(e.target.value)
                  }}
                />
              </Form.Item>
            )}

            {salaryType === 'range' && (
              <Form.Item name='salaryRange' label='Mức lương'>
                <Input.Group compact>
                  <Form.Item
                    name={['salaryRange', 'min']}
                    noStyle
                    rules={[{ required: true, message: 'Mức lương tối thiểu!' }]}
                  >
                    <Input
                      style={{ width: '50%' }}
                      placeholder='Min'
                      onChange={(e) => {
                        // Cập nhật giá trị min vào salary
                        const max = form.getFieldValue(['salaryRange', 'max']) || ''
                        form.setFieldsValue({ salary: `${e.target.value}-${max}` })
                        setSalary(`${e.target.value}-${max}`)
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name={['salaryRange', 'max']}
                    noStyle
                    rules={[{ required: true, message: 'Mức lương tối đa!' }]}
                  >
                    <Input
                      style={{ width: '50%' }}
                      placeholder='Max'
                      onChange={(e) => {
                        // Cập nhật giá trị max vào salary
                        const min = form.getFieldValue(['salaryRange', 'min']) || ''
                        form.setFieldsValue({ salary: `${min}-${e.target.value}` })
                        setSalary(`${min}-${e.target.value}`)
                      }}
                    />
                  </Form.Item>
                </Input.Group>
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
            <Form.Item>
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
