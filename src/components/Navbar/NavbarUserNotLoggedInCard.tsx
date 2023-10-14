import classNames from 'classnames'
import { AiOutlineUser } from 'react-icons/ai'
import { Link } from 'react-router-dom'

export default function NavbarUserNotLoggedInCard() {
  return (
    <Link className={classNames(`text-xl`)} to={`/auth/login`}>
      <AiOutlineUser />
    </Link>
  )
}
