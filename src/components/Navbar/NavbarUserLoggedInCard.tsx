import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { prepareCandidateProvider, prepareInterviewerProvider, prepareOtherProvider } from '../../utils/NavigateMenu'
import DummyAvatar from '../DummyAvatar/DummyAvatar'
import { setNavbarMenu } from '../../redux/reducer/NavbarSlice'
import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space } from 'antd'

export default function NavbarUserLoggedInCard() {
  const { menu } = useAppSelector((app) => app.Navbar)
  const { loading, user } = useAppSelector((app) => app.Auth)

  const dispatch = useAppDispatch()
  const [dropdownItemList, setDropdownItemList] = useState<any[]>([])

  console.log(dropdownItemList)

  useEffect(() => {
    if (loading === 'success' && user) {
      const supplierDropdownItem =
        user.role === 'CANDIDATE'
          ? prepareCandidateProvider()
          : user.role === 'INTERVIEWER'
          ? prepareInterviewerProvider()
          : prepareOtherProvider()
      setDropdownItemList(supplierDropdownItem)
    }
  }, [loading, user])

  const handleOnExpandNavbarMenuDropdown = () => {
    dispatch(setNavbarMenu({ ...menu, visible: true }))
  }

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

  return (
    <div className='flex items-center justify-center gap-2'>
      <Dropdown menu={{ items: newItems }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <div className={classNames('flex items-center gap-3')} onClick={handleOnExpandNavbarMenuDropdown}>
              <span
                className={classNames(`py-4`, `text-zinc-400 hover:text-zinc-600`, ` transition-colors ease-in-out `)}
              >
                {user?.fullName}
              </span>
              {!user?.avatar || user?.avatar === null ? (
                <DummyAvatar iconClassName='text-xl' />
              ) : (
                <img
                  className='inline-block rounded-full w-9 h-9 ring-2 ring-white'
                  src={user?.avatar || ''}
                  alt={`${user?.fullName}'s avatar`}
                />
              )}
            </div>
          </Space>
        </a>
      </Dropdown>
    </div>
  )
}
