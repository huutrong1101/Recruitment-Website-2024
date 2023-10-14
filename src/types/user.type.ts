export type RoleType = 'CANDIDATE' | 'RECRUITER' | 'ADMIN' | 'INTERVIEWER'

export type LoadingState = `idle` | `pending` | `success` | `failed`

export interface UserRegisterParamsInterface {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

export interface UserLoginParamsInterface {
  credentialId: string
  password: string
}

export interface UserVerifySendParamsInterface {
  otp: string
  email: string
}

export interface UserResponseState {
  userId: string
  phone: string
  email: string
  fullName: string
  avatar: string | null
  address: string | null
  dateOfBirth: Date | null
  about: string | null
  gender: 'male' | 'female' | null
  createdAt: Date | null
  updatedAt: Date | null
  role: RoleType
  active: boolean
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
