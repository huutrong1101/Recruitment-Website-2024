import qs from 'query-string'
import axiosInstance from '../utils/AxiosInstance'
import { getLocalToken, hasLocalToken } from '../utils/localToken'

const getUserFromToken = async () => {
  if (!hasLocalToken()) {
    throw new Error(`Unable to load the token`)
  }
  return await axiosInstance.get(`/recruiter/information`, {
    headers: {
      Authorization: `Bearer ${getLocalToken()}`
    }
  })
}

const getRecFromToken = async () => {
  if (!hasLocalToken()) {
    throw new Error(`Unable to load the token`)
  }
  return await axiosInstance.get(`/recruiter/information`, {
    headers: {
      Authorization: `Bearer ${getLocalToken()}`
    }
  })
}

const getAdminFromToken = async () => {
  if (!hasLocalToken()) {
    throw new Error(`Unable to load the token`)
  }
  return await axiosInstance.get(`/admin/information`, {
    headers: {
      Authorization: `Bearer ${getLocalToken()}`
    }
  })
}

const changeUserAvatar = async (data: FormData) => {
  return await axiosInstance.patch(`/recruiter/update_avatar`, data, {
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

const changePassword = async (data: any) => {
  return await axiosInstance.post(`/recruiter/change_password`, data)
}

/**
 * Returns the interviews that owned by a candidate.
 */
const getUserInterviews = async ({ index, size }: any) => {
  const query = qs.stringify({ index, size })
  return await axiosInstance.get(`/candidate/interviews?${query}`)
}

const getUserInformation = async () => {
  return await axiosInstance.get(`/candidate/information`)
}

const updateUserInformation = async (values: any) => {
  return await axiosInstance.put(`/candidate/information`, values)
}

const updateRecInformation = async (values: FormData) => {
  // No Content-Type header is manually set here
  return await axiosInstance.patch(`/recruiter/update_information`, values)
}

const updateRecProfile = async (values: any) => {
  return await axiosInstance.patch(`/recruiter/update_profile`, values)
}

const updateRecCompanyInfor = async (values: FormData) => {
  return await axiosInstance.patch(`/recruiter/update_company_information`, values)
}

export const UserService = {
  getRecFromToken,
  getAdminFromToken,
  changeUserAvatar,
  getUserInterviews,
  updateProfile,
  changePassword,
  uploadResume,
  deleteResume,
  getUserInformation,
  updateUserInformation,
  updateRecInformation,
  updateRecProfile,
  updateRecCompanyInfor
}
