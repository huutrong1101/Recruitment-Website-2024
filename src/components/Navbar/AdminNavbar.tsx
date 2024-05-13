import { Fragment } from 'react'
import { Menu, Transition, Popover } from '@headlessui/react'
import { ArrowLeftOnRectangleIcon, Bars3CenterLeftIcon, ChevronDownIcon, PencilIcon } from '@heroicons/react/24/outline'

import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import DummyAvatar from '../DummyAvatar/DummyAvatar'
import { authLogout } from '../../redux/reducer/AuthSlice'

interface AdminNavbarProps {
  showNav: boolean
  setShowNav: (showNav: boolean) => void
}

export default function AdminNavbar({ showNav, setShowNav }: AdminNavbarProps) {
  const { user } = useAppSelector((app) => app.Auth)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(authLogout())
      .unwrap()
      .then(() => {
        history.replaceState({}, '', '/')
      })
  }

  return (
    <div
      className={`absolute z-10 top-0 w-full h-16 flex justify-between items-center transition-all duration-[400ms] bg-black/10 ${
        showNav ? 'pl-56' : ''
      }`}
    >
      <div className='pl-2 md:pl-8'>
        <Bars3CenterLeftIcon className='w-8 h-8 text-gray-700 cursor-pointer' onClick={() => setShowNav(!showNav)} />
      </div>
      <div className='flex items-center pr-2 md:pr-8'>
        {/* <Menu as='div' className='relative inline-block text-left'>
          <div>
            <Menu.Button className='inline-flex items-center justify-center w-full gap-2'>
              {user?.avatar === null ? (
                <DummyAvatar iconClassName='text-6xl flex items-center justify-center' wrapperClassName='h-32 w-32' />
              ) : (
                <img
                  src={user?.avatar}
                  className='h-8 border-2 border-white rounded-full shadow-sm md:mr-4'
                  alt={`${user?.fullName}'s avatar`}
                />
              )}
              <span className='hidden font-medium text-gray-700 md:block'> {user?.fullName}</span>
              <ChevronDownIcon className='w-4 h-4 ml-2 text-gray-700' />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform scale-95'
            enterTo='transform scale-100'
            leave='transition ease-in duration=75'
            leaveFrom='transform scale-100'
            leaveTo='transform scale-95'
          >
            <Menu.Items className='absolute left-0 z-10 w-full origin-top-right bg-white rounded-md shadow-lg top-10 ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='p-1'>
                <Menu.Item>
                  <Link
                    to={
                      user && user?.role === 'RECRUITER'
                        ? '/recruiter/profile'
                        : user?.role === 'INTERVIEWER'
                        ? '/interviewer/profile'
                        : '/admin/profile'
                    }
                    className='flex items-center p-2 text-sm text-gray-700 transition-colors rounded hover:bg-emerald-500 hover:text-white group'
                  >
                    <PencilIcon className='w-4 h-4 mr-2' />
                    Edit
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link
                    to='/logout'
                    className='flex items-center p-2 text-sm text-gray-700 transition-colors rounded hover:bg-emerald-500 hover:text-white group'
                    onClick={handleLogout}
                  >
                    <ArrowLeftOnRectangleIcon className='w-4 h-4 mr-2' />
                    Logout
                  </Link>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu> */}
      </div>
    </div>
  )
}
