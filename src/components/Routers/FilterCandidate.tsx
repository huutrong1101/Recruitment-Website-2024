import { Outlet, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../hooks/hooks'
import { useTokenAuthorize } from '../../hooks/useTokenAuthorize'
import NotFound from '../NotFound/NotFound'
import FilterLoadingLayout from './FilterLoadingLayout'

export default function FilterCandidate() {
  useTokenAuthorize()
  const navigate = useNavigate()

  const { isLoggedIn, loading, token } = useAppSelector((app) => app.Auth)

  if (!token && loading === 'idle') {
    navigate('/auth/login')
    return <NotFound />
  }

  // Wait for verifying a token
  if (loading === 'idle' || loading === 'pending') {
    return <FilterLoadingLayout />
  }

  // Something occurred while verifying
  if (loading === 'failed') {
    return <>Failed to verify account</>
  }

  // If the token is logged in
  if (!isLoggedIn && loading === 'success') {
    return <>Not logged in</>
  }

  return <Outlet />
}
