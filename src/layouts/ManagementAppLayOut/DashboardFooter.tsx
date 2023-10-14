interface AdminFooterProps {
  showNav: boolean
  setShowNav: (showNav: boolean) => void
}

export default function DashboardFooter() {
  return (
    <div className={`w-full h-16 flex justify-between items-center transition-all duration-[400ms]`}>
      <div className='w-full pl-4 md:pl-16'>
        <div className='flex justify-between pb-1'>
          <div className=''>
            <span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
              © 2023{' '}
              <a href='/' className='ml-1 hover:underline'>
                JOBPORT
              </a>
            </span>
          </div>
          <div className='pr-4 md:pr-16'>
            <ul className='flex items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0'>
              <li>
                <a href='/about-us' className='mr-4 hover:underline md:mr-6 '>
                  About
                </a>
              </li>
              <li>
                <a href='/contact' className='mr-4 hover:underline md:mr-6'>
                  Support
                </a>
              </li>
              <li>
                <a href='/contact' className='hover:underline'>
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
