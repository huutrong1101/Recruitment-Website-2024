import React, { useState, useEffect } from 'react'
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  LogoutOutlined,
  BankOutlined,
  FileOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Avatar, Breadcrumb, Layout, Menu, theme } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { authLogout } from '../../redux/reducer/AuthSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { AdminService } from '../../services/AdminService'

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
  const { admin } = useAppSelector((app) => app.Auth)
  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    AdminService.getTotalCandidate(dispatch)
    AdminService.getTotalRecruiter(dispatch)
    AdminService.getTotalJob(dispatch)
  }, [])

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
    getItem('CÔNG TY', '2', <BankOutlined />, () => navigate('/admin/manage_companies')),
    getItem('CÔNG VIỆC', '3', <DesktopOutlined />, () => navigate('/admin/manage_jobs')),
    getItem('TIN TỨC', '4', <FileOutlined />, () => navigate('/admin/manage_news')),
    getItem('ĐĂNG XUẤT', '5', <LogoutOutlined />, handleLogout)
  ]

  const getDefaultSelectedKey = () => {
    if (location.pathname.startsWith('/admin/manage_companies')) {
      return '2' // Chọn CÔNG TY
    } else if (location.pathname.startsWith('/admin/manage_jobs')) {
      return '3' // Chọn CÔNG TY
    } else if (location.pathname.startsWith('/admin/manage_news')) {
      return '4' // Chọn CÔNG TY
    } else {
      switch (location.pathname) {
        case '/admin':
          return '1'
        case '/admin/manage_jobs':
          return '2'
        case '/admin/manage_news':
          return '4'
        default:
          return '1'
      }
    }
  }

  return (
    <div className='flex flex-col'>
      <Layout hasSider className='management-app-layout'>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className='flex flex-col items-center justify-center p-4'>
            <Avatar size={64} icon={<UserOutlined />} />
            {!collapsed && <div className='mt-2 text-white'>{admin && admin.name}</div>}
          </div>
          <Menu theme='dark' selectedKeys={[getDefaultSelectedKey()]} mode='inline' items={items} className='mt-2' />
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
          <Footer style={{ textAlign: 'center' }}>HỆ THỐNG TUYỂN DỤNG CAREERHUB</Footer>
        </Layout>
      </Layout>
    </div>
  )
}

export default ManagementAppLayout
