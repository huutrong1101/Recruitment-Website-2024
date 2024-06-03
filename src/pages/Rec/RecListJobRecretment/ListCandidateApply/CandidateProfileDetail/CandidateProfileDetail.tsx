import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { Checkbox, Input, Modal, Radio, Timeline } from 'antd'
import { RecService } from '../../../../../services/RecService'
import { useAppDispatch, useAppSelector } from '../../../../../hooks/hooks'
import moment from 'moment'
import parse from 'html-react-parser'
import { EyeOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'
import { CheckboxChangeEvent } from 'antd/es/checkbox'

function CandidateProfileDetail() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { candidateId } = useParams()

  const { resumeDetail } = useAppSelector((state) => state.RecJobs)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState('approve')
  const [selectedDeclineReasons, setSelectedDeclineReasons] = useState<string[]>([])
  const [declineReason, setDeclineReason] = useState('')
  const [checkAll, setCheckAll] = useState(false)

  useEffect(() => {
    if (candidateId) {
      RecService.getResumeDetail(dispatch, candidateId)
    }
  }, [dispatch, candidateId])

  const handleBack = () => {
    navigate(-1)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    if (approvalStatus === 'approve' && resumeDetail) {
      RecService.handleResume(resumeDetail._id, 'Đã nhận', '').then(() => {
        toast.success(`Hồ sơ đã được duyệt thành công`)
      })
    } else if (approvalStatus === 'decline' && resumeDetail) {
      RecService.handleResume(resumeDetail._id, 'Không nhận', declineReason).then(() =>
        toast.success(`Hồ sơ đã được duyệt thành công`)
      )
    }
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const declineReasons = [
    { id: '1', reason: 'Không đáp ứng yêu cầu công việc' },
    { id: '2', reason: 'Số lượng ứng viên đủ' },
    { id: '3', reason: 'Không có kinh nghiệm làm việc cụ thể yêu cầu' },
    { id: '4', reason: 'CV không đủ chi tiết hoặc không chuyên nghiệp' }
  ]

  const handleCheckboxChange = (checkedValues: string[]) => {
    setSelectedDeclineReasons(checkedValues)
    const selectedReasonTexts = checkedValues.join(', ') // Tạo chuỗi từ các lý do được chọn
    setDeclineReason(selectedReasonTexts) // Cập nhật state declineReason
    setCheckAll(checkedValues.length === declineReasons.length)
  }

  const handleCheckAllChange = (e: CheckboxChangeEvent) => {
    const checked = e.target.checked
    setCheckAll(checked)
    if (checked) {
      const allReasons = declineReasons.map((reason) => reason.reason)
      setSelectedDeclineReasons(allReasons)
      setDeclineReason(allReasons.join(', '))
    } else {
      setSelectedDeclineReasons([])
      setDeclineReason('')
    }
  }

  console.log(resumeDetail)

  return (
    <>
      {resumeDetail && (
        <>
          <div className='flex flex-col flex-1 gap-4'>
            <div className='w-full border rounded-xl border-zinc-100'>
              <div className='flex items-center justify-center gap-5 p-2 rounded-tl-lg bg-slate-200 rounded-tr-xl'>
                <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer' }} className='font-bold' />
                <h6 className='flex-1 text-lg font-semibold uppercase'>Thông tin ứng viên</h6>
              </div>

              <div className='flex items-start gap-2 p-2 m-2 border shadow-md justify-normal'>
                <div className='flex w-5/6'>
                  <div className='flex w-full gap-3'>
                    <div className='w-1/4'>
                      <img className='object-cover w-full h-full' src={resumeDetail.avatar} alt='' />
                    </div>
                    <div className='flex flex-col w-3/4 gap-2'>
                      <p className='text-base font-medium text-black md:text-sm'>
                        <span className='font-bold'>{resumeDetail.name}</span>
                      </p>
                      <div className='flex items-center justify-between w-full gap-2'>
                        <div className='flex flex-col gap-3'>
                          <p className='text-xs font-medium text-gray-600 md:text-sm '>
                            <span className='font-bold'>Số điện thoại:</span>{' '}
                            <span className='hover:text-emerald-500'>{resumeDetail.phone}</span>
                          </p>
                          <p className='text-xs font-medium text-gray-600 md:text-sm '>
                            <span className='font-bold'>Ngày sinh:</span>{' '}
                            <span className='hover:text-emerald-500'>
                              {moment(resumeDetail.dateOfBirth).format('DD/MM/YYYY')}
                            </span>
                          </p>
                          <p className='text-xs font-medium text-gray-600 md:text-sm '>
                            <span className='font-bold'>Học vấn:</span>{' '}
                            <span className='hover:text-emerald-500'>{resumeDetail.educationLevel}</span>
                          </p>
                          <p className='text-xs font-medium text-gray-600 md:text-sm '>
                            <span className='font-bold'>Quê quán:</span>{' '}
                            <span className='hover:text-emerald-500'>{resumeDetail.homeTown}</span>
                          </p>
                          <p className='text-xs font-medium text-gray-600 md:text-sm '>
                            <span className='font-bold'>Điểm GPA:</span>{' '}
                            <span className='hover:text-emerald-500'>{resumeDetail.GPA}</span>
                          </p>
                        </div>
                        <div className='flex flex-col gap-3'>
                          <p className='text-xs font-medium text-gray-600 md:text-sm '>
                            <span className='font-bold'>Giới tính:</span>{' '}
                            <span className='hover:text-emerald-500'>Nam</span>
                          </p>
                          <p className='text-xs font-medium text-gray-600 md:text-sm '>
                            <span className='font-bold'>Email:</span>{' '}
                            <span className='hover:text-emerald-500'>{resumeDetail.email}</span>
                          </p>
                          <p className='text-xs font-medium text-gray-600 md:text-sm '>
                            <span className='font-bold'>Ngành:</span>{' '}
                            <span className='hover:text-emerald-500'>{resumeDetail.major}</span>
                          </p>
                          <p className='text-xs font-medium text-gray-600 md:text-sm '>
                            <span className='font-bold'>Loại hình công việc:</span>{' '}
                            <span className='hover:text-emerald-500'>{resumeDetail.jobType}</span>
                          </p>
                          <p className='text-xs font-medium text-gray-600 md:text-sm '>
                            <span className='font-bold'>Trình độ ngoại ngữ:</span>{' '}
                            <span className='hover:text-emerald-500'>{resumeDetail.english}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='w-1/6'>
                  <button
                    className='block w-full p-2 text-center text-white bg-red-500 border rounded-md'
                    onClick={showModal}
                  >
                    XỬ LÍ HỒ SƠ
                  </button>
                </div>
              </div>

              <div className='flex items-start justify-between gap-5 p-2'>
                <div className='flex flex-col w-1/2 gap-10'>
                  <div className='flex flex-col w-full gap-2'>
                    <div className='flex items-center gap-1'>
                      <div className='flex-1 h-[3px] bg-blue-500'></div>
                      <h2 className='font-bold text-blue-500'>MỤC TIÊU NGHỀ NGHIỆP</h2>
                      <div className='flex-1 h-[3px] bg-blue-500'></div>
                    </div>
                    <div>{parse(resumeDetail?.goal)}</div>
                  </div>

                  <div className='flex flex-col w-full gap-2'>
                    <div className='flex items-center gap-1'>
                      <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên trái */}
                      <h2 className='font-bold text-blue-500'>
                        GIẢI THƯỞNG / HOẠT ĐỘNG NGOẠI KHÓA / SỞ THÍCH / KHÁC ...
                      </h2>
                      <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên phải */}
                    </div>
                    <div className='flex flex-col gap-2'>
                      <div className='flex flex-col'>{parse(resumeDetail?.activity)}</div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <h2 className='font-bold text-blue-500'>CHỨNG CHỈ</h2>
                    {resumeDetail.certifications.map((cert: any, index: string) => (
                      <div key={index} className='flex items-center justify-center gap-4'>
                        <span className='font-medium'>{cert.name}</span>
                        <a href={cert.uploadFile.url} target='_blank' rel='noopener noreferrer'>
                          <EyeOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='flex flex-col w-1/2 gap-10'>
                  <div className='flex flex-col w-full gap-2'>
                    <div className='flex items-center gap-1'>
                      <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên trái */}
                      <h2 className='font-bold text-blue-500'>QUÁ TRÌNH HỌC TẬP</h2>
                      <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên phải */}
                    </div>
                    <div className='mt-[5px]'>
                      <Timeline>
                        {resumeDetail.educations.map((edu: any, index: string) => (
                          <Timeline.Item key={index}>
                            <div className='flex flex-col gap-2'>
                              <p className='font-medium text-red-400 uppercase'>{edu.major}</p>
                              <span>
                                Từ: {moment(edu.from).format('DD/MM/YYYY')} - Đến: {moment(edu.to).format('DD/MM/YYYY')}
                              </span>
                            </div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </div>
                  </div>

                  <div className='flex flex-col w-full gap-2'>
                    <div className='flex items-center gap-1'>
                      <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên trái */}
                      <h2 className='font-bold text-blue-500'>QUÁ TRÌNH LÀM VIỆC</h2>
                      <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên phải */}
                    </div>
                    <div className='mt-[5px]'>
                      <Timeline>
                        {resumeDetail.workHistories.map((work: any, index: string) => (
                          <Timeline.Item key={index}>
                            <div className='flex flex-col gap-2'>
                              <p className='font-medium text-red-400 uppercase'>{work.workUnit}</p>
                              <span>
                                Từ: {moment(work.from).format('DD/MM/YYYY')} - Đến:{' '}
                                {moment(work.to).format('DD/MM/YYYY')}
                              </span>
                              <div className='text-gray-400'> {work.description}</div>
                            </div>
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            title='Xử lý hồ sơ'
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText='Lưu'
            cancelText='Hủy'
            cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
          >
            <div className='flex flex-col gap-1'>
              <p className='font-bold'>Chọn trạng thái xử lí hồ sơ</p>
              <Radio.Group onChange={(e) => setApprovalStatus(e.target.value)} value={approvalStatus}>
                <Radio value='approve'>Nhận hồ sơ</Radio>
                <Radio value='decline'>Không nhận hồ sơ</Radio>
              </Radio.Group>
              {/* Hiển thị ô nhập lý do nếu chọn "Không nhận hồ sơ" */}
              {approvalStatus === 'decline' && (
                <>
                  <div className='flex items-center gap-2'>
                    <div className='font-bold'>Chọn lý do không nhận hồ sơ:</div>
                    <Checkbox onChange={handleCheckAllChange} checked={checkAll}>
                      Chọn tất cả
                    </Checkbox>
                  </div>
                  <Checkbox.Group value={selectedDeclineReasons} onChange={handleCheckboxChange}>
                    <div className='flex flex-col gap-2'>
                      {declineReasons.map((reason) => (
                        <Checkbox key={reason.id} value={reason.reason}>
                          {reason.reason}
                        </Checkbox>
                      ))}
                    </div>
                  </Checkbox.Group>

                  <div>
                    <div className='font-bold'>Lý do không nhận hồ sơ:</div>
                    <Input.TextArea
                      style={{ minHeight: '200px' }}
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder='Nhập lý do không nhận hồ sơ'
                    />
                  </div>
                </>
              )}
              <p className='text-red-500'>
                Lưu ý: Nhận hồ sơ không có nghĩa là tuyển dụng ứng viên. Tiếp theo, nhà tuyển dụng cần liên hệ với ứng
                viên để đặt lịch phỏng vấn
              </p>
            </div>
          </Modal>
        </>
      )}
    </>
  )
}

export default CandidateProfileDetail
