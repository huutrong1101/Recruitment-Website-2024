import axios from 'axios'
import {
  setListExperienceJobApplication,
  setListJobOfRec,
  setListRecs,
  setListResumeStatus,
  setRecDetail,
  setRecJobDetail,
  setTotalRecs
} from '../redux/reducer/RecSlice'
import axiosInstance from '../utils/AxiosInstance'
import { Dispatch } from '@reduxjs/toolkit'
import { setEnglish } from '../redux/reducer/JobSlice'

const getListRec = async (dispatch: Dispatch, { searchText = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()

  if (searchText) params.append('searchText', searchText)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  const queryParams = params.toString()

  const response = await axiosInstance.get(`recruiters?${queryParams}`)

  const data = response.data.metadata

  dispatch(setListRecs(data.listRecruiter))
  dispatch(setTotalRecs(data.totalElement))
}

const getRecFromSlug = async (dispatch: Dispatch, recSlug: string) => {
  if (!recSlug) {
    throw new Error(`The value jobId cannot be undefined`)
  }
  const response = await axiosInstance.get(`/recruiters/${recSlug}`)
  const data = response.data.metadata
  dispatch(setRecDetail(data))
}

const getListWaitingJob = async ({ name = '', field = '', type = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (name) params.append('name', name)
  if (field) params.append('field', field)
  if (type) params.append('type', type)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()
  // No Content-Type header is manually set here
  return await axiosInstance.get(`/recruiter/jobs/waiting_jobs?${queryParams}`)
}

const getAcceptedJobs = async ({ name = '', field = '', levelRequirement = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (name) params.append('name', name)
  if (field) params.append('field', field)
  if (levelRequirement) params.append('levelRequirement', levelRequirement)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()
  // No Content-Type header is manually set here
  return await axiosInstance.get(`/recruiter/jobs/accepted_jobs?${queryParams}`)
}

const getDeclinedJobs = async ({ name = '', field = '', type = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (name) params.append('name', name)
  if (field) params.append('field', field)
  if (type) params.append('type', type)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()
  // No Content-Type header is manually set here
  return await axiosInstance.get(`/recruiter/jobs/declined_jobs?${queryParams}`)
}

const getExpiredJob = async ({ name = '', field = '', type = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (name) params.append('name', name)
  if (field) params.append('field', field)
  if (type) params.append('type', type)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()
  // No Content-Type header is manually set here
  return await axiosInstance.get(`/recruiter/jobs/expired_jobs?${queryParams}`)
}

const getNearingExpirationJob = async ({ name = '', field = '', type = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (name) params.append('name', name)
  if (field) params.append('field', field)
  if (type) params.append('type', type)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()
  // No Content-Type header is manually set here
  return await axiosInstance.get(`/recruiter/jobs/nearing_expiration_jobs?${queryParams}`)
}

const createJob = async (values: any) => {
  // No Content-Type header is manually set here
  return await axiosInstance.post(`/recruiter/jobs/create_job`, values)
}

const updateJob = async (values: any, jobId: string) => {
  return await axiosInstance.patch(`recruiter/jobs/${jobId}/update_job`, values)
}

const getLsitJobOfRec = async (recSlug: string, { name = '', province = '', page = 1, limit = 10 } = {}) => {
  if (!recSlug) {
    throw new Error(`The value jobId cannot be undefined`)
  }

  const params = new URLSearchParams()

  if (name) params.append('name', name)
  if (province) params.append('province', province)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  const queryParams = params.toString()

  return await axiosInstance.get(`/${recSlug}/listjob?${queryParams}`)
}

const getListResumeOfRec = async (
  { page = 1, limit = 10, candidateName = '', experience = '', status = '', major = '', timeSubmit = '' } = {},
  jobId: string
) => {
  const params = new URLSearchParams()

  if (candidateName) params.append('candidateName', candidateName)
  if (experience) params.append('experience', experience)
  if (status) params.append('status', status)
  if (major) params.append('major', major)
  if (timeSubmit) params.append('timeSubmit', timeSubmit)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  const queryParams = params.toString()

  return await axiosInstance.get(`recruiter/jobs/applications/${jobId}?${queryParams}`)
}

const getListAdvancedResume = async ({
  page = 1,
  limit = 10,
  searchText = '',
  title = '',
  educationLevel = '',
  english = '',
  jobType = '',
  experience = '',
  major = '',
  homeTown = ''
} = {}) => {
  const params = new URLSearchParams()

  if (searchText) params.append('searchText', searchText)
  if (title) params.append('title', title)
  if (educationLevel) params.append('educationLevel', educationLevel)
  if (english) params.append('english', english)
  if (jobType) params.append('jobType', jobType)
  if (experience) params.append('experience', experience)
  if (major) params.append('major', major)
  if (homeTown) params.append('homeTown', homeTown)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()

  return await axiosInstance.get(`recruiter/list_advanced_resume?${queryParams}`)
}

const getResumeDetail = async (candidateId: string) => {
  return await axiosInstance.get(`/recruiter/jobs/applications/detail/${candidateId}`)
}

const getResumeDetailFromResumeId = async (resumeId: string) => {
  return await axiosInstance.get(`/recruiter/list_advanced_resume/${resumeId}`)
}

const getListResumeStatus = async (dispatch: Dispatch) => {
  const response = await axiosInstance.get(`/recruiter/application_status`)
  const data = response.data.metadata.applicationStatus
  dispatch(setListResumeStatus(data))
}

const getListExperienceJobApplication = async (dispatch: Dispatch, jobId: string) => {
  const response = await axiosInstance.get(`/recruiter/jobs/applications/${jobId}/list_experience`)
  const data = response.data.metadata.listExperience
  dispatch(setListExperienceJobApplication(data))
}

const handleResume = async (id: string, status: string, reasonDecline: string) => {
  const values: { status: string; reasonDecline?: string } = {
    status: status
  }

  if (reasonDecline) {
    values.reasonDecline = reasonDecline
  }

  return await axiosInstance.patch(`recruiter/jobs/applications/approve/${id}`, values)
}

const getRecJobDetail = async (dispatch: Dispatch, jobId: string) => {
  const response = await axiosInstance.get(`/recruiter/jobs/${jobId}`)
  const data = response.data.metadata
  dispatch(setRecJobDetail(data))
}

const getListNotification = async () => {
  return await axiosInstance.get(`/recruiter/notifications/list_notification`)
}

const changeJobStatus = async (jobId: string, status: string) => {
  const requestBody = { status: status }
  return await axiosInstance.patch(`/recruiter/jobs/${jobId}/change_status`, requestBody)
}

const markNotificationAsRead = async (notiId: string) => {
  return await axiosInstance.patch(`/recruiter/notifications/${notiId}`)
}

async function getIfUserFavoriteTheRec(slug: string) {
  return axiosInstance.get(`/candidate/favorite_recruiters/check/${slug}`)
}

const saveFavoriteRec = async (recId: any) => {
  return await axiosInstance.post(`/candidate/favorite_recruiters/add/${recId}`)
}

const removeFavoriteRec = async (recId: any) => {
  return await axiosInstance.delete(`/candidate/favorite_recruiters/remove/${recId}`)
}

const payment = async (query: string) => {
  return await axiosInstance.get(`/recruiter/payment/vnpay_ipn?${query}`)
}

const checkRecUpgrade = async () => {
  return await axiosInstance.get(`/recruiter/check_premium_account`)
}

const saveFavoriteResume = async (resumeId: any) => {
  return await axiosInstance.post(`recruiter/favorite_resumes/add/${resumeId}`)
}

const removeFavoriteResume = async (resumeId: any) => {
  return await axiosInstance.delete(`recruiter/favorite_resumes/remove/${resumeId}`)
}

const getListFavoriteResume = async ({
  page = 1,
  limit = 10,
  title = '',
  educationLevel = '',
  english = '',
  jobType = '',
  experience = '',
  major = '',
  homeTown = ''
} = {}) => {
  const params = new URLSearchParams()

  if (title) params.append('title', title)
  if (educationLevel) params.append('educationLevel', educationLevel)
  if (english) params.append('english', english)
  if (jobType) params.append('jobType', jobType)
  if (experience) params.append('experience', experience)
  if (major) params.append('major', major)
  if (homeTown) params.append('homeTown', homeTown)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()

  return await axiosInstance.get(`recruiter/favorite_resumes/list?${queryParams}`)
}

const deleteAllFavoriteResume = async () => {
  return await axiosInstance.delete(`/recruiter/favorite_resumes/remove_all`)
}

async function getIfRecFavoriteTheResume(resumeId: string) {
  return axiosInstance.get(`recruiter/favorite_resumes/check/${resumeId}`)
}

const viewOrder = async () => {
  return await axiosInstance.get(`/recruiter/order/order_info`)
}

const createPayment = async (values: any) => {
  return await axiosInstance.post(`/recruiter/payment/create_payment_url`, values)
}

const cancelOrder = async (reasonCancel: string) => {
  const values = {
    reasonCancel
  }
  return await axiosInstance.patch(`/recruiter/order/cancel_order`, values)
}

async function getEnglish(dispatch: Dispatch) {
  const response = await axiosInstance.get('/recruiter/list_english_resume')
  const data = response.data.metadata.result
  dispatch(setEnglish(data))
}

const getApplicationStatisticByRange = async (startDate: string, endDate: string) => {
  return await axiosInstance.get(`/recruiter/statistic/application_statistic?startDate=${startDate}&endDate=${endDate}`)
}

const getApplicationStatisticByMonth = async (month: string, year: string) => {
  return await axiosInstance.get(`/recruiter/statistic/application_statistic_by_month?month=${month}&year=${year}`)
}

const getApplicationStatisticByYear = async (year: string) => {
  return await axiosInstance.get(`/recruiter/statistic/application_statistic_by_year?year=${year}`)
}

export const RecService = {
  createJob,
  getListWaitingJob,
  getAcceptedJobs,
  getDeclinedJobs,
  getListRec,
  getRecFromSlug,
  getLsitJobOfRec,
  getListResumeOfRec,
  getResumeDetail,
  getListResumeStatus,
  handleResume,
  getRecJobDetail,
  updateJob,
  getExpiredJob,
  getNearingExpirationJob,
  getListNotification,
  changeJobStatus,
  markNotificationAsRead,
  getIfUserFavoriteTheRec,
  saveFavoriteRec,
  removeFavoriteRec,
  getListExperienceJobApplication,
  payment,
  checkRecUpgrade,
  getListAdvancedResume,
  getListFavoriteResume,
  saveFavoriteResume,
  deleteAllFavoriteResume,
  getIfRecFavoriteTheResume,
  removeFavoriteResume,
  getResumeDetailFromResumeId,
  viewOrder,
  createPayment,
  cancelOrder,
  getEnglish,
  getApplicationStatisticByRange,
  getApplicationStatisticByMonth,
  getApplicationStatisticByYear
}
