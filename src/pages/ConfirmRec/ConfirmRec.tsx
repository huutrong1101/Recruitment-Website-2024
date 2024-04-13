import { Steps, Button, Form, Input, Select } from 'antd'
import React, { useState } from 'react'
import Container from '../../components/Container/Container'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface'

const { Step } = Steps
const { Option } = Select

interface FormData {
  companyName?: string
  website?: string
  field?: string
  province?: string
  district?: string
  address?: string
  emailLogin?: string
  position?: string
  emailCompany?: string
  phone?: string
  representative?: string
  companyDescription?: string
  companyLogo?: UploadFile | null
}

function ConfirmRec() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({})
  const [form] = Form.useForm() // Tạo instance của form

  const nextStep = () => {
    form
      .validateFields() // Kiểm tra validation
      .then(() => {
        // Nếu không có lỗi, tiếp tục tới step tiếp theo
        setCurrentStep(currentStep + 1)
      })
      .catch((errorInfo) => {
        // Nếu có lỗi, hiển thị thông báo lỗi và không chuyển step
        console.log('Validate Failed:', errorInfo)
      })
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleFormChange = (changedValues: any, allValues: any) => {
    setFormData({ ...formData, ...changedValues })
  }

  const onFinish = () => {
    console.log('Received values of form:', formData)
  }

  return (
    <Container>
      <div className='flex flex-col gap-5 mt-5'>
        <Steps current={currentStep} className='flex items-center justify-center px-10'>
          <Step title='Cập nhật thông tin nhà tuyển dụng' />
          <Step title='Thông tin liên hệ công ty' />
        </Steps>
        <div className='steps-content'>
          <Form
            name='recruiter-info'
            form={form}
            onFinish={onFinish}
            onValuesChange={handleFormChange}
            labelCol={{ span: 24 }}
          >
            {currentStep === 0 && (
              <Container>
                <Form.Item
                  name='companyName'
                  label='Tên công ty'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên công ty!'
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <div className='flex items-center justify-center gap-2'>
                  <Form.Item
                    name='website'
                    label='Website'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập website của công ty!'
                      }
                    ]}
                    className='w-1/2'
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='field'
                    label='Lĩnh vực'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn lĩnh vực!'
                      }
                    ]}
                    className='w-1/2'
                  >
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder='Lĩnh vực'
                      optionFilterProp='children'
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      options={[
                        {
                          value: '1',
                          label: 'Not Identified'
                        },
                        {
                          value: '2',
                          label: 'Closed'
                        },
                        {
                          value: '3',
                          label: 'Communicated'
                        },
                        {
                          value: '4',
                          label: 'Identified'
                        },
                        {
                          value: '5',
                          label: 'Resolved'
                        },
                        {
                          value: '6',
                          label: 'Cancelled'
                        }
                      ]}
                    />
                  </Form.Item>
                </div>
                <div className='flex items-center justify-center gap-2'>
                  <Form.Item
                    name='province'
                    label='Tình thành'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn tỉnh thành!'
                      }
                    ]}
                    className='w-1/2'
                  >
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder='Chọn tỉnh thành'
                      optionFilterProp='children'
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      options={[
                        {
                          value: '1',
                          label: 'Not Identified'
                        },
                        {
                          value: '2',
                          label: 'Closed'
                        },
                        {
                          value: '3',
                          label: 'Communicated'
                        },
                        {
                          value: '4',
                          label: 'Identified'
                        },
                        {
                          value: '5',
                          label: 'Resolved'
                        },
                        {
                          value: '6',
                          label: 'Cancelled'
                        }
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    name='district'
                    label='Quận huyện'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn quận huyện!'
                      }
                    ]}
                    className='w-1/2'
                  >
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder='Chọn quận huyện'
                      optionFilterProp='children'
                      filterOption={(input, option) => (option?.label ?? '').includes(input)}
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      options={[
                        {
                          value: '1',
                          label: 'Not Identified'
                        },
                        {
                          value: '2',
                          label: 'Closed'
                        },
                        {
                          value: '3',
                          label: 'Communicated'
                        },
                        {
                          value: '4',
                          label: 'Identified'
                        },
                        {
                          value: '5',
                          label: 'Resolved'
                        },
                        {
                          value: '6',
                          label: 'Cancelled'
                        }
                      ]}
                    />
                  </Form.Item>
                </div>
                <div className='flex items-center justify-center gap-2'>
                  <Form.Item
                    name='address'
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
                    name='emailLogin'
                    label='Email đăng nhập'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập email đăng nhập!'
                      }
                    ]}
                    className='w-1/2'
                  >
                    <Input />
                  </Form.Item>
                </div>

                <Form.Item className='flex justify-end'>
                  <Button type='primary' onClick={nextStep}>
                    Tiếp theo
                  </Button>
                </Form.Item>
              </Container>
            )}
            {currentStep === 1 && (
              <Container>
                <div className='flex items-center justify-center gap-2'>
                  <Form.Item
                    name='position'
                    label='Chức vụ'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập chức vụ!'
                      }
                    ]}
                    className='w-1/2'
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='emailCompany'
                    label='Email liên hệ công ty'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập email của công ty!'
                      }
                    ]}
                    className='w-1/2'
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className='flex items-center justify-center gap-2'>
                  <Form.Item
                    name='phone'
                    label='Điện thoại'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại!'
                      },
                      {
                        pattern: /^[0-9]*$/,
                        message: 'Số điện thoại chỉ chứa các ký tự số!'
                      },
                      {
                        len: 10,
                        message: 'Số điện thoại phải có 10 số!'
                      }
                    ]}
                    className='w-1/2'
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name='representative'
                    label='Người đại diện'
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tên người đại diện!'
                      }
                    ]}
                    className='w-1/2'
                  >
                    <Input />
                  </Form.Item>
                </div>
                <Form.Item
                  name='companyDescription'
                  label='Giới thiệu công ty'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập giới thiệu về công ty!'
                    }
                  ]}
                >
                  <div style={{ minHeight: '200px', maxHeight: '600px' }}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={form.getFieldValue('companyDescription') || ''}
                      onChange={(_: any, editor: any) => {
                        const data = editor.getData()
                        form.setFieldsValue({ companyDescription: data })
                      }}
                    />
                  </div>
                </Form.Item>

                <Form.Item
                  name='companyLogo'
                  label='Chọn ảnh logo'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng upload logo của công ty'
                    }
                  ]}
                >
                  <div style={{ minHeight: '200px', maxHeight: '600px' }}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={form.getFieldValue('companyDescription') || ''}
                      onChange={(_: any, editor: any) => {
                        const data = editor.getData()
                        form.setFieldsValue({ companyDescription: data })
                      }}
                    />
                  </div>
                </Form.Item>

                <Form.Item className='flex items-center justify-end gap-2'>
                  <Button onClick={prevStep} className='mr-2 text-white'>
                    Quay lại
                  </Button>
                  <Button type='primary' htmlType='submit'>
                    Hoàn thành
                  </Button>
                </Form.Item>
              </Container>
            )}
          </Form>
        </div>
      </div>
    </Container>
  )
}

export default ConfirmRec
