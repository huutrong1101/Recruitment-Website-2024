import classNames from 'classnames'
import home_page from '../../../images/home_page.png'

export default function Banner() {
  return (
    <div className={classNames('flex justify-center flex-row items-center gap-12 md:gap-24 md:min-h-[50vh]')}>
      <div className={classNames('w-4/12')}>
        <img src={home_page} alt='home_page' className={classNames('w-full')} />
      </div>

      <div className={classNames('w-[45%] relative')}>
        <div className={classNames('absolute top-[50%] translate-y-[-50%] text-center')}>
          <h3 className={classNames('text-[18px] md:text-[25px] lg:text-[48px] font-semibold')}>
            Join Us & <span className={classNames('text-emerald-700')}>Explore Thousands</span> of Jobs
          </h3>
          <p className={classNames('text-[12px] md:text-[18px] font-semibold text-gray-500')}>
            Find Jobs, Employment & Career Opportunities. Some of the companies we've helped recruit excellent
            applicants over the years.
          </p>
        </div>
      </div>
    </div>
  )
}
