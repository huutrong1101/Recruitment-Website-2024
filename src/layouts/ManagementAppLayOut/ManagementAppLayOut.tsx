import { useState, useEffect, Fragment } from 'react'
import { Transition } from '@headlessui/react'
import AdminNavbar from '../../components/Navbar/AdminNavbar'
import SideBar from '../../components/Sidebar/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import DashboardFooter from './DashboardFooter'

export default function ManagementAppLayOut() {
  const [showNav, setShowNav] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  function handleResize() {
    if (window.innerWidth <= 640) {
      setShowNav(false)
      setIsMobile(true)
    } else {
      setShowNav(true)
      setIsMobile(false)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return (
    <div className='relative min-h-screen bg-slate-50'>
      <AdminNavbar showNav={showNav} setShowNav={setShowNav} />
      <Transition
        as={Fragment}
        show={showNav}
        enter='transition-transform duration-[400ms]'
        enterFrom='-translate-x-full'
        enterTo='translate-x-0'
        leave='transition-transform duration-[400ms] ease-in-out'
        leaveFrom='translate-x-0'
        leaveTo='-translate-x-full'
      >
        <SideBar showNav={showNav} />
      </Transition>
      <main className={`pt-16 transition-all duration-[400ms] ${showNav && !isMobile ? 'pl-56' : ''}`}>
        <div className='px-3 pt-1 md:px-8 '>
          <Outlet />
          <div className='pb-5'>
            <DashboardFooter />
          </div>
        </div>
      </main>
    </div>
  )
}
