import qs from 'query-string'
import axiosInstance from '../utils/AxiosInstance'
import { getLocalToken, hasLocalToken } from '../utils/localToken'

const getUserFromToken = async () => {
  if (!hasLocalToken()) {
    throw new Error(`Unable to load the token`)
  }
  return await axiosInstance.get(`/candidate/information`, {
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
  return await axiosInstance.patch(`/candidate/update_avatar`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

const changeRecAvatar = async (data: FormData) => {
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
  return await axiosInstance.patch(`/candidate/update_information`, data)
}

const changeRecPassword = async (data: any) => {
  return await axiosInstance.post(`/recruiter/change_password`, data)
}

const changePassword = async (data: any) => {
  return await axiosInstance.post(`/candidate/change_password`, data)
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

const saveFavoriteJob = async (jobId: any) => {
  return await axiosInstance.post(`/candidate/favorite_jobs/add/${jobId}`)
}

const deleteFavoriteJob = async (jobId: any) => {
  return await axiosInstance.delete(`/candidate/favorite_jobs/remove/${jobId}`)
}

const deleteListFavoriteJob = async (listJobId: string[]) => {
  return await axiosInstance.delete('/candidate/favorite_jobs/remove', { data: { listJobId: listJobId } })
}
const deleteAllFavoriteJob = async () => {
  return await axiosInstance.delete(`/candidate/favorite_jobs/remove_all`)
}

const createResume = async (data: FormData) => {
  return await axiosInstance.post(`/candidate/resumes/add`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

const updateResume = async (data: FormData, resumeId: string) => {
  return await axiosInstance.patch(`/candidate/resumes/update/${resumeId}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

const uploadCertification = async (data: FormData) => {
  return await axiosInstance.post(`/candidate/resumes/upload_certification`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

const deleteCertification = async (uploadFileUrl: string) => {
  return await axiosInstance.delete(`/candidate/resumes/delete_upload_certification`, {
    data: {
      uploadFile: uploadFileUrl
    }
  })
}

const getListNotification = async () => {
  return await axiosInstance.get(`/candidate/notifications/list_notification`)
}

const markNotificationAsRead = async (notiId: string) => {
  return await axiosInstance.patch(`/candidate/notifications/read/${notiId}`)
}

const changeResumeStatus = async (resumeId: string, status: string) => {
  const requestBody = { status: status }
  return await axiosInstance.patch(`/candidate/resumes/change_status/${resumeId}`, requestBody)
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
  updateRecCompanyInfor,
  getUserFromToken,
  changeRecAvatar,
  saveFavoriteJob,
  deleteFavoriteJob,
  createResume,
  changeRecPassword,
  uploadCertification,
  deleteCertification,
  deleteAllFavoriteJob,
  updateResume,
  getListNotification,
  changeResumeStatus,
  markNotificationAsRead,
  deleteListFavoriteJob
}
