import axios from 'axios'
import { toast } from 'react-toastify'
import {
  clearLocalToken,
  clearRefreshToken,
  getLocalToken,
  getRefreshToken,
  hasLocalToken,
  hasRefreshToken,
  setLocalToken
} from './localToken'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export async function requestRefreshAccessToken() {
  if (!hasRefreshToken()) {
    console.warn(`Refresh token has not been found. Clean the accessToken and return sign in page`)
    window.location.href = '/'
    return
  }

  const response = await axiosInstance.post(
    '/auth/refresh-access-token',
    {
      refreshToken: getRefreshToken(),
      accessToken: null
    },
    {
      headers: {
        Authorization: null
      }
    }
  )

  const { refreshToken, accessToken } = response.data.result
  // console.log(response.data);
  setLocalToken(accessToken)
  console.debug(`The access token was just replaced by ${accessToken}`)

  return { refreshToken, accessToken }
}

axios.interceptors.request.use(function (config) {
  if (hasLocalToken()) {
    const token = getLocalToken()
    config.headers.Authorization = token
  }

  return config
})

axiosInstance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const responseErrorCode = error.code
    if (responseErrorCode === 'ERR_NETWORK') {
      // if (error.response.status)
      if (error.status === undefined) {
        console.error(
          `Connection error was occurred. Please ensure that the server is open and connected to server.`,
          error
        )
      }

      return Promise.reject(error)
    } else {
      if (401 === error.response.status) {
        console.warn(`Trying to refresh the token`)
        // If the refresh token is not exists, clean the token
        if (!hasRefreshToken()) {
          console.warn(`Clean the access token because we have to refresh token`)
          clearLocalToken()
          // Reload the page if it is was not a login page
          if (!window.location.toString().includes(`/login`)) {
            window.location.reload()
          }
        } else {
          requestRefreshAccessToken()
            .then(() => {
              window.location.reload()
            })
            .catch((err) => {
              console.warn(`Failed to refill the access token: ${err.response.data.message}`)
              clearLocalToken()
              clearRefreshToken()
              window.location.reload()
            })
            .catch(() => {
              toast.error(`Credential is error or session is ended. Please try to login again`)
            })
        }
      }
    }

    // if (responseErrorCode === "ERR_NETWORK" && error.status === 401) {
    //   console.warn(`Sending a unknown token`);
    //   return Promise.reject(error);
    // }
    return Promise.reject(error)
  }
)

export default axiosInstance
