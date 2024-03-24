import classnames from 'classnames'
import { Link } from 'react-router-dom'

export default function Advertise() {
  return (
    <>
      <div className='my-[40px] md:my-[80px] w-full bg-white shadow-lg border rounded-xl p-6 flex flex-col'>
        <h3 className={classnames('text-black md:text-2xl font-semibold mb-4')}>Khám phá tuyển dụng</h3>
        <div className={classnames('flex flex-col md:flex-row items-center justify-between gap-4 md:gap-16')}>
          <div className={classnames('flex-1')}>
            <p className={classnames('text-gray-400 text-sm md:text-base font-normal')}>
              FPT nỗ lực làm khách hàng hài lòng trên cơ sở hiểu biết sâu sắc và đáp ứng một cách tốt nhất nhu cầu của
              họ với lòng tận tụy và năng lực không ngừng được nâng cao.
            </p>
          </div>
          <div className={classnames('flex gap-3 items-center justify-center')}>
            <Link to='/jobs' className={classnames('bg-orange text-white p-2 rounded-md flex text-center')}>
              Ứng tuyển ngay
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
