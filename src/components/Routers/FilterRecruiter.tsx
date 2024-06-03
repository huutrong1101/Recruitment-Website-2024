import { Outlet } from 'react-router-dom'
import { useAppSelector } from '../../hooks/hooks'
import { useTokenAuthorize } from '../../hooks/useTokenAuthorize'
import NotFound from '../NotFound/NotFound'
import FilterLoadingLayout from './FilterLoadingLayout'

export default function FilterRecruiter() {
  useTokenAuthorize()

  const { isLoggedIn, loading, recruiter } = useAppSelector((app) => app.Auth)

  if (loading === 'idle' || loading === 'pending') {
    return <FilterLoadingLayout />
  }

  if (loading === 'failed' || !isLoggedIn || !recruiter) {
    return <NotFound />
  }

  return <Outlet />
}
