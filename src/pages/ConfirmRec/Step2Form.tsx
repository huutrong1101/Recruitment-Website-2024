import React, { useState } from 'react'
import Container from '../../components/Container/Container'
import { Button, Form, Input, Upload, UploadFile } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { FormInstance } from 'antd/lib/form'
import { PlusOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload/interface'

interface Step2FormProps {
  form: FormInstance
  onFormChange: (changedValues: any, allValues: any) => void
  prevStep: () => void
  onLogoUploadChange: (info: UploadChangeParam<UploadFile>) => void // Đã thêm
  onCoverUploadChange: (info: UploadChangeParam<UploadFile>) => void // Đã thêm
  previewLogo: string // Đã được đổi từ previewImage
  previewCover: string // Đã thêm
}

function Step2Form({
  form,
  onFormChange,
  onLogoUploadChange,
  onCoverUploadChange,
  prevStep,
  previewLogo,
  previewCover
}: Step2FormProps) {
  return (
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
          name='contactEmail'
          label='Email liên hệ công ty'
          rules={[
            {
              type: 'email',
              message: 'Email không hợp lệ!'
            },
            {
              required: true,
              message: 'Vui lòng nhập email liên hệ!'
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
          name='name'
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
        name='about'
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
            data={form.getFieldValue('about') || ''}
            onChange={(_: any, editor: any) => {
              const data = editor.getData()
              form.setFieldsValue({ about: data })
            }}
          />
        </div>
      </Form.Item>

      <Form.Item
        name='companyLogo'
        label='Logo của công ty'
        // Thêm getValueFromEvent để định dạng giá trị của Form.Item phù hợp với danh sách fileList
        getValueFromEvent={(e) => e.fileList}
        rules={[{ required: true, message: 'Vui lòng upload logo của công ty!' }]}
      >
        <Upload
          listType='picture-card'
          showUploadList={false}
          onChange={onLogoUploadChange}
          beforeUpload={() => false} // Trả về false để ngăn không tự upload lên server
        >
          {previewLogo ? (
            <img src={previewLogo} style={{ width: '100%' }} alt='avatar' />
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item
        name='companyCoverPhoto'
        label='Ảnh bìa cho công ty'
        getValueFromEvent={(e) => e && e.fileList}
        rules={[{ required: true, message: 'Vui lòng upload ảnh bìa của công ty!' }]}
      >
        <Upload
          listType='picture-card'
          showUploadList={false}
          onChange={onCoverUploadChange}
          beforeUpload={() => false} // Trả về false để ngăn không tự upload lên server
        >
          {previewCover ? (
            <img src={previewCover} style={{ width: '100%' }} alt='avatar' />
          ) : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
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
  )
}

export default Step2Form
