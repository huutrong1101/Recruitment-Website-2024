import { forwardRef, Ref } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { linksAll } from '../../utils/NavigateMenu'
import { useAppSelector } from '../../hooks/hooks'
import classNames from 'classnames'

interface SideBarProps {
  showNav: boolean
}

const SideBar = forwardRef<HTMLDivElement, SideBarProps>(({ showNav }, ref: Ref<HTMLDivElement>) => {
  const { pathname } = useLocation()

  const { user } = useAppSelector((state: any) => state.Auth)

  // let links = [linksAll[0]]

  return (
    <div ref={ref} className='fixed z-20 w-56 h-full bg-white rounded-md shadow-sm ring-1 ring-black ring-opacity-5'>
      <div className='flex justify-center mt-6 mb-6'>
        <div className='text-4xl font-semibold'>JobPort</div>
      </div>

      <div className='flex flex-col'>
        {linksAll.map((item: any, index) => (
          <div key={index}>
            <Link
              to={item.url}
              key={item.url}
              className={classNames(
                `pl-6 py-3 mx-5 rounded text-center cursor-pointer mb-3 flex items-center group`,
                `transition-colors ease-in-out duration-100 rounded-sm`,
                { 'bg-black/10 text-[#059669]': item.url === pathname }
              )}
            >
              <div className='mr-2'>
                <div
                  className={classNames(
                    `group-hover:text-[#059669] w-5 h-5`,
                    `transition-colors ease-in-out duration-100`
                  )}
                >
                  {item.icon}
                </div>
              </div>
              <div>
                <span
                  className={classNames(`group-hover:text-[#059669]`, `transition-colors ease-in-out duration-100`)}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
})

SideBar.displayName = 'SideBar'

export default SideBar
