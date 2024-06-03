import React from 'react'
import { ArrowLeftOutlined, FileExcelOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Card, Statistic, Row, Col } from 'antd'

function RecStatistical() {
  const navigate = useNavigate()
  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='w-full border rounded-xl border-zinc-100'>
      <div className='flex items-center justify-center gap-5 p-2 rounded-tl-lg bg-slate-200 rounded-tr-xl'>
        <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer' }} className='font-bold' />
        <h6 className='flex-1 text-lg font-semibold uppercase'>THỐNG KÊ SỐ LIỆU</h6>
      </div>
      <div className='p-4'>
        <Row gutter={16}>
          <Col span={8}>
            <Card style={{ backgroundColor: '#F6AD55' }}>
              <Statistic title={<span className='font-bold'>Tin tuyển dụng hiển thị</span>} value={1} />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ backgroundColor: '#68D391' }}>
              <Statistic title={<span className='font-bold'>CV tiếp nhận</span>} value={1} />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{ backgroundColor: '#63B3ED' }}>
              <Statistic title={<span className='font-bold'>CV ứng tuyển mới</span>} value={1} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default RecStatistical
