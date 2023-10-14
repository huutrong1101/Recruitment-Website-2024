import { Outlet } from 'react-router-dom'
import { useAppSelector } from '../../hooks/hooks'
import NotFound from '../NotFound/NotFound'
import FilterLoadingLayout from './FilterLoadingLayout'

export default function FilterNonLogin() {
  const { isLoggedIn, loading, token } = useAppSelector((app) => app.Auth)

  if (token) {
    if (loading === 'idle' || loading === 'pending') {
      return <FilterLoadingLayout />
    }

    if (loading === 'success' && isLoggedIn) {
      return <NotFound />
    }
  }

  return (
    <>
      <Outlet />
    </>
  )
}
