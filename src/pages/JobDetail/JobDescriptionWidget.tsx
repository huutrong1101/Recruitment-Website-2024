import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment } from 'react'

interface JobDescriptionWidgetProps {
  companyName: string
  jobRole: string
  publishDate: string
  quantity: number

  logo: {
    src: any
    alt: string
  }
}

export default function JobDescriptionWidget({
  companyName,
  jobRole,
  publishDate,
  quantity,
  logo
}: JobDescriptionWidgetProps) {
  return (
    <Transition as={Fragment} show={true}>
      <div className={classNames(`flex flex-row bg-white shadow-sm`, `rounded-xl p-2`, `gap-6 items-center`, `border`)}>
        {/* Logo */}
        <div className={classNames(`w-2/12 flex flex-col items-center justify-center`)}>
          <img className={classNames(`min-w-[64px] w-1/2`)} draggable={false} src={logo.src} alt={logo.alt} />
        </div>
        {/* Information */}
        <div className={classNames(`flex flex-row flex-1 `)}>
          <div className={classNames(`flex flex-col flex-1 font-semibold gap-1`)}>
            <span className='text-lg font-semibold text-orange'>{jobRole}</span>
            <span className={classNames(`text-base`)}>Số lương cần tuyển: {quantity}</span>
          </div>
          {/* Right */}

          {/* TODO: change this to from date to date */}
          <div className={`text-zinc-400 text-sm mr-10`}>{publishDate}</div>
        </div>
      </div>
    </Transition>
  )
}
