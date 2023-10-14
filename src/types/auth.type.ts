export type RoleType = 'CANDIDATE' | 'RECRUITER' | 'ADMIN' | 'INTERVIEWER'

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

export type LoadingState = `idle` | `pending` | `success` | `failed`
