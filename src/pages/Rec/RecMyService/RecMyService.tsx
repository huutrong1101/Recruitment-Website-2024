import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { ExclamationOutlined } from '@ant-design/icons'
import { List, Image, Modal, message, Card, Spin, RadioChangeEvent, Radio, Input } from 'antd'
import moment from 'moment'
import axiosInstance from '../../../utils/AxiosInstance'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { checkRecUpgrade } from '../../../redux/reducer/RecSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { RecService } from '../../../services/RecService'

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

const packages = [
  { id: 1, duration: '1 tháng', durationInMonths: 1, price: '600.000đ', discountedPrice: '600.000đ' },
  { id: 2, duration: '3 tháng', durationInMonths: 3, price: '1.800.000đ', discountedPrice: '1.500.000đ' },
  { id: 3, duration: '6 tháng', durationInMonths: 6, price: '3.600.000đ', discountedPrice: '3.000.000đ' }
]

const cancelReasons = [
  { id: 'Giá quá cao', text: 'Giá quá cao' },
  { id: 'Không hài lòng với dịch vụ', text: 'Không hài lòng với dịch vụ' },
  { id: 'Đã tìm được ứng viên', text: 'Đã tìm được ứng viên' },
  { id: 4, text: 'Khác' }
]

interface ServiceInfor {
  validTo: string
  remainDate: number
  refundAmount: string
}

function RecMyService() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { recruiter } = useAppSelector((app) => app.Auth)
  const [selectedPackage, setSelectedPackage] = useState<number>(1) // Giả sử gói mặc định là 1 tháng
  const [startDate, setStartDate] = useState(moment())
  const [endDate, setEndDate] = useState(moment().add(1, 'month'))

  const [selectedBenefit, setSelectedBenefit] = useState<string>(benefits[0].img)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { isUpgrade } = useAppSelector((state) => state.RecJobs)

  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [otherReasonError, setOtherReasonError] = useState(false)

  const [selectedCancelReason, setSelectedCancelReason] = useState<number | null>(null)
  const [otherCancelReason, setOtherCancelReason] = useState<string>('')

  const [serviceInfo, setServiceInfo] = useState<ServiceInfor>()

  useEffect(() => {
    const fetchData = async () => {
      if (!recruiter) {
        return
      }

      setLoading(true)

      try {
        await dispatch(checkRecUpgrade()).unwrap()

        if (isUpgrade) {
          const response = await RecService.viewOrder()
          setServiceInfo(response.data.metadata)
        }
      } catch (error) {
        toast.error('Loading failed')
        console.error('Error loading data:', error)
      } finally {
        // Đảm bảo setLoading false ở đây để ngăn chặn hiện tượng loading quay vô tận
        setLoading(false)
      }
    }

    fetchData()
  }, [recruiter, dispatch])

  const handleMouseEnter = (img: string) => {
    setSelectedBenefit(img)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const values = {
        orderType: 'billpayment',
        language: 'vn',
        premiumPackage: packages[selectedPackage - 1].duration
      }
      const response = await RecService.createPayment(values)

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
    const reasonCancel = selectedCancelReason === 4 ? otherCancelReason : selectedCancelReason

    if (selectedCancelReason === 4 && !otherCancelReason.trim()) {
      setOtherReasonError(true)
    } else {
      if (reasonCancel !== null) {
        const reason = String(reasonCancel)
        toast
          .promise(RecService.cancelOrder(reason), {
            pending: `Gói dịch vụ đang được hủy`,
            success: `Đã hủy gói dịch vụ thành công`,
            error: 'Có lỗi xảy ra trong quá trình hủy gói dịch vụ'
          })
          .then(() => {
            setIsCancelModalVisible(false)

            dispatch(checkRecUpgrade()).unwrap()
          })
          .catch((error) => {
            toast.error(error.response.data.message)
          })
      } else {
        toast.error('Vui lòng chọn lý do hủy gói dịch vụ')
      }
    }
  }

  const handleCancelCancel = () => setIsCancelModalVisible(false)

  const showDetailModal = () => setIsDetailModalVisible(true)
  const handleDetailClose = () => setIsDetailModalVisible(false)

  const handleFindCandidate = () => {
    navigate('/recruiter/profile/service/findCandidate')
  }

  const handleStatistical = () => {
    navigate('/recruiter/profile/service/statistical')
  }

  const handlePackageChange = (e: RadioChangeEvent) => {
    const pkgId = e.target.value
    const selectedPkg = packages.find((pkg) => pkg.id === pkgId)

    if (selectedPkg) {
      setSelectedPackage(pkgId)

      setEndDate(moment().add(selectedPkg.durationInMonths, 'months'))
    }
  }

  const handleCancelReasonChange = (e: RadioChangeEvent) => {
    setSelectedCancelReason(e.target.value)
    if (e.target.value !== 4) {
      setOtherCancelReason('')
    }
  }

  const handleOtherCancelReasonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOtherReasonError(false)
    setOtherCancelReason(event.target.value)
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
                okText='Xác nhận'
                cancelText='Hủy'
              >
                <div className='flex flex-col gap-2'>
                  <p>
                    Gói dịch vụ của bạn còn hạn đến <span className='font-bold'>{serviceInfo?.validTo}</span>.
                  </p>
                  <p>
                    Nếu hủy gỏi dịch vụ bạn sẽ được hoàn lại số tiền là{' '}
                    <span className='font-bold'>{serviceInfo?.refundAmount}đ</span> trong thời gian sớm nhất.
                  </p>
                </div>
                <p className='mt-2'>
                  Hãy cho chúng tôi biết lý do hủy gói dịch vụ để chúng tôi có thể cải thiện hơn trong tương lai nhé !
                </p>
                <Radio.Group
                  onChange={handleCancelReasonChange}
                  value={selectedCancelReason}
                  className='flex flex-col gap-2 mt-3 ml-7'
                >
                  {cancelReasons.map((reason) => (
                    <Radio key={reason.id} value={reason.id}>
                      {reason.text}
                    </Radio>
                  ))}
                </Radio.Group>
                {selectedCancelReason === 4 && (
                  <div className='flex flex-col items-center justify-center w-full'>
                    <Input.TextArea
                      style={{ minHeight: '200px', width: '90%', marginTop: '10px' }}
                      value={otherCancelReason}
                      onChange={handleOtherCancelReasonChange}
                      placeholder='Nhập lý do khác'
                    />
                    {otherReasonError && (
                      <p className='mt-2 text-red-500 ml-7'>Vui lòng điền nội dung cho lý do khác.</p>
                    )}
                  </div>
                )}
              </Modal>

              <Modal
                title='Chi tiết gói dịch vụ'
                visible={isDetailModalVisible}
                onCancel={handleDetailClose}
                footer={null}
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

        {serviceInfo && <p className='my-2'>Hạn sử dụng gói dịch vụ của bạn còn đến ngày: {serviceInfo.validTo}</p>}

        <div className='flex flex-col items-center justify-center'>
          {loading ? (
            <Spin size='large' className='mt-3' />
          ) : isUpgrade ? (
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
          <div className='flex flex-col gap-1'>
            <p>Chọn gói sản phẩm: </p>
            <Radio.Group onChange={handlePackageChange} value={selectedPackage} className='flex flex-col ml-5'>
              {packages.map((pkg) => (
                <Radio value={pkg.id} key={pkg.id}>
                  Gói {pkg.duration}: {pkg.discountedPrice}{' '}
                  <del style={{ marginLeft: '10px', color: 'red' }}>
                    {pkg.price !== pkg.discountedPrice ? pkg.price : ''}
                  </del>
                </Radio>
              ))}
            </Radio.Group>
            <p>
              Thời gian ước tính: {startDate.format('DD/MM/YYYY')} - {endDate.format('DD/MM/YYYY')}
            </p>
          </div>
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
