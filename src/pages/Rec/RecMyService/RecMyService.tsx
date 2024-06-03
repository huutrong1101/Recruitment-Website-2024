import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { ExclamationOutlined } from '@ant-design/icons'
import { List, Image, Modal, message, Card } from 'antd'
import moment from 'moment'
import axiosInstance from '../../../utils/AxiosInstance'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { checkRecUpgrade } from '../../../redux/reducer/RecSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const { Meta } = Card

const benefits = [
  {
    id: 1,
    text: 'Hỗ trợ thống kê số liệu và tổng hợp thông tin chính xác',
    img: 'https://tuyendung.topcv.vn/app/_nuxt/img/category-1.8f19f32.png'
  },
  {
    id: 2,
    text: 'Chủ động kết nối và mở thông tin hồ sơ ứng viên',
    img: 'https://tuyendung.topcv.vn/app/_nuxt/img/category-2.06649d2.png'
  },
  {
    id: 3,
    text: 'Làm nổi bật tin tuyển dụng để tăng hiệu quả với ứng viên',
    img: 'https://tuyendung.topcv.vn/app/_nuxt/img/category-3.1f9688c.png'
  },
  {
    id: 4,
    text: 'Tăng tốc độ duyệt yêu cầu',
    img: 'https://tuyendung.topcv.vn/app/_nuxt/img/category-4.b8906e0.png'
  }
]

function RecMyService() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { recruiter, loading } = useAppSelector((app) => app.Auth)
  const [selectedBenefit, setSelectedBenefit] = useState<string>(benefits[0].img)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { isUpgrade } = useAppSelector((state) => state.RecJobs)

  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)

  useEffect(() => {
    if (recruiter) {
      dispatch(checkRecUpgrade())
        .unwrap()
        .catch((message) => toast.error(message))
    }
  }, [])

  const handleMouseEnter = (img: string) => {
    setSelectedBenefit(img)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const response = await axiosInstance.post('/recruiter/create_payment_url', {
        orderType: 'billpayment',
        language: 'vn'
      })
      console.log(response.data.metadata)
      const { vpnUrl } = response.data.metadata
      if (vpnUrl) {
        setIsModalVisible(false)
        window.location.href = vpnUrl
      } else {
        message.error('Error in generating payment URL')
      }
    } catch (error) {
      console.error('Payment Error:', error)
      message.error('Error occurred while processing payment')
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const showCancelModal = () => setIsCancelModalVisible(true)
  const handleCancelOk = () => {
    // Xử lý logic khi nhấn Ok trong Modal hủy dịch vụ
    setIsCancelModalVisible(false)
  }
  const handleCancelCancel = () => setIsCancelModalVisible(false)

  const showDetailModal = () => setIsDetailModalVisible(true)
  const handleDetailClose = () => setIsDetailModalVisible(false)

  // Tính toán thời gian sử dụng gói
  const startDate = moment()
  const endDate = moment().add(1, 'month')
  const formattedStartDate = startDate.format('DD/MM/YYYY')
  const formattedEndDate = endDate.format('DD/MM/YYYY')

  const handleFindCandidate = () => {
    navigate('/recruiter/profile/service/findCandidate')
  }

  const handleStatistical = () => {
    navigate('/recruiter/profile/service/statistical')
  }

  return (
    <div className={classNames(`flex-1 flex flex-col gap-4`)}>
      <div className='w-full p-4 border rounded-xl border-zinc-100'>
        <div className='flex items-center justify-between md:mb-4'>
          <h1 className={classNames(`text-2xl font-semibold flex-1 `)}>Dịch vụ của tôi</h1>
          {isUpgrade && (
            <div className='flex items-center justify-center gap-2'>
              <div
                onClick={showCancelModal}
                className='px-2 py-3 text-white bg-red-400 border rounded-md cursor-pointer'
              >
                Hủy gói dịch vụ
              </div>
              <div
                onClick={showDetailModal}
                className='px-2 py-3 text-white border rounded-md cursor-pointer bg-emerald-500'
              >
                Xem chi tiết gói dịch vụ
              </div>
              <Modal
                title='Xác nhận hủy gói dịch vụ'
                visible={isCancelModalVisible}
                onOk={handleCancelOk}
                onCancel={handleCancelCancel}
              >
                <p>Bạn có chắc chắn muốn hủy gói dịch vụ không?</p>
              </Modal>
              <Modal
                title='Chi tiết gói dịch vụ'
                visible={isDetailModalVisible}
                onCancel={handleDetailClose}
                footer={null} // Loại bỏ phần footer nếu không cần thiết
                width={700}
              >
                <div className='flex flex-col items-center justify-center gap-2'>
                  <p className='font-bold'>Những lợi ích của việc nâng cấp tài khoản</p>
                  <div className='flex flex-row items-center justify-center h-full gap-4'>
                    <List
                      className='w-1/2 h-full'
                      bordered
                      dataSource={benefits}
                      renderItem={(item) => (
                        <List.Item style={{ cursor: 'pointer' }} onMouseEnter={() => handleMouseEnter(item.img)}>
                          {item.text}
                        </List.Item>
                      )}
                    />
                    {/* Hình ảnh hiển thị */}
                    <div className='flex items-center justify-center w-1/2 h-full'>
                      <Image
                        src={selectedBenefit}
                        alt='Benefit Image'
                        fallback='path-to-fallback-image.jpg' // Sử dụng hình ảnh mặc định khi link bị lỗi
                        style={{ height: '250px' }}
                      />
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          )}
        </div>

        <div className='flex items-start gap-2 p-2 bg-blue-100 border rounded-md md:mb-4'>
          <div className='flex items-start gap-2 mt-1 text-lg font-bold text-blue-500'>
            <ExclamationOutlined />
          </div>
          <div className='flex flex-col'>
            <p className='font-bold text-blue-500'>Lưu ý quan trọng</p>
            <p>
              Nhằm tránh rủi ro mạo danh và lừa đảo, chúng tôi khuyến nghị Quý khách hàng không chuyển khoản vào bất cứ
              tài khoản cá nhân nào và chỉ thực hiện thanh toán vào các tài khoản chính thức của chúng tôi
            </p>
          </div>
        </div>

        <div className='flex flex-col items-center justify-center'>
          {isUpgrade ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Card
                hoverable
                cover={<img alt='example' src={benefits[0].img} />}
                className='w-full h-full'
                onClick={handleStatistical}
              >
                <Meta title='THỐNG KẾ SỐ LIỆU' className='text-center' />
              </Card>
              <Card
                hoverable
                cover={<img alt='example' src={benefits[1].img} />}
                className='w-full h-full'
                onClick={handleFindCandidate}
              >
                <Meta title='TÌM KIẾM ỨNG VIÊN' className='text-center' />
              </Card>
            </div>
          ) : (
            <>
              <div className='flex flex-col items-center justify-center mb-2'>
                <p className='font-bold text-center'>
                  Bạn chưa có dịch vụ nào trong tài khoản. Hãy nâng cấp tài khoản để có được những dịch vụ tốt hơn.
                </p>
                <div
                  onClick={showModal}
                  className='px-3 py-2 text-white border rounded-md cursor-pointer bg-emerald-500'
                >
                  Nâng cấp tài khoản
                </div>
              </div>
              <div className='flex flex-col items-center justify-center gap-2'>
                <p>Những lợi ích của việc nâng cấp tài khoản</p>
                <div className='flex flex-row items-center justify-center h-full gap-4'>
                  <List
                    className='w-1/2 h-full'
                    bordered
                    dataSource={benefits}
                    renderItem={(item) => (
                      <List.Item style={{ cursor: 'pointer' }} onMouseEnter={() => handleMouseEnter(item.img)}>
                        {item.text}
                      </List.Item>
                    )}
                  />
                  {/* Hình ảnh hiển thị */}
                  <div className='flex items-center justify-center w-1/2 h-full'>
                    <Image
                      src={selectedBenefit}
                      alt='Benefit Image'
                      fallback='path-to-fallback-image.jpg' // Sử dụng hình ảnh mặc định khi link bị lỗi
                      style={{ height: '250px' }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal
        title='Nâng cấp tài khoản'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText='Thanh toán'
        cancelText='Hủy bỏ'
        cancelButtonProps={{ style: { backgroundColor: 'transparent' } }}
      >
        <div className='flex flex-col gap-2'>
          <p className='text-center'>
            <strong>Thông tin chi tiết gói dịch vụ</strong>
          </p>
          <ul>
            <li>
              <strong>Chi phí:</strong> 600.000đ/tháng
            </li>
            <li>
              <strong>Thời gian sử dụng:</strong> 1 tháng kể từ ngày đăng ký ({formattedStartDate} - {formattedEndDate})
            </li>
          </ul>
          <p>
            Sau khi nhấn vào <strong>Thanh toán</strong>, bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất.
          </p>
          <div>
            <strong>Lưu ý:</strong> Vui lòng không chuyển khoản vào bất kỳ tài khoản cá nhân nào để tránh rủi ro mạo
            danh và lừa đảo.
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default RecMyService
