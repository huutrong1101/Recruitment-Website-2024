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
import './styles/Navbar.css'

export default function Navbar() {
  useTokenAuthorize()

  const { items } = useAppSelector((app) => app.Navbar)
  const { isLoggedIn, loading, user } = useAppSelector((app) => app.Auth)
  const [updatedLeftMenu, setUpdatedLeftMenu] = useState([...items])

  const navigate = useNavigate()

  const { pathname: currentPathname } = useLocation()

  const [compiledQuerySearch, setCompiledQuerySearch] = useState(qs.stringify({}))

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
              <img src='https://fptjobs.com/public/img/1531190552-Logo-Career-Black.png' alt='' />
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
            <LoadSpinner className='text-zinc-400' />
          ) : loading === `success` ? (
            !isLoggedIn ? (
              <div className={classNames(`flex flex-row gap-4`)}>
                <Link
                  to={`/auth/login?${compiledQuerySearch}`}
                  className={classNames(
                    `px-3 py-2`,
                    `bg-orange text-white hover:bg-orange-hover`,
                    `font-semibold`,
                    `rounded-xl`
                  )}
                >
                  Đăng nhập
                </Link>
                <Link
                  to='/auth/signup'
                  className={classNames(`px-3 py-2`, `border-orange border text-orange`, `font-semibold`, `rounded-xl`)}
                >
                  Đăng ký
                </Link>
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
                  `bg-[#f27024] text-white hover:bg-orange-hover`,
                  `font-semibold`,
                  `rounded-xl`
                )}
              >
                Đăng nhập
              </Link>
              <Link
                to='/auth/signup'
                className={classNames(`px-3 py-2`, `border-orange border text-orange`, `font-semibold`, `rounded-xl`)}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
