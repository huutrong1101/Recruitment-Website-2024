import React, { useState } from 'react'
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  BankOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Breadcrumb, Layout, Menu, theme } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'
import { authLogout } from '../../redux/reducer/AuthSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'

const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, onClick?: () => void): MenuItem {
  return {
    key,
    icon,
    label,
    onClick: onClick
  } as MenuItem
}

function ManagementAppLayout() {
  const { admin, loading } = useAppSelector((app) => app.Auth)

  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(authLogout())
      .unwrap()
      .then(() => {
        navigate('/logout')
        history.replaceState({}, '', '/')
      })
  }

  const items: MenuItem[] = [
    getItem('THỐNG KÊ', '1', <PieChartOutlined />, () => navigate('/admin')),
    getItem('CÔNG VIỆC', '2', <DesktopOutlined />, () => navigate('/admin/manage_jobs')),
    getItem('CÔNG TY', '3', <BankOutlined />, () => navigate('/admin/manage_companies')),
    getItem('ĐĂNG XUẤT', '4', <LogoutOutlined />, handleLogout)
    // getItem('User', 'sub1', <UserOutlined />, [getItem('Tom', '3'), getItem('Bill', '4'), getItem('Alex', '5')]),
    // getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    // getItem('Files', '9', <FileOutlined />)
  ]

  return (
    <div className='flex flex-col'>
      <Layout hasSider className='management-app-layout'>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className='flex flex-col items-center justify-center p-4'>
            <Avatar size={64} icon={<UserOutlined />} />
            {!collapsed && <div className='mt-2 text-white'>{admin && admin.name}</div>}
          </div>
          <Menu theme='dark' defaultSelectedKeys={['1']} mode='inline' items={items} className='mt-2' />
        </Sider>
        <Layout className='site-layout'>
          <Content style={{ margin: '0 16px' }} className='pt-4 pb-12'>
            <div
              style={{
                padding: 24,
                minHeight: 582,
                background: colorBgContainer,
                borderRadius: borderRadiusLG
              }}
            >
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
        </Layout>
      </Layout>
    </div>
  )
}

export default ManagementAppLayout
