import React from 'react'
import { Table, Tabs, Pagination } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const { TabPane } = Tabs

interface DataType {
  _id: string
  stt: number
  companyName: string
  field: string[]
  name: string
  premiumAccount: boolean
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

function CompanyTableComponent({
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
  const handlePageChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize // Sử dụng pageSize hiện tại nếu size không được cung cấp
    setCurrentPage(page)
    setPageSize(newPageSize)
    fetchDataByTab(activeTabKey, page, newPageSize) // Gọi fetchDataByTab với các tham số được update
  }

  const rowClassName = (record: DataType) => (record.premiumAccount ? 'bg-yellow-100 font-bold ' : '')

  return (
    <Tabs defaultActiveKey='1' onChange={(activeKey) => fetchDataForTab(activeKey, currentPage, pageSize)}>
      <TabPane tab='Công ty đang hiển thị' key='1'>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={activeData}
          size='middle'
          rowClassName={rowClassName}
          pagination={{ current: currentPage, pageSize: pageSize, onChange: handlePageChange, total: totalElement }}
        />
      </TabPane>
      <TabPane tab='Công ty chưa duyệt' key='2'>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={activeData}
          size='middle'
          rowClassName={rowClassName}
          pagination={{ current: currentPage, pageSize: pageSize, onChange: handlePageChange, total: totalElement }}
        />
      </TabPane>
      <TabPane tab='Công ty không duyệt' key='3'>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={activeData}
          size='middle'
          rowClassName={rowClassName}
          pagination={{ current: currentPage, pageSize: pageSize, onChange: handlePageChange, total: totalElement }}
        />
      </TabPane>
    </Tabs>
  )
}

export default CompanyTableComponent
