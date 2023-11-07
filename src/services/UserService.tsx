import qs from 'query-string'
import axiosInstance from '../utils/AxiosInstance'
import { getLocalToken, hasLocalToken } from '../utils/localToken'

const getUserFromToken = async () => {
  if (!hasLocalToken()) {
    throw new Error(`Unable to load the token`)
  }
  return await axiosInstance.get(`/user/profile`, {
    headers: {
      Authorization: `Bearer ${getLocalToken()}`
    }
  })
}

const changeUserAvatar = async (data: FormData) => {
  return await axiosInstance.put(`/user/avatar`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

const uploadResume = async (data: FormData) => {
  return await axiosInstance.put(`/candidate/resumes`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

const deleteResume = async (resumeId: any) => {
  return await axiosInstance.delete(`/candidate/resumes/${resumeId}`)
}

const updateProfile = async (data: FormData) => {
  return await axiosInstance.put(`/user/update`, data)
}

const changePassword = async (data: FormData) => {
  return await axiosInstance.put(`/user/change-password`, data)
}

/**
 * Returns the interviews that owned by a candidate.
 */
const getUserInterviews = async ({ index, size }: any) => {
  const query = qs.stringify({ index, size })
  return await axiosInstance.get(`/candidate/interviews?${query}`)
}

const getUserInformation = async () => {
  // return await axiosInstance.get(`/candidate/information`)
}

const updateUserInformation = async (values: any) => {
  const _values = JSON.stringify(values)
  // return await axiosInstance.put(`/candidate/information`, { values: _values })
}

export const UserService = {
  getUserFromToken,
  changeUserAvatar,
  getUserInterviews,
  updateProfile,
  changePassword,
  uploadResume,
  deleteResume,
  getUserInformation,
  updateUserInformation
}
