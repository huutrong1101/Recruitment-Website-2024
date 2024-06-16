import { Spin } from 'antd'
import LoadSpinner from '../LoadSpinner/LoadSpinner'

export default function FilterLoadingLayout() {
  return (
    <>
      <div className='min-h-[100vh] w-full animate-pulse bg-gray-50 mb-8 duration-75 flex flex-col items-center justify-center text-3xl'>
        <Spin />
      </div>
    </>
  )
}
