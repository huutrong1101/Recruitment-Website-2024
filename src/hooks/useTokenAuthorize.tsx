import { useEffect } from 'react'
import { requestRefreshAccessToken } from '../utils/AxiosInstance'
import { getLocalToken, getPermission, hasLocalToken, hasPermission, hasRefreshToken } from '../utils/localToken'
import { useAppDispatch, useAppSelector } from './hooks'
import { authLogout, fetchAdminFromToken, fetchRecFromToken } from '../redux/reducer/AuthSlice'

export function useTokenAuthorize() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (hasRefreshToken()) {
      if (!hasLocalToken()) {
        requestRefreshAccessToken().then(({ refreshToken, accessToken }: any) => {
          dropDispatchFetchUser(accessToken)
        })
      } else {
        dropDispatchFetchUser(getLocalToken())
      }
    }
  }, [])

  const dropDispatchFetchUser = async (token: string) => {
    if (hasPermission()) {
      const permission = getPermission()
      if (permission === '001') {
        return dispatch(fetchAdminFromToken({ token }))
          .unwrap()
          .catch((error: any) => {
            // if failed, trying to look at the scenario.
            // First, if the token is broken
            if (!error.success && error.statusCode === 500) {
              dispatch(authLogout())
            }

            // Second one, when expired, we trying to refresh it
          })
      } else if (permission === '002') {
        return dispatch(fetchRecFromToken({ token }))
          .unwrap()
          .catch((error: any) => {
            // if failed, trying to look at the scenario.
            // First, if the token is broken
            if (!error.success && error.statusCode === 500) {
              dispatch(authLogout())
            }

            // Second one, when expired, we trying to refresh it
          })
      }
    }
  }
}
