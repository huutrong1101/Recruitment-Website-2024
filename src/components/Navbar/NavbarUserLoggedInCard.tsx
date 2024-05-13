import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import {
  prepareCandidateProvider,
  prepareInterviewerProvider,
  prepareOtherProvider,
  prepareRecruiterProvider,
  prepareRecruiterProviderConfirm
} from '../../utils/NavigateMenu'
import DummyAvatar from '../DummyAvatar/DummyAvatar'
import { setNavbarMenu } from '../../redux/reducer/NavbarSlice'
import { BellOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space } from 'antd'

export default function NavbarUserLoggedInCard() {
  const { menu } = useAppSelector((app) => app.Navbar)
  const { loading, recruiter } = useAppSelector((app) => app.Auth)
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)

  const dispatch = useAppDispatch()
  const [dropdownItemList, setDropdownItemList] = useState<any[]>([])

  useEffect(() => {
    if (loading === 'success' && recruiter) {
      const supplierDropdownItem =
        recruiter.role === 'CANDIDATE'
          ? prepareCandidateProvider()
          : recruiter.role === 'RECRUITER'
            ? recruiter.acceptanceStatus !== 'waiting'
              ? prepareRecruiterProviderConfirm()
              : prepareRecruiterProvider()
            : prepareOtherProvider()
      setDropdownItemList(supplierDropdownItem)
    }
  }, [loading, recruiter])

  const handleOnExpandNavbarMenuDropdown = () => {
    dispatch(setNavbarMenu({ ...menu, visible: !menu.visible }))
  }

  useEffect(() => {
    // giả sử sau khi gọi API bạn nhận được số lượng là 4
    setUnreadNotificationsCount(4)
  }, [])

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

  const showNotification = false

  const notifications = [
    { id: 1, content: 'Đây là thông báo thứ nhất' },
    { id: 2, content: 'Thông báo số hai đến rồi' },
    { id: 3, content: 'Wow, bạn đã nhận được thông báo thứ ba!' }
    // thêm các thông báo khác...
  ]

  const notificationContent = (
    <div className='flex flex-col w-64 rounded-none shadow-md bg-slate-50'>
      <div className='p-2 rounded-tl-sm rounded-tr-sm'>
        <p className='pb-2 text-sm font-medium text-center uppercase border-b-2'>THÔNG BÁO</p>
      </div>
      <div className='flex flex-col items-center justify-center px-3 pb-2'>
        {showNotification ? (
          <>
            {notifications.map((notification) => (
              <div key={notification.id} className='w-full p-2 hover:bg-gray-100'>
                {notification.content}
              </div>
            ))}
          </>
        ) : (
          // ))}
          // </div>
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
            <div className='flex items-center justify-center rounded-full w-14 h-14 bg-slate-100'>
              <BellOutlined className='text-xl text-emerald-500' />
              {unreadNotificationsCount > 0 && (
                <span className='absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-600 rounded-full -top-2 -right-2'>
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
                {recruiter?.name}
              </span>
              {!recruiter?.avatar || recruiter?.avatar === null ? (
                <DummyAvatar iconClassName='text-xl' />
              ) : (
                <img
                  className='inline-block rounded-full w-9 h-9 ring-2 ring-white'
                  src={recruiter?.avatar || ''}
                  alt={`${recruiter?.name}'s avatar`}
                />
              )}
            </div>
          </Space>
        </a>
      </Dropdown>
    </div>
  )
}
