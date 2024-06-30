import classNames from 'classnames'
import qs from 'query-string'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/hooks'
import { useTokenAuthorize } from '../../hooks/useTokenAuthorize'
import Container from '../Container/Container'
import LoadSpinner from '../LoadSpinner/LoadSpinner'
import MobileNavbar from './MobileNavbar'
import NavbarUserLoggedInCard from './NavbarUserLoggedInCard'
import type { MenuProps } from 'antd'
import { Dropdown, Space, Spin } from 'antd'
import './styles/Navbar.css'
import { AcademicCapIcon, UserIcon } from '@heroicons/react/24/outline'
import _ from 'lodash'

export default function Navbar() {
  useTokenAuthorize()

  const { items } = useAppSelector((app) => app.Navbar)
  const { isLoggedIn, loading, user } = useAppSelector((app) => app.Auth)
  const [updatedLeftMenu, setUpdatedLeftMenu] = useState([...items])

  const navigate = useNavigate()

  const { pathname: currentPathname } = useLocation()

  const [compiledQuerySearch, setCompiledQuerySearch] = useState(qs.stringify({}))

  const itemsSignUp = [
    {
      label: (
        <Link to={'/auth/rec-signup'} className='flex items-center gap-2'>
          <UserIcon className='w-4 h-4' />
          <p>Nhà tuyển dụng</p>
        </Link>
      ),
      key: '0'
    },
    {
      label: (
        <Link to={'/auth/signup'} className='flex items-center gap-2'>
          <AcademicCapIcon className='w-4 h-4' />
          <p>Người tìm việc</p>
        </Link>
      ),
      key: '1'
    }
  ]

  useEffect(() => {
    setCompiledQuerySearch(
      qs.stringify(
        currentPathname.includes(`/auth/login`) ||
          currentPathname.includes(`/logout`) ||
          currentPathname.includes(`/otp`) ||
          currentPathname.includes('/email')
          ? {}
          : { from: currentPathname }
      )
    )
  }, [currentPathname])

  return (
    <div className={`navbar-header`}>
      {/* Small width devices */}
      <MobileNavbar />

      <Container>
        {/* Desktop */}
        <div className={classNames(`navbar-container hidden`, `py-4`, `sm:flex flex-row items-center`)}>
          {/* Icons */}
          <div className={classNames(`flex flex-row items-center gap-12 flex-1`)}>
            <Link to='/' className={classNames(`font-bold text-3xl`, `text-zinc-900`)}>
              <img
                className='w-[200px] object-contain'
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTa8VWD-dY_v40WgvdmLaV-PnmXRElQGjVdxYk_bEp3&s'
                alt=''
              />
            </Link>
            <ul className='hidden md:block'>
              <li className={classNames(`flex flex-row gap-12`, `font-semibold`)}>
                {updatedLeftMenu.map((item) => {
                  return (
                    <Link
                      to={item.url}
                      key={item.name}
                      className={classNames(
                        `py-4`,
                        `text-zinc-400 hover:text-zinc-600`,
                        ` transition-colors ease-in-out `
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </li>
            </ul>
          </div>

          {/* Right items */}
          {loading === 'pending' ? (
            <Spin className='text-zinc-400' />
          ) : loading === `success` ? (
            !isLoggedIn ? (
              <div className={classNames(`flex flex-row gap-4`)}>
                <Link
                  to={`/auth/login?${compiledQuerySearch}`}
                  className={classNames(
                    `px-3 py-2`,
                    `bg-emerald-500 text-white hover:bg-emerald-700`,
                    `font-semibold`,
                    `rounded-xl`
                  )}
                >
                  Đăng nhập
                </Link>
                <Dropdown menu={{ items: itemsSignUp }} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space
                      className={classNames(
                        `px-3 py-2`,
                        `border-emerald-500 border text-emerald-500`,
                        `font-semibold`,
                        `rounded-xl`
                      )}
                    >
                      Đăng ký
                    </Space>
                  </a>
                </Dropdown>
              </div>
            ) : (
              <NavbarUserLoggedInCard />
            )
          ) : (
            // Failed
            <div className={classNames(`flex flex-row gap-4`)}>
              <Link
                to='/auth/login'
                className={classNames(
                  `px-3 py-2`,
                  `bg-emerald-500 text-white hover:bg-emerald-700`,
                  `font-semibold`,
                  `rounded-xl`
                )}
              >
                Đăng nhập
              </Link>
              <Dropdown menu={{ items: itemsSignUp }} trigger={['click']}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space
                    className={classNames(
                      `px-3 py-2`,
                      `border-emerald-500 border text-emerald-500 cursor-pointer`,
                      `font-semibold`,
                      `rounded-xl`
                    )}
                  >
                    Đăng ký
                  </Space>
                </a>
              </Dropdown>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
