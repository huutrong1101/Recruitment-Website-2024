import React from 'react'
import { Table, Tabs, Pagination } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const { TabPane } = Tabs

interface DataType {
  key: string
  stt: number
  jobName: string
  jobPosition: string
  expirationDate: string
  applicationProfile: number
  status: string
}

interface JobTableProps {
  isLoading: boolean
  activeData: DataType[]
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

function JobTableComponent({
  isLoading,
  activeData,
  columns,
  currentPage,
  pageSize,
  totalElement,
  activeTabKey,
  setCurrentPage,
  setPageSize,
  fetchDataForTab,
  fetchDataByTab
}: JobTableProps) {
  const handlePageChange = (page: number, size: number | undefined) => {
    const newPageSize = size ?? pageSize // Sử dụng pageSize hiện tại nếu size không được cung cấp
    setCurrentPage(page)
    setPageSize(newPageSize)
    fetchDataByTab(activeTabKey, page, newPageSize) // Gọi fetchDataByTab với các tham số được update
  }

  return (
    <Tabs defaultActiveKey='1' onChange={(activeKey) => fetchDataForTab(activeKey, currentPage, pageSize)}>
      <TabPane tab='Việc làm đang hiển thị' key='1'>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={activeData}
          size='middle'
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            onChange: handlePageChange,
            total: totalElement,
            showSizeChanger: true,
            onShowSizeChange: handlePageChange,
            pageSizeOptions: ['5', '10', '20', '30', '50'],
            locale: { items_per_page: ' / trang' }
          }}
        />
      </TabPane>
      <TabPane tab='Việc làm chưa duyệt' key='2'>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={activeData}
          size='middle'
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            onChange: handlePageChange,
            total: totalElement,
            showSizeChanger: true,
            onShowSizeChange: handlePageChange,
            pageSizeOptions: ['5', '10', '20', '30', '50'],
            locale: { items_per_page: ' / trang' }
          }}
        />
      </TabPane>
      <TabPane tab='Việc làm không duyệt' key='3'>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={activeData}
          size='middle'
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            onChange: handlePageChange,
            total: totalElement,
            showSizeChanger: true,
            onShowSizeChange: handlePageChange,
            pageSizeOptions: ['5', '10', '20', '30', '50'],
            locale: { items_per_page: ' / trang' }
          }}
        />
      </TabPane>
      <TabPane tab='Việc làm sắp hết hạn' key='4'>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={activeData}
          size='middle'
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            onChange: handlePageChange,
            total: totalElement,
            showSizeChanger: true,
            onShowSizeChange: handlePageChange,
            pageSizeOptions: ['5', '10', '20', '30', '50'],
            locale: { items_per_page: ' / trang' }
          }}
        />
      </TabPane>
      <TabPane tab='Việc làm đã hết hạn' key='5'>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={activeData}
          size='middle'
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            onChange: handlePageChange,
            total: totalElement,
            showSizeChanger: true,
            onShowSizeChange: handlePageChange,
            pageSizeOptions: ['5', '10', '20', '30', '50'],
            locale: { items_per_page: ' / trang' }
          }}
        />
      </TabPane>
    </Tabs>
  )
}

export default JobTableComponent
