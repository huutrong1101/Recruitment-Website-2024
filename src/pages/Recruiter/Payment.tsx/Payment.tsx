import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { RiMoonClearLine } from 'react-icons/ri'
import axios from 'axios'
import { RecService } from '../../../services/RecService'
import { Button, Result, Spin } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'

interface Order {
  _id: string
  orderInfo: string
  price: string
  status: string
  createdAt: string
  updatedAt: string
  validTo: string
}

function Payment() {
  const [showing, setShowing] = useState(true)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Order>()
  const [code, setCode] = useState('')

  const navigate = useNavigate()

  const getQueryString = () => {
    const queryString = window.location.search
    return queryString.substring(1)
  }

  const handlePayment = async () => {
    const queryString = getQueryString()
    try {
      setLoading(true)
      setTimeout(async () => {
        const response = await RecService.payment(queryString)
        setData(response.data.metadata.result)
        setCode(response.data.metadata.code)
        setLoading(false)
      }, 2000)
    } catch (error) {
      console.error('Error during payment processing: ', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (window.location.search) {
      handlePayment()
    }
  }, [])

  const handleButtonClick = () => {
    navigate('/recruiter/profile/service')
  }

  return (
    <div className='w-full flex flex-col items-center justify-center min-h-[60vh]'>
      <div
        className={classNames(
          `px-10 py-8 rounded-[35px] w-full md:w-7/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12 border`,

          `flex flex-col shadow-lg`
        )}
      >
        {loading ? (
          <div className='flex flex-col items-center justify-center'>
            <h1 className={classNames(`text-xl font-light leading-10 my-4`)}>Quá trình thanh toán đang được diễn ra</h1>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />
          </div>
        ) : (data && data.status === 'Thất bại') || code !== '00' ? (
          <>
            <Transition
              appear={true}
              show={showing}
              className={`transition-all ease-in-out duration-700 delay-700`}
              enter='transform-gpu opacity-0'
              enterFrom='transform-gpu opacity-0 translate-y-12'
              enterTo='transform-gpu opacity-100 translate-y-0'
            >
              <Result
                status='error'
                title='Thanh toán thất bại'
                subTitle='Có lỗi diễn ra trong quá trình thanh toán. Vui lòng thử lại sau'
                extra={[
                  <Button type='primary' key='console' onClick={handleButtonClick}>
                    Trở về
                  </Button>
                ]}
              />
            </Transition>
          </>
        ) : (
          <>
            <Transition
              appear={true}
              show={showing}
              className={`transition-all ease-in-out duration-700 delay-700`}
              enter='transform-gpu opacity-0'
              enterFrom='transform-gpu opacity-0 translate-y-12'
              enterTo='transform-gpu opacity-100 translate-y-0'
            >
              <Result
                status='success'
                title='THANH TOÁN THÀNH CÔNG'
                subTitle={
                  <div>
                    <p className='font-bold text-center'>THÔNG TIN ĐƠN HÀNG</p>
                    <p>Trạng thái: {data && data.status}</p>
                    <p>Mã đơn hàng: {data && data._id}</p>
                    <p>Tổng số tiền: {data && data.price}đ</p>
                    <p>Thời gian giao dịch: {data && data.createdAt}</p>
                  </div>
                }
                extra={[
                  <Button type='primary' key='console' onClick={handleButtonClick}>
                    Sử dụng dịch vụ
                  </Button>
                ]}
              />
            </Transition>

            {/* <Transition
              show={showing}
              appear={true}
              className={`transition-all ease-in-out duration-700 delay-1000`}
              enter='transform opacity-0'
              enterFrom=' opacity-0 '
              enterTo='opacity-100'
            >
              <div className='flex items-center justify-center w-full'>
                <button
                  onClick={handleButtonClick}
                  className={classNames(
                    `py-3 px-2 border rounded-md text-white bg-emerald-500 mt-8 flex flex-row-reverse`
                  )}
                >
                  SỬ DỤNG DỊCH VỤ NGAY
                </button>
              </div>
            </Transition> */}
          </>
        )}
        {/* Icons */}
      </div>
    </div>
  )
}

export default Payment
