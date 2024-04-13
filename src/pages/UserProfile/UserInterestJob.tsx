import { Listbox } from '@headlessui/react'
import {
  ArrowDownCircleIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { Button, Input, Table, TableColumnsType } from 'antd'
import Search, { SearchProps } from 'antd/es/input/Search'
import classnames from 'classnames'
import React from 'react'

interface DataType {
  key: React.Key
  index: number
  jobName: string
  jobPosition: string
  companyName: string
  date: string
}

interface Props {
  handleDeleteFavorite: (key: React.Key) => void
  handleNavigateToJobPage: (key: React.Key) => void
}

const columns = (props: Props): TableColumnsType<DataType> => [
  {
    title: 'STT',
    dataIndex: 'index'
  },
  {
    title: 'TÊN CÔNG VIỆC',
    dataIndex: 'jobName'
  },
  {
    title: 'VỊ TRÍ CÔNG VIỆC',
    dataIndex: 'jobPosition'
  },
  {
    title: 'TÊN CÔNG TY',
    dataIndex: 'companyName'
  },
  {
    title: 'NGÀY HẾT HẠN',
    dataIndex: 'date'
  },
  {
    title: 'HÀNH ĐỘNG',
    render: (_, record) => (
      <div className='flex items-center gap-2'>
        <button
          className='p-1 text-white bg-red-500 rounded-md hover:bg-red-700'
          onClick={() => props.handleDeleteFavorite(record.key)}
        >
          <TrashIcon className='w-5 h-5' />
        </button>
        <button
          className='p-1 text-white rounded-md bg-emerald-500 hover:bg-emerald-700'
          onClick={() => props.handleNavigateToJobPage(record.key)}
        >
          <ArrowRightIcon className='w-5 h-5' />
        </button>
      </div>
    )
  }
]

const data: DataType[] = [
  {
    key: '1',
    index: 1,
    jobName: 'Developer',
    jobPosition: 'Software Engineer',
    companyName: 'ABC Company',
    date: '2024-04-10'
  },
  {
    key: '2',
    index: 2,
    jobName: 'Designer',
    jobPosition: 'Graphic Designer',
    companyName: 'XYZ Studio',
    date: '2024-04-15'
  },
  {
    key: '3',
    index: 3,
    jobName: 'Manager',
    jobPosition: 'Project Manager',
    companyName: '123 Corporation',
    date: '2024-04-20'
  }
]

function UserInterestJob() {
  const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value)

  const handleDeleteFavorite = (key: React.Key) => {
    // Xử lý logic xóa công việc yêu thích dựa trên key
    console.log('Delete favorite job with key:', key)
  }

  const handleNavigateToJobPage = (key: React.Key) => {
    // Xử lý logic chuyển đến trang công việc dựa trên key
    console.log('Navigate to job page with key:', key)
  }

  return (
    <div className={`px-4 py-4 bg-zinc-100 mt-2 rounded-xl flex flex-col gap-2 flex-1`}>
      <div className={classnames(`flex flex-col gap-4`)}>
        <div className='flex items-center justify-between'>
          <h1 className={classnames(`font-semibold text-2xl pt-2`)}>CÔNG VIỆC QUAN TÂM</h1>

          <div className='flex items-center gap-2'>
            <Search placeholder='Tìm kiếm' onSearch={onSearch} enterButton size='large' />
            <Button type='primary' size='large' className={'flex items-center gap-1'}>
              <TrashIcon className='w-5 h-5' />
              Xóa tất cả
            </Button>
          </div>
        </div>
        <div>
          <Table columns={columns({ handleDeleteFavorite, handleNavigateToJobPage })} dataSource={data} size='middle' />
        </div>
      </div>
    </div>
  )
}

export default UserInterestJob
