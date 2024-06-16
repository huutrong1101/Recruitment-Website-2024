import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import {
  prepareCandidateProvider,
  prepareOtherProvider,
  prepareRecruiterProvider,
  prepareRecruiterProviderConfirm
} from '../../utils/NavigateMenu'
import DummyAvatar from '../DummyAvatar/DummyAvatar'
import { setNavbarMenu } from '../../redux/reducer/NavbarSlice'
import { BellOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space } from 'antd'
import { UserService } from '../../services/UserService'
import { RecService } from '../../services/RecService'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

interface Notification {
  _id: string
  title: string
  content: string
  link: string
  isRead: boolean
  createdAt: string
}

export default function NavbarUserLoggedInCard() {
  const { menu } = useAppSelector((app) => app.Navbar)
  const { loading, recruiter, user } = useAppSelector((app) => app.Auth)
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationLink, setNotificationLink] = useState('')

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [dropdownItemList, setDropdownItemList] = useState<any[]>([])

  const loggedInUser = user || recruiter

  useEffect(() => {
    if (loading === 'success' && loggedInUser) {
      const supplierDropdownItem = user
        ? prepareCandidateProvider()
        : recruiter
          ? recruiter.acceptanceStatus !== 'waiting'
            ? prepareRecruiterProviderConfirm()
            : prepareRecruiterProviderConfirm()
          : prepareOtherProvider()
      setDropdownItemList(supplierDropdownItem)
    }
  }, [loading, loggedInUser])

  useEffect(() => {
    if (notificationLink) {
      navigate(notificationLink)
      setNotificationLink('')
    }
  }, [notificationLink, navigate])

  const handleOnExpandNavbarMenuDropdown = () => {
    dispatch(setNavbarMenu({ ...menu, visible: !menu.visible }))
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        const response = await UserService.getListNotification()
        setNotifications(response.data.metadata.listNotification)
        setUnreadNotificationsCount(
          response.data.metadata.listNotification.filter((notification: any) => !notification.isRead).length
        )
      } else if (recruiter) {
        const response = await RecService.getListNotification()
        setNotifications(response.data.metadata.listNotification)
        setUnreadNotificationsCount(
          response.data.metadata.listNotification.filter((notification: any) => !notification.isRead).length
        )
      }
    }

    if (loggedInUser) {
      fetchNotifications()
    }
  }, [loggedInUser, navigate])

  const newItems = dropdownItemList.map((item) => ({
    label: (
      <Link to={item.url} key={item.url} className={classNames('group flex flex-row items-center gap-4')}>
        <span className={classNames(`group-hover:text-emerald-500`, `transition-colors ease-in-out duration-100`)}>
          {item.icon}
        </span>
        <span
          className={classNames(
            `group-hover:text-emerald-500 font-semibold`,
            `transition-colors ease-in-out duration-100`
          )}
        >
          {item.text}
        </span>
      </Link>
    ),
    key: item.url
  }))

  const formatTimeAgo = (dateString: string) => {
    const now = moment()
    const then = moment(dateString, 'DD/MM/YYYY HH:mm:ss')
    const minutesDiff = now.diff(then, 'minutes')
    const hoursDiff = now.diff(then, 'hours')

    if (minutesDiff < 60) {
      return `${minutesDiff} phút trước`
    } else if (hoursDiff < 24) {
      return `${hoursDiff} giờ trước`
    } else {
      return then.fromNow()
    }
  }

  const handleNotificationClick = async (notificationId: string, fullUrl: string) => {
    try {
      const url = new URL(fullUrl)
      const pathname = url.pathname

      setNotifications((prevNotifications) => {
        return prevNotifications.map((notification) => {
          if (notification._id === notificationId) {
            return { ...notification, isRead: true }
          }
          return notification
        })
      })

      setUnreadNotificationsCount((prevCount) => prevCount - 1)

      if (user) {
        await UserService.markNotificationAsRead(notificationId)
      } else if (recruiter) {
        await RecService.markNotificationAsRead(notificationId)
      }

      navigate(pathname)
    } catch (error) {
      console.error('Error when marking notification as read', error)
    }
  }

  const notificationContent = (
    <div className='flex flex-col w-64 rounded-none shadow-md bg-slate-50'>
      <div className='p-2 rounded-tl-sm rounded-tr-sm'>
        <p className='pb-2 text-sm font-medium text-center uppercase border-b-2'>THÔNG BÁO</p>
      </div>
      <div className='flex flex-col items-start justify-start px-3 pb-2 overflow-y-auto max-h-[360px] scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-slate-400'>
        {notifications ? (
          <>
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className='flex flex-col w-full p-2 border-b cursor-pointer hover:bg-gray-200'
                onClick={() => handleNotificationClick(notification._id, notification.link)}
              >
                <p className='text-sm font-bold text-black'>{notification.title}</p>
                <span>{notification.content}</span>
                <div className='flex items-center justify-between'>
                  <span>{formatTimeAgo(notification.createdAt)}</span>
                  <span>{notification.isRead ? 'Đã đọc' : 'Chưa đọc'}</span>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div>Bạn chưa có thông báo nào</div>
        )}
      </div>
    </div>
  )

  return (
    <div className='flex items-center justify-center gap-3'>
      <Dropdown overlay={notificationContent} trigger={['click']} placement='bottomRight'>
        <a onClick={(e) => e.preventDefault()}>
          <div className='relative'>
            <div className='flex items-center justify-center rounded-full cursor-pointer w-14 h-14 bg-slate-100'>
              <BellOutlined className='text-xl text-emerald-500' />
              {unreadNotificationsCount > 0 && (
                <span className='absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-600 rounded-full -top-1 -right-1'>
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
          </div>
        </a>
      </Dropdown>
      <Dropdown menu={{ items: newItems }} trigger={['click']} placement='bottomRight'>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <div
              className={classNames('flex items-center gap-3 rounded-lg px-3 bg-slate-100')}
              onClick={handleOnExpandNavbarMenuDropdown}
            >
              <span
                className={classNames(`py-4`, `text-zinc-400 hover:text-zinc-600`, ` transition-colors ease-in-out `)}
              >
                {loggedInUser?.name}
              </span>
              {!loggedInUser?.avatar || loggedInUser?.avatar === null ? (
                <DummyAvatar iconClassName='text-xl' />
              ) : (
                <img
                  className='inline-block rounded-full w-9 h-9 ring-2 ring-white'
                  src={loggedInUser?.avatar || ''}
                  alt={`${loggedInUser?.name}'s avatar`}
                />
              )}
            </div>
          </Space>
        </a>
      </Dropdown>
    </div>
  )
}
