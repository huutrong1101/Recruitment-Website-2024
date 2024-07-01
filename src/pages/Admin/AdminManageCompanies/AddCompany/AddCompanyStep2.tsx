import React from 'react'
import { Button, Form, Input, Modal, Upload, UploadFile } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { PlusOutlined } from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload/interface'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Container from '../../../../components/Container/Container'

interface Step2FormProps {
  form: any // Use appropriate types for form
  onFormChange: (changedValues: any, allValues: any) => void
  prevStep: () => void
  onLogoUploadChange: (info: UploadChangeParam<UploadFile>) => void
  onCoverUploadChange: (info: UploadChangeParam<UploadFile>) => void
  previewLogo: string
  previewCover: string
  isModalOpen: boolean
  showModal: () => void
  handleOk: () => void
  handleCancel: () => void
  onSelectFile: (e: React.ChangeEvent<HTMLInputElement>) => void
  imgSrc: string
  crop: any
  setCrop: (crop: any) => void
  setCompletedCrop: (crop: any) => void
  aspect: number | undefined
  imgRef: React.RefObject<HTMLImageElement>
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void
  scale: number
  rotate: number
  completedCrop: any
  previewCanvasRef: React.RefObject<HTMLCanvasElement>
}

const AddCompanyStep2: React.FC<Step2FormProps> = ({
  form,
  onFormChange,
  onLogoUploadChange,
  onCoverUploadChange,
  prevStep,
  previewLogo,
  previewCover,
  showModal,
  handleOk,
  handleCancel,
  onSelectFile,
  imgSrc,
  crop,
  setCrop,
  setCompletedCrop,
  aspect,
  imgRef,
  onImageLoad,
  scale,
  rotate,
  completedCrop,
  previewCanvasRef,
  isModalOpen
}) => {
  return (
    <Container>
      <div className='flex items-center justify-center gap-2'>
        <Form.Item
          name='position'
          label='Chức vụ'
          rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
          className='w-1/2'
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='contactEmail'
          label='Email liên hệ công ty'
          rules={[
            { type: 'email', message: 'Email không hợp lệ!' },
            { required: true, message: 'Vui lòng nhập email liên hệ!' }
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
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            { pattern: /^[0-9]*$/, message: 'Số điện thoại chỉ chứa các ký tự số!' },
            { len: 10, message: 'Số điện thoại phải có 10 số!' }
          ]}
          className='w-1/2'
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='name'
          label='Người đại diện'
          rules={[{ required: true, message: 'Vui lòng nhập tên người đại diện!' }]}
          className='w-1/2'
        >
          <Input />
        </Form.Item>
      </div>
      <Form.Item
        name='about'
        label='Giới thiệu công ty'
        rules={[{ required: true, message: 'Vui lòng nhập giới thiệu về công ty!' }]}
      >
        <div style={{ minHeight: '200px', maxHeight: '600px' }}>
          <CKEditor
            editor={ClassicEditor}
            data={form.getFieldValue('about') || ''}
            onChange={(_, editor) => {
              const data = editor.getData()
              form.setFieldsValue({ about: data })
            }}
          />
        </div>
      </Form.Item>

      <Form.Item
        name='companyLogo'
        label='Logo của công ty'
        rules={[{ required: true, message: 'Vui lòng upload logo của công ty!' }]}
        valuePropName='fileList'
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        className='flex-grow w-full'
      >
        {previewLogo ? (
          <>
            <img
              src={previewLogo}
              alt='Logo Preview'
              style={{ width: '250px', height: '250px', marginTop: '10px', cursor: 'pointer' }}
              onClick={showModal}
            />
            <p>Ảnh Preview Logo</p>
          </>
        ) : (
          <>
            <div
              onClick={showModal}
              className='w-[250px] h-[250px] flex items-center justify-center border-dashed border-2 border-black cursor-pointer'
            >
              Chọn ảnh logo
            </div>
          </>
        )}

        <Modal
          title='Cập nhật avatar'
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText='Cập nhật avatar'
          cancelText='Hủy'
          cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
          width={650}
        >
          <div className='mb-3 Crop-Controls'>
            <input type='file' id='fileInput' accept='image/*' onChange={onSelectFile} style={{ display: 'none' }} />
            <label
              htmlFor='fileInput'
              className='px-3 py-2 border w-[100px] rounded-md bg-emerald-500 text-white text-center cursor-pointer'
            >
              Chọn Ảnh
            </label>
          </div>
          <div className='flex items-center justify-center Crop-Container'>
            {!!imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
              >
                <img
                  ref={imgRef}
                  alt='Crop me'
                  src={imgSrc}
                  style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
            {!!completedCrop && (
              <canvas
                ref={previewCanvasRef}
                style={{
                  objectFit: 'cover',
                  width: '250px',
                  height: '250px'
                }}
              />
            )}
          </div>
        </Modal>
      </Form.Item>

      <Form.Item
        name='companyCoverPhoto'
        label='Ảnh bìa của công ty'
        getValueFromEvent={(e) => e && e.fileList}
        rules={[{ required: true, message: 'Vui lòng upload ảnh bìa của công ty!' }]}
      >
        <Upload
          listType='picture-card'
          showUploadList={false}
          onChange={onCoverUploadChange}
          beforeUpload={() => false}
          className='w-full mb-10'
        >
          {previewCover ? (
            <img
              src={previewCover}
              style={{ width: '100%' }}
              alt='avatar'
              className='object-cover object-center w-full h-[200px] aspect-video'
            />
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

export default AddCompanyStep2
