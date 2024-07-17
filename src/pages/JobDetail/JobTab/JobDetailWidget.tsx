import classNames from 'classnames'
import JobInformationCard from '../JobInformationCard'
import { AdminJobInterface, JobInterface } from '../../../types/job.type'
import parse from 'html-react-parser'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../../hooks/hooks'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Form, Input, Button, Modal, Tag, Tooltip, List, Pagination, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserService } from '../../../services/UserService'
import axiosInstance from '../../../utils/AxiosInstance'
import { AdminService } from '../../../services/AdminService'
import { ExclamationCircleOutlined } from '@ant-design/icons'

interface JobProps {
  job: JobInterface
  jobInformation: { icon: JSX.Element; name: string; value: string }[]
}

interface InterfaceReport {
  _id: string
  jobId: string
  name: string
  phone: string
  email: string
  content: string
  createdAt: string
  updatedAt: string
}

function JobDetailWidget({ job, jobInformation }: JobProps) {
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(true)
  const [reports, setReports] = useState<InterfaceReport[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalReports, setTotalReports] = useState(0)
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAppSelector((app) => app.Auth)
  const { admin } = useAppSelector((state) => state.Auth)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isReportModalVisible, setIsReportModalVisible] = useState(false)
  const [isAdminShowListReports, setIsAdminShowListReports] = useState(false)

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true) // Bắt đầu hiệu ứng loading
      if (admin && job) {
        try {
          const response = await AdminService.getListReports(job._id, { page: currentPage, limit: 5 })
          if (response && response.data.metadata) {
            setReports(response.data.metadata.listReport)
            setTotalReports(response.data.metadata.length)
          }
        } catch (error) {
          console.error('Error fetching reports:', error)
        }
        setIsLoading(false) // Kết thúc hiệu ứng loading
      }
    }

    fetchReports()
  }, [job, admin, currentPage])

  const showReportModal = () => {
    setIsReportModalVisible(true)
  }

  const handleReportCancel = () => {
    setIsReportModalVisible(false)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onFinish = (values: any) => {
    const data = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      content: values.details
    }
    try {
      toast
        .promise(UserService.createReport(job._id, data), {
          pending: `Phản hồi của bạn đang được gửi.`,
          success: `Cảm ơn bạn! Chúng tôi sẽ tiến hành xác minh thông tin và giải quyết trong thời gian sớm nhất.`
        })
        .then(() => {
          handleReportCancel()
        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })
    } catch (error) {
      toast.error('Có lỗi xảy ra khi duyệt công việc')
      console.error(error)
    }
  }

  const handleReportClick = () => {
    if (!isLoggedIn) {
      navigate(`/auth/login?from=${encodeURIComponent(window.location.pathname)}`)
    } else {
      showReportModal()
    }
  }

  const showAdminReportModal = () => {
    setIsAdminShowListReports(true)
  }

  const hideAdminReportModal = () => {
    setIsAdminShowListReports(false)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  console.log(job)

  return (
    <div className={classNames(`flex flex-col md:flex-row gap-12`)}>
      {/* Left side description */}
      <div className={classNames(`w-full md:w-8/12`, `flex flex-col gap-6`)}>
        <div
          className={classNames(
            `border bg-white shadow-sm rounded-xl flex flex-col gap-8`,
            `px-8 py-8`,
            `text-justify`
          )}
        >
          {admin && (
            <div className='flex items-center justify-between'>
              {job.isBan ? (
                <>
                  <Tag color={'error'} className='w-1/5 py-1 font-medium text-center uppercase cursor-pointer'>
                    Đã khóa
                  </Tag>

                  <Button className='text-white' onClick={showModal}>
                    Xem lý do
                  </Button>
                </>
              ) : (
                <>
                  <Tag color={'success'} className='w-1/5 py-1 font-medium text-center uppercase'>
                    Đang hiển thị
                  </Tag>
                  {reports.length > 0 && (
                    <Button className='text-white' onClick={showAdminReportModal}>
                      Xem danh sách báo cáo ({totalReports})
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          <div>
            <h1 className='text-2xl font-semibold capitalize'>Chi tiết công việc</h1>
            <p className='mt-2 whitespace-pre-line'>{parse(job?.description)}</p>
          </div>
          <div>
            <h1 className='text-2xl font-semibold capitalize'>Yêu cầu công việc</h1>
            <p className='mt-2 whitespace-pre-line'>{parse(job?.requirement)}</p>
          </div>
          <div>
            <h1 className='text-2xl font-semibold capitalize'>Quyền lợi</h1>
            <p className='mt-2 whitespace-pre-line'>{parse(job?.benefit)}</p>
          </div>

          {!admin && (
            <div className='flex items-center gap-2 p-2 rounded-md bg-slate-200'>
              <ExclamationCircleIcon className='w-4 h-4' />
              <p>
                Báo cáo tin tuyển dụng: Nếu bạn thấy rằng tin tuyển dụng này không đúng hoặc có dấu hiệu lừa đảo,{' '}
                <span className='cursor-pointer text-emerald-500' onClick={handleReportClick}>
                  hãy phản ánh với chúng tôi.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right side description */}
      <div className={classNames(`w-full md:w-3/12 flex-1 relative`)}>
        <JobInformationCard cardData={jobInformation} jobId={job._id} />
      </div>

      <Modal
        title='Lý do bị khóa'
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key='ok' type='primary' onClick={handleCancel}>
            OK
          </Button>
        ]}
      >
        <p>{job.banReason}</p>
      </Modal>

      <Modal
        title='Danh sách báo cáo'
        open={isAdminShowListReports}
        onCancel={hideAdminReportModal}
        footer={
          <Button key='back' onClick={hideAdminReportModal}>
            Đóng
          </Button>
        }
      >
        {isLoading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin />
          </div>
        ) : (
          <div className='flex flex-col gap-2'>
            <List
              itemLayout='horizontal'
              dataSource={reports}
              renderItem={(report) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                    title={
                      <div className='flex flex-col'>
                        <div className='font-semibold'>{report.name}</div>
                        <div>
                          Email: {report.email} - Số điện thoại: {report.phone}
                        </div>
                        <div>Nội dung: {report.content}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            <div className='flex justify-end'>
              <Pagination
                current={currentPage}
                onChange={handlePageChange}
                total={totalReports}
                pageSize={5}
                showSizeChanger={false}
                disabled={isLoading}
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title='Phản ánh tin tuyển dụng không chính xác'
        open={isReportModalVisible}
        onCancel={handleReportCancel}
        style={{ top: 20 }}
        footer={[
          <Button key='cancel' onClick={handleReportCancel}>
            Hủy
          </Button>,
          <Button key='submit' form='reportForm' htmlType='submit' type='primary'>
            Gửi phản hồi
          </Button>
        ]}
      >
        <div className='text-center'>
          Hãy tìm hiểu kỹ về nhà tuyển dụng và công việc bạn ứng tuyển. Bạn nên cẩn trọng với những công việc yêu cầu
          nộp phí, hoặc những hợp đồng mập mờ, không rõ ràng. Nếu bạn thấy rằng tin tuyển dụng này không đúng, hãy phản
          ánh với chúng tôi.
        </div>
        <Form form={form} id='reportForm' layout='vertical' onFinish={onFinish}>
          <Form.Item
            name='name'
            label='Họ và tên'
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn!' }]}
          >
            <Input placeholder='Họ và tên' />
          </Form.Item>
          <Form.Item
            name='phone'
            label='Số điện thoại'
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại của bạn!' }]}
          >
            <Input placeholder='0123xxxxxx' />
          </Form.Item>
          <Form.Item
            name='email'
            label='Địa chỉ email'
            rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
          >
            <Input type='email' placeholder='Email' />
          </Form.Item>
          <Form.Item
            name='details'
            label='Nội dung'
            rules={[{ required: true, message: 'Vui lòng nhập nội dung phản ánh!' }]}
          >
            <Input.TextArea
              rows={5}
              placeholder='Bạn vui lòng cung cấp rõ thông tin hoặc bất kỳ bằng chứng (nếu có) để chúng tôi xử lý trong thời gian sớm nhất'
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default JobDetailWidget
