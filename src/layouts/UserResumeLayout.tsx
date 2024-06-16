import { Outlet } from 'react-router-dom'

export default function UserResumeLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-grow px-3 md:px-10 lg:px-10 xl:px-10 2xl:px-10'>
        <Outlet />
      </div>
    </div>
  )
}
