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
import { useNavigate, useParams } from 'react-router-dom'
import SelectFormItem from './SelectFormItem'
import dayjs from 'dayjs'

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

function RecEditJob() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({})
  const [form] = Form.useForm()
  const [salaryType, setSalaryType] = useState('')
  const [salary, setSalary] = useState('')
  const { jobId } = useParams()

  const provinces = useAppSelector((state) => state.Job.province)
  const experiences = useAppSelector((state) => state.Job.experience)
  const jobTypes = useAppSelector((state) => state.Job.type)
  const levelRequirement = useAppSelector((state) => state.Job.levelRequirement)
  const genderRequirement = useAppSelector((state) => state.Job.genderRequirement)
  const activities = useAppSelector((state) => state.Job.activities)
  const jobDetail = useAppSelector((state) => state.RecJobs.jobDetail)

  useEffect(() => {
    JobService.getProvince(dispatch)
    JobService.getExperience(dispatch)
    JobService.getLevelRequirement(dispatch)
    JobService.getGenderRequirement(dispatch)
    JobService.getActivity(dispatch)
    if (jobId) {
      RecService.getRecJobDetail(dispatch, jobId)
    }
  }, [])

  useEffect(() => {
    form.setFieldsValue({ salary: salary })
  }, [salaryType, salary, form])

  useEffect(() => {
    if (jobDetail && form) {
      const formattedDeadline = jobDetail.deadline ? dayjs(jobDetail.deadline, 'DD/MM/YYYY') : null

      form.setFieldsValue({
        name: jobDetail.name,
        location: jobDetail.location,
        province: jobDetail.province,
        type: jobDetail.type,
        levelRequirement: jobDetail.levelRequirement,
        experience: jobDetail.experience,
        salary: jobDetail.salary, // Đây là giả định mức lương chỉ có một giá trị, có thể bạn cần xử lý nếu là dạng range
        field: jobDetail.field,
        description: jobDetail.description,
        requirement: jobDetail.requirement,
        benefit: jobDetail.benefit,
        quantity: jobDetail.quantity !== 'Không giới hạn' ? jobDetail.quantity.toString() : 'o', // Đảm bảo nó là một chuỗi
        deadline: formattedDeadline,
        genderRequirement: jobDetail.genderRequirement
      })

      const salaryValue = jobDetail.salary.toString()
      if (salaryValue === 'Thỏa thuận') {
        // Nếu lương là "Thỏa thuận"
        setSalaryType('negotiable')
        form.setFieldsValue({ salaryType: 'negotiable', salary: salaryValue })
      } else if (salaryValue.includes('-')) {
        // Nếu lương là dải (min-max)
        const [min, max] = salaryValue.split('-')
        setSalaryType('range')
        form.setFieldsValue({
          salaryType: 'range',
          salaryRange: {
            min: min.trim(),
            max: max.trim()
          }
        })
      } else {
        // Lương khởi điểm
        setSalaryType('starting')
        setSalary(salaryValue) // Thêm dòng này để set giá trị salary khởi điểm
        form.setFieldsValue({ salaryType: 'starting', startingSalary: salaryValue })
      }
    }
  }, [jobDetail, form])

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
    let formValues = form.getFieldsValue(true)

    if (salaryType === 'starting') {
      formValues.salary = formValues.startingSalary.toString()
    } else if (salaryType === 'range') {
      formValues.salary = `${formValues.salaryRange.min.toString()}-${formValues.salaryRange.max.toString()}`
    }

    delete formValues.salaryType
    delete formValues.startingSalary
    delete formValues.salaryRange

    if (jobId) {
      toast
        .promise(RecService.updateJob(formValues, jobId), {
          pending: `Công việc của bạn đang được chỉnh sửa`,
          success: `Công việc đã được chỉnh sửa thành công. Hãy chờ đợi để admin xét duyệt`
        })
        .then((response) => {
          navigate('/recruiter/profile/jobsPosted')
        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })
    }
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
          <h1 className='flex-1 text-2xl font-semibold md:mb-4'>Chỉnh sửa tin tuyển dụng</h1>
          <p className='flex items-center gap-2'>
            <ExclamationCircleIcon className='w-4 h-4' /> Lưu ý: Sau khi chỉnh sửa việc làm thành công, việc làm sẽ
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
                <Input value={salary} addonAfter='VND' onChange={handleChange} />
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
                  data={form.getFieldValue('description') || ''}
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
                  data={form.getFieldValue('requirement') || ''}
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
                  data={form.getFieldValue('benefit') || ''}
                  onChange={(_: any, editor: any) => {
                    const data = editor.getData()
                    form.setFieldsValue({ benefit: data })
                  }}
                />
              </div>
            </Form.Item>
            <Form.Item className='flex justify-end'>
              <Button type='primary' htmlType='submit'>
                Chỉnh sửa
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default RecEditJob
