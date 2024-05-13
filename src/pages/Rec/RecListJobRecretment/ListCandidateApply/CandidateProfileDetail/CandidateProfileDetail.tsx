import React, { useState } from 'react'
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Modal, Radio, Timeline } from 'antd'

function CandidateProfileDetail() {
  const navigate = useNavigate()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [approvalStatus, setApprovalStatus] = useState('approve')

  const handleBack = () => {
    navigate(-1)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    console.log(approvalStatus)
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
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
                  <img
                    className='object-cover w-full h-full'
                    src='https://scontent.fhan3-2.fna.fbcdn.net/v/t39.30808-6/383005012_3507763142868958_6312876464459408848_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFG17PJy6F3b6fobFtoyM8mlLTrn7d0lAeUtOuft3SUBwkPTRrokWUBdKsxZpNxECky-ylKwanw_91UodAGvhqz&_nc_ohc=SvtdTYfrmM4Q7kNvgExhvNG&_nc_ht=scontent.fhan3-2.fna&oh=00_AYCFOQbw9P4Yi3Q5193ZreVY1933q8QCZXup5WTsBkFFUQ&oe=6644E778'
                    alt=''
                  />
                </div>
                <div className='flex flex-col w-3/4 gap-2'>
                  <p className='text-base font-medium text-black md:text-sm'>
                    <span className='font-bold'>NGUYỄN HỮU TRỌNG</span>
                  </p>
                  <div className='flex items-center justify-between w-full gap-2'>
                    <div className='flex flex-col gap-3'>
                      <p className='text-xs font-medium text-gray-600 md:text-sm '>
                        <span className='font-bold'>Số điện thoại:</span>{' '}
                        <span className='hover:text-emerald-500'>0773696410</span>
                      </p>
                      <p className='text-xs font-medium text-gray-600 md:text-sm '>
                        <span className='font-bold'>Ngày sinh:</span>{' '}
                        <span className='hover:text-emerald-500'>18/02/2002</span>
                      </p>
                      <p className='text-xs font-medium text-gray-600 md:text-sm '>
                        <span className='font-bold'>Học vấn:</span>{' '}
                        <span className='hover:text-emerald-500'>Đại học</span>
                      </p>
                      <p className='text-xs font-medium text-gray-600 md:text-sm '>
                        <span className='font-bold'>Quê quán:</span>{' '}
                        <span className='hover:text-emerald-500'>Bà Rịa Vũng Tàu</span>
                      </p>
                      <p className='text-xs font-medium text-gray-600 md:text-sm '>
                        <span className='font-bold'>Điểm GPA:</span> <span className='hover:text-emerald-500'>3.2</span>
                      </p>
                    </div>
                    <div className='flex flex-col gap-3'>
                      <p className='text-xs font-medium text-gray-600 md:text-sm '>
                        <span className='font-bold'>Giới tính:</span>{' '}
                        <span className='hover:text-emerald-500'>Nam</span>
                      </p>
                      <p className='text-xs font-medium text-gray-600 md:text-sm '>
                        <span className='font-bold'>Email:</span>{' '}
                        <span className='hover:text-emerald-500'>huutrong1101@gmail.com</span>
                      </p>
                      <p className='text-xs font-medium text-gray-600 md:text-sm '>
                        <span className='font-bold'>Ngành:</span>{' '}
                        <span className='hover:text-emerald-500'>Công nghệ thông tin</span>
                      </p>
                      <p className='text-xs font-medium text-gray-600 md:text-sm '>
                        <span className='font-bold'>Loại hình công việc:</span>{' '}
                        <span className='hover:text-emerald-500'>Toàn thời gian</span>
                      </p>
                      <p className='text-xs font-medium text-gray-600 md:text-sm '>
                        <span className='font-bold'>Trình độ ngoại ngữ:</span>{' '}
                        <span className='hover:text-emerald-500'>TOEIC 640</span>
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
                  <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên trái */}
                  <h2 className='font-bold text-blue-500'>MỤC TIÊU NGHỀ NGHIỆP</h2>
                  <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên phải */}
                </div>
                <div>
                  <p>- Mong muốn gắn bó lâu dài và đóng góp 1 phần nhỏ vào sự thành công và phát triển của công ty</p>
                  <p>- Tinh thần học hỏi trong công việc</p>
                  <p>- Môi trường làm việc phát triển bản thân</p>
                </div>
              </div>

              <div className='flex flex-col w-full gap-2'>
                <div className='flex items-center gap-1'>
                  <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên trái */}
                  <h2 className='font-bold text-blue-500'>GIẢI THƯỞNG / HOẠT ĐỘNG NGOẠI KHÓA / SỞ THÍCH / KHÁC ...</h2>
                  <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên phải */}
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex flex-col'>
                    <p className='text-base font-bold'>KỸ NĂNG VI TÍNH SỞ THÍCH KỸ NĂNG MỀM</p>
                    <p>MS OFFICE</p>
                  </div>
                </div>
              </div>

              <div className='flex flex-col w-full gap-2'>
                <div className='flex items-center gap-1'>
                  <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên trái */}
                  <h2 className='font-bold text-blue-500'>CHỨNG CHỈ / CV / PORTFLIO </h2>
                  <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên phải */}
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex flex-col'>
                    <p className='text-base font-bold'>KỸ NĂNG VI TÍNH SỞ THÍCH KỸ NĂNG MỀM</p>
                    <p>MS OFFICE</p>
                  </div>
                </div>
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
                  <Timeline
                    items={[
                      {
                        children: (
                          <div className='flex flex-col gap-2'>
                            <p className='font-medium text-red-400 uppercase'>
                              ĐẠT HUY CHƯƠNG ĐỒNG CUỘC THI "GIẢI TOÁN QUA INTERNET" DO BỘ GD&ĐT TỔ CHỨC
                            </p>
                            <p>01/01/2022 - 30/12/2022</p>
                          </div>
                        )
                      },
                      {
                        children: (
                          <div className='flex flex-col gap-2'>
                            <p className='font-medium text-red-400 uppercase'>
                              HỌC ĐẠI HỌC SƯ PHẠM KĨ THUẬT TP.HỒ CHÍ MINH, CHUYÊN NGÀNH CÔNG NGHỆ KĨ THUẬT MÁY TÍNH
                            </p>
                            <p>01/01/2022 - 30/12/2022</p>
                          </div>
                        )
                      }
                    ]}
                  />
                </div>
              </div>

              <div className='flex flex-col w-full gap-2'>
                <div className='flex items-center gap-1'>
                  <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên trái */}
                  <h2 className='font-bold text-blue-500'>QUÁ TRÌNH LÀM VIỆC</h2>
                  <div className='flex-1 h-[3px] bg-blue-500'></div> {/* Đường kẻ bên phải */}
                </div>
                <div className='mt-[5px]'>
                  <Timeline
                    items={[
                      {
                        children: (
                          <div className='flex flex-col gap-2'>
                            <p className='font-medium text-red-400 uppercase'>
                              GIỮ CHỨC VỤ UY VIÊN BAN THƯỜNG VỤ ĐOÀN TRƯỜNG DH SPKT TP.HCM (NHIỆM KỲ 2017-2019)
                            </p>
                            <p>01/01/2022 - 30/12/2022</p>
                            <div className='text-gray-400'>
                              <p>Truyền thông và tổ chức sự kiện</p>
                              <p>Tham gia phong trào tình nguyện</p>
                            </div>
                          </div>
                        )
                      },
                      {
                        children: (
                          <div className='flex flex-col gap-2'>
                            <p className='font-medium text-red-400 uppercase'>
                              GIỮ CHỨC VỤ UY VIÊN BAN THƯỜNG VỤ ĐOÀN TRƯỜNG DH SPKT TP.HCM (NHIỆM KỲ 2017-2019)
                            </p>
                            <p>01/01/2022 - 30/12/2022</p>
                            <div className='text-gray-400'>
                              <p>Truyền thông và tổ chức sự kiện</p>
                              <p>Tham gia phong trào tình nguyện</p>
                            </div>
                          </div>
                        )
                      }
                    ]}
                  />
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
        width={450}
      >
        <div className='flex flex-col gap-1'>
          <p>Chọn trạng thái xử lí hồ sơ</p>
          <Radio.Group onChange={(e) => setApprovalStatus(e.target.value)} value={approvalStatus}>
            <Radio value='approve'>Nhận hồ sơ</Radio>
            <Radio value='decline'>Không nhận hồ sơ</Radio>
          </Radio.Group>
          <p className='text-red-500'>
            Lưu ý: Nhận hồ sơ không có nghĩa là tuyển dụng ứng viên. Tiếp theo, nhà tuyển dụng cần liên hệ với ứng viên
            để đặt lịch phỏng vấn
          </p>
        </div>
      </Modal>
    </>
  )
}

export default CandidateProfileDetail
