import {
  RecRegisterParamsInterface,
  UserLoginParamsInterface,
  UserRegisterParamsInterface,
  UserVerifySendParamsInterface
} from '../types/user.type'
import axiosInstance from '../utils/AxiosInstance'

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

function verifyOtp({ otp, email }: UserVerifySendParamsInterface) {
  if (otp === null || email === null || otp === '' || email === '') {
    throw new Error(`Invalid parameters`)
  }
  return axiosInstance.post(`/recruiter/verify?email=${email}`, { otp })
}

const forgetPassword = async (data: FormData) => {
  return await axiosInstance.post(`/user/forgot-password`, data)
}

const createNewPassword = async (token: string, data: FormData) => {
  return await axiosInstance.post(`/user/reset-password?token=${token}`, data)
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
  resendEmail
}
