export type RoleType = 'CANDIDATE' | 'RECRUITER' | 'ADMIN' | 'INTERVIEWER'

export type LoadingState = `idle` | `pending` | `success` | `failed`

export interface UserRegisterParamsInterface {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface RecRegisterParamsInterface {
  companyName: string
  name: string
  position: string
  phone: string
  contactEmail: string
  email: string
  password: string
  confirmPassword: string
}

export interface UserLoginParamsInterface {
  email: string
  password: string
}

export interface UserVerifySendParamsInterface {
  otp: string
  email: string
  code: string
}

export interface RecruiterResponseState {
  _id: string
  name: string
  email: string
  contactEmail: string
  phone: string
  acceptanceStatus: string
  verifyEmail: boolean
  position: string
  companyName: string
  fieldOfActivity: string[]
  companyAddress: string
  companyWebsite: string
  employeeNumber: number
  about: string
  companyCoverPhoto: string
  companyLogo: string
  avatar: string
  slug: string
  role: string
  likeNumber: string
  premiumAccount: boolean
  activeJobCount: number
  firstApproval: boolean
}

export interface AdminResponseState {
  _id: string
  name: string
  phone: string
  email: string
  role: string
}

export interface UserResponseState {
  _id: string
  name: string
  email: string
  verifyEmail: boolean
  dateOfBirth: Date
  gender: string
  homeTown: string
  phone: string
  workStatus: string
  avatar: string
  allowSearch: boolean
  role: string
  listAllowSearchResume: string[]
}

export interface AuthState {
  isLoggedIn: boolean
  user?: UserResponseState | null
  token: string | null
  loading: LoadingState
  signInLoadingState: LoadingState
  registerLoadingState: LoadingState
}

export interface AcountConfig {
  page?: number | string
  limit?: number | string
  searchText?: string
  searchBy?: string
  role?: string
  name?: string
  phone?: string
  email?: string
  blacklist?: string
}
