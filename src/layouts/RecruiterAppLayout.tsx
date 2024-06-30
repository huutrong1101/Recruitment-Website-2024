import { Outlet } from 'react-router-dom'

export default function RecruiterAppLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-grow'>
        <Outlet />
      </div>
    </div>
  )
}
