import classNames from 'classnames'
import { BsFacebook, BsFillCartCheckFill, BsFillTelephoneFill, BsInstagram, BsYoutube } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Container from '../Container/Container'

export default function Footer() {
  return (
    <div className={classNames('footer-wrapper bg-gray-950 text-white')}>
      <Container className={'footer-container'}>
        <div
          className={classNames('flex flex-col md:flex-row md:items-center justify-between py-5 border-b border-white')}
        >
          <div>
            <h3
              className={classNames(
                'text-white py-2 md:px-0 text-xl font-semibold leading-28 tracking-wide capitalize'
              )}
            >
              JobPort
            </h3>
          </div>
          <div className={classNames('text-zinc-300 text-base leading-6')}>
            <ul className={classNames('flex flex-col md:flex-row-reverse gap-6')}>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/jobs'>Jobs</Link>
              </li>
              <li>
                <Link to='/about-us'>About Us</Link>
              </li>
              <li>
                <Link to='/contact'>Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={classNames('py-5 flex items-center justify-between')}>
          <div>
            <p className={classNames('text-white text-center text-base leading-6')}>© 2023. Design by MyTeam </p>
          </div>
          <div className={classNames('text-white text-base font-semibold leading-6')}>
            <ul className={classNames('flex justify-evenly gap-6')}>
              <Link to='/'>
                <BsFacebook />
              </Link>
              <Link to='/'>
                <BsInstagram />
              </Link>
              <Link to='/'>
                <BsYoutube />
              </Link>
              <Link to='/'>
                <BsFillCartCheckFill />
              </Link>
              <Link to='/'>
                <BsFillTelephoneFill />
              </Link>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  )
}
