import React from 'react'
import { Button, Input, Select, Table, Tooltip } from 'antd'
import { SearchOutlined, EyeOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { Cog6ToothIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom'

interface News {
  key: string
  image: string
  category: string
  title: string
  date: string
}

function AdminManageNews() {
  const navigate = useNavigate()

  const optionTypeNews = [
    { value: '1', label: 'Định hướng nghề nghiệp' },
    { value: '2', label: 'Bí kíp tìm việc' },
    { value: '3', label: 'Chế độ lương thưởng' },
    { value: '4', label: 'Kiến thức chuyên ngành' }
  ]

  const newsData: News[] = [
    {
      key: '1',
      image:
        'https://cdn-new.topcv.vn/unsafe/300x/https://static.topcv.vn/cms/front%20end%20developer%2002.jpg612f8b6feecca.jpg',
      category: 'Định hướng nghề nghiệp',
      title: 'Lương IT một tháng bao nhiêu? Khám phá mức lương ngành IT chi tiết',
      date: '2022-01-01'
    },
    {
      key: '2',
      image:
        'https://cdn-new.topcv.vn/unsafe/300x/https://static.topcv.vn/cms/topcv-phien-dich-vien-tieng-han-4.jpg6389717e20caf.jpg',
      category: 'Định hướng nghề nghiệp',
      title: 'Khám phá mức lương của phiên dịch viên tiếng Hàn',
      date: '2022-01-01'
    },
    {
      key: '3',
      image:
        'https://cdn-new.topcv.vn/unsafe/300x/https://static.topcv.vn/cms/successful-2668386_1280.jpg60dd758302f38.jpg',
      category: 'Định hướng nghề nghiệp',
      title: 'Tìm hiểu chính sách lương thưởng cho nhân viên kinh doanh',
      date: '2022-01-01'
    }
  ]

  const columns: ColumnsType<News> = [
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index: number) => `${index + 1}`
    },
    {
      title: 'Hình ảnh bài viết',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => <img src={image} alt='Hình ảnh bài viết' className='object-cover w-24 h-24' />
    },
    {
      title: 'Loại bài viết',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: 'Tiêu đề bài viết',
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <div className='w-40 truncate'>{title}</div>
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record: News) => (
        <span className='flex items-center justify-center gap-2'>
          <Tooltip placement='topRight' title='Xem chi tiết'>
            <Link to={`/admin/manage_news/${record.key}`}>
              <Button onClick={() => console.log('Xem chi tiết', record.key)}>
                <PencilSquareIcon className='w-4 h-4' />
              </Button>
            </Link>
          </Tooltip>
          <Tooltip placement='topRight' title='Xóa bài viết'>
            <Button danger onClick={() => console.log('Xóa', record.key)} style={{ backgroundColor: 'transparent' }}>
              <TrashIcon className='w-4 h-4' />
            </Button>
          </Tooltip>
        </span>
      )
    }
  ]

  const handleNavigate = () => {
    navigate('/admin/manage_news/addNew')
  }

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='flex-1 text-2xl font-semibold text-center'>Quản lí danh sách công ty trong hệ thống</h1>
        <Button type='primary' icon={<PlusCircleOutlined />} onClick={handleNavigate}>
          Tạo công ty
        </Button>
      </div>
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex w-full gap-3'>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder='Loại bài viết'
              optionFilterProp='label'
              filterOption={(input, option) =>
                option ? option.label.toLowerCase().includes(input.toLowerCase()) : false
              }
              options={optionTypeNews}
            />
            <Input placeholder='Nhập tên bài viết' className='w-1/2' />
          </div>
          <div className='flex items-center gap-3'>
            <Button type='primary' icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
            <Button danger style={{ backgroundColor: 'transparent' }}>
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </div>
      <Table columns={columns} dataSource={newsData} />
    </div>
  )
}

export default AdminManageNews
