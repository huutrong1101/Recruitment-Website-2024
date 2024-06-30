import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/hooks'
import { useTokenAuthorize } from '../../hooks/useTokenAuthorize'
import NotFound from '../NotFound/NotFound'
import FilterLoadingLayout from './FilterLoadingLayout'

export default function FilterCandidate() {
  useTokenAuthorize()
  const navigate = useNavigate()

  const { isLoggedIn, loading, user, token } = useAppSelector((app) => app.Auth)

  if (!token && loading === 'idle') {
    navigate('/auth/login')
    return <NotFound />
  }

  if (loading === 'idle' || loading === 'pending') {
    return <FilterLoadingLayout />
  }

  if (loading === 'failed' || !isLoggedIn || !user) {
    return <NotFound />
  }

  return <Outlet />
}
