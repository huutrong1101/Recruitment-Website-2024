import { Dispatch } from '@reduxjs/toolkit'
import {
  RecRegisterParamsInterface,
  UserLoginParamsInterface,
  UserRegisterParamsInterface,
  UserVerifySendParamsInterface
} from '../types/user.type'
import axiosInstance from '../utils/AxiosInstance'
import { setJobFavorite, setWorkStatus } from '../redux/reducer/JobSlice'

async function register({ name, email, password, confirmPassword }: UserRegisterParamsInterface) {
  return axiosInstance.post(`/candidate/signup`, {
    name,
    email,
    password,
    confirmPassword
  })
}

async function recRegister({
  companyName,
  name,
  position,
  phone,
  contactEmail,
  email,
  password,
  confirmPassword
}: RecRegisterParamsInterface) {
  return axiosInstance.post(`/recruiter/signup`, {
    companyName,
    name,
    position,
    phone,
    contactEmail,
    email,
    password,
    confirmPassword
  })
}

function login({ email, password }: UserLoginParamsInterface) {
  return axiosInstance.post(
    `/login`,
    { email, password },
    {
      headers: {
        Authorization: null
      }
    }
  )
}

function verifyOtp({ otp, email, code }: UserVerifySendParamsInterface) {
  if (otp === null || email === null || otp === '' || email === '' || code === '' || code === '') {
    throw new Error(`Invalid parameters`)
  }

  console.log({ otp, email, code })
  if (code === '003') {
    return axiosInstance.post(`/candidate/verify?email=${email}`, { otp })
  }

  return axiosInstance.post(`/recruiter/verify?email=${email}`, { otp })
}

const forgetPassword = async (data: FormData) => {
  return await axiosInstance.post(`/forget_password`, data)
}

const createNewPassword = async (token: string, email: string, data: FormData) => {
  return await axiosInstance.post(`reset_password?email=${email}&token=${token}`, data)
}

const addBlacklist = async (accountId: string) => {
  return await axiosInstance.post(`/admin/users/blacklist/${accountId}`)
}

const removeBlacklist = async (accountId: string) => {
  return await axiosInstance.delete(`/admin/candidate/${accountId}`)
}

const createAccount = async (data: any) => {
  return await axiosInstance.post(`/admin/create_account`, data)
}

const resendEmail = async (data: any) => {
  const params = {
    email: data
  }
  return await axiosInstance.post(`/recruiter/signup/resend_mail`, params)
}

const getWorkStatus = async (dispatch: Dispatch) => {
  const response = await axiosInstance.get('work_status')
  const data = response.data.metadata.workStatus
  dispatch(setWorkStatus(data))
}

const getJobFavorite = async ({ name = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()
  if (name) params.append('name', name)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()

  return await axiosInstance.get(`/candidate/favorite_jobs?${queryParams}`)
}

const getJobApply = async ({ name = '', status = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()
  if (name) params.append('name', name)
  if (status) params.append('status', status)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()

  return await axiosInstance.get(`/candidate/applications?${queryParams}`)
}

const getListResume = async ({ name = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()
  if (name) params.append('title', name)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()

  return await axiosInstance.get(`/candidate/resumes?${queryParams}`)
}

const getResumeDetail = async (resumeId: string) => {
  return await axiosInstance.get(`/candidate/resumes/detail/${resumeId}`)
}

const withdrawJobApplication = async (jobId: string) => {
  return await axiosInstance.delete(`/candidate/jobs/cancel/${jobId}`)
}

export const AuthService = {
  register,
  recRegister,
  login,
  verifyOtp,
  forgetPassword,
  createNewPassword,
  addBlacklist,
  removeBlacklist,
  createAccount,
  resendEmail,
  getWorkStatus,
  getJobFavorite,
  getListResume,
  getResumeDetail,
  getJobApply,
  withdrawJobApplication
}
