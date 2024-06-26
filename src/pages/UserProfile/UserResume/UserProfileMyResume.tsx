import classNames from 'classnames'
import Search, { SearchProps } from 'antd/es/input/Search'
import { Button, List, Modal, Pagination, Table, TableColumnsType } from 'antd'
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline'
import CandidateCardCV from '../../../components/CandidateCard/CandidateCardCV'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AuthService } from '../../../services/AuthService'
import { ResumeResponse } from '../../../types/resume.type'
import { Spin } from 'antd'
import { toast } from 'react-toastify'
import resume_image_1 from '../../../../images/resume_1.png'
import resume_image_2 from '../../../../images/resume_2.jpg'
import resume_image_3 from '../../../../images/resume_3.png'

interface ResumeTemp {
  id: string
  name: string
  image: string
}

export default function UserProfileMyResume() {
  const navigate = useNavigate()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [activeData, setActiveData] = useState<ResumeResponse[]>([])
  const [totalElement, setTotalElement] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [templateList, setTemplateList] = useState<ResumeTemp[]>([
    {
      id: '1',
      name: 'Mẫu CV 1',
      image: resume_image_1
    },
    {
      id: '2',
      name: 'Mẫu CV 2',
      image: resume_image_2
    },
    {
      id: '3',
      name: 'Mẫu CV 3',
      image: resume_image_3
    }
  ])

  const selectTemplate = (id: string) => {
    setSelectedTemplateId(id)
  }

  useEffect(() => {
    fetchListResume(currentPage, pageSize, searchTerm)
  }, [currentPage, pageSize])

  const fetchListResume = async (page: number, limit: number, searchTerm: string) => {
    setLoading(true)
    const params = { name: searchTerm, page, limit }
    try {
      const response = await AuthService.getListResume(params)
      if (response && response.data) {
        const data = response.data.metadata.listResume
        const total = response.data.metadata.totalElement
        setActiveData(data)
        setTotalElement(total)
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page)
    setPageSize(pageSize)
    fetchListResume(page, pageSize, searchTerm)
  }

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    setSearchTerm(value)
    setCurrentPage(1)
    fetchListResume(1, pageSize, value)
  }

  const showModal = () => {
    if (templateList.length > 0) {
      setSelectedTemplateId(templateList[0].id)
    }
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    if (selectedTemplateId) {
      navigate(`/profile/resume/add?templateId=${selectedTemplateId}`)
    } else {
      toast.error('Vui lòng chọn một mẫu CV trước khi tiếp tục!')
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div className={classNames(`flex-1 flex flex-col gap-4`)}>
      <div className='p-4 border rounded-xl border-zinc-100'>
        <div className='flex items-center justify-between pb-4 border-b border-b-zinc-200'>
          <h1 className={classNames(`font-semibold text-xl pt-2`)}>Danh sách CV</h1>
          <div className='flex items-center gap-2'>
            <Search placeholder='Tìm kiếm' onSearch={onSearch} enterButton />
            <Button type='primary' className={'flex items-center gap-1'} onClick={showModal}>
              <PlusIcon className='w-4 h-4 text-white' />
              Thêm mới
            </Button>
          </div>
        </div>

        <Spin spinning={loading} size='large' className='mt-5'>
          <div className='flex flex-col gap-3 p-2 mt-2'>
            {!loading && activeData.length === 0 ? (
              <div className='flex items-center justify-center'>Hiện tại chưa có cv nào!</div>
            ) : (
              activeData.map((resume) => <CandidateCardCV resume={resume} key={resume._id} />)
            )}
          </div>
        </Spin>

        <div className='flex items-center justify-end mt-2'>
          <Pagination current={currentPage} pageSize={pageSize} total={totalElement} onChange={handlePageChange} />
        </div>
      </div>
      <Modal
        title='Chọn mẫu CV'
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width='80%'
        style={{ top: 20 }}
        okText='Chọn'
        cancelText='Hủy'
      >
        <div className='flex items-center justify-center gap-2'>
          {templateList.map((item) => (
            <div
              className={`w-full px-4 mb-8 md:w-1/3 ${selectedTemplateId === item.id ? 'border border-emerald-500' : ''}`} // Thêm độ chọn cho item được chọn
              key={item.id}
              onClick={() => selectTemplate(item.id)}
              style={{ cursor: 'pointer' }}
            >
              <p>{item.name}</p>
              <img src={item.image} alt={item.name} style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}
