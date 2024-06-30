import { useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Tabs } from 'antd'
import CVStatistics from './CVStatistics'
import JobStatistics from './JobStatistics'

const { TabPane } = Tabs

function RecStatistical() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='w-full border rounded-xl border-zinc-100'>
        <div className='flex items-center justify-center gap-5 p-2 rounded-tl-lg bg-slate-200 rounded-tr-xl'>
          <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer' }} className='font-bold' />
          <h6 className='flex-1 text-lg font-semibold uppercase'>THỐNG KÊ SỐ LIỆU</h6>
        </div>
        <div className='p-4'>
          <Tabs defaultActiveKey='1'>
            <TabPane tab='Thống kê hồ sơ' key='1'>
              <CVStatistics />
            </TabPane>
            <TabPane tab='Thống kê công việc' key='2'>
              <JobStatistics />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default RecStatistical
