import { Table, Tabs } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import TabPane from 'antd/es/tabs/TabPane'

interface DataType {
  key: string
  stt: number
  thumbnail: string
  type: string
  name: string
  createdAt: string
}

interface NewTableProps {
  isLoading: boolean
  listNews: DataType[]
  columns: ColumnsType<DataType>
  currentPage: number
  pageSize: number
  totalElement: number
  activeTabKey: string
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  fetchDataForTab: (activeKey: string, currentPage: number, pageSize: number) => void
  fetchDataByTab: (activeKey: string, currentPage: number, pageSize: number) => void
}

function NewTableComponent({
  isLoading,
  listNews,
  columns,
  currentPage,
  pageSize,
  totalElement,
  activeTabKey,
  setCurrentPage,
  setPageSize,
  fetchDataForTab,
  fetchDataByTab
}: NewTableProps) {
  const handlePageChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize
    setCurrentPage(page)
    setPageSize(newPageSize)
    fetchDataByTab(activeTabKey, page, newPageSize)
  }
  return (
    <Tabs defaultActiveKey='1' onChange={(activeKey) => fetchDataForTab(activeKey, currentPage, pageSize)}>
      <TabPane tab='Bài viết làm đang hiển thị' key='1'>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={listNews}
          size='middle'
          pagination={{ current: currentPage, pageSize: pageSize, onChange: handlePageChange, total: totalElement }}
        />
      </TabPane>
      <TabPane tab='Bài viết không được hiển thị' key='2'>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={listNews}
          size='middle'
          pagination={{ current: currentPage, pageSize: pageSize, onChange: handlePageChange, total: totalElement }}
        />
      </TabPane>
    </Tabs>
  )
}

export default NewTableComponent
