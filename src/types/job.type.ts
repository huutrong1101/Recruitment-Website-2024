export interface JobInterface {
  _id: string
  name: string
  location: string
  province: string
  type: string
  levelRequirement: string
  experience: string
  salary: string
  field: string
  description: string
  requirement: string
  benefit: string
  quantity: number
  deadline: string
  status: string
  acceptanceStatus: string
  createdAt: string
  updatedAt: string
  genderRequirement: string
  approvalDate: string
  companyName: string
  companyLogo: string
  employeeNumber: number
  companyAddress: string
}

export interface AdminJobInterface {
  _id: string
  name: string
  location: string
  province: string
  type: string
  levelRequirement: string
  experience: string
  salary: string
  field: string
  description: string
  requirement: string
  benefit: string
  quantity: number
  deadline: string
  gender: string
  status: string
  acceptanceStatus: string
  createdAt: string
  updatedAt: string
  companyName: string
  companyLogo: string
  employeeNumber: number
  companyAddress: string
}

export interface AdminCompanyInterface {
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
  about: string
  companyAddress: string
  companyCoverPhoto: string
  companyLogo: string
  companyWebsite: string
  employeeNumber: number
  role: string
}

export interface JobListConfig {
  page?: number | string
  limit?: number | string
  name?: string
  type?: string
  location?: string
  position?: string
  active?: boolean
}

export interface AdminJobInterface {
  jobId: string
  position: string
  location: string
  jobType: string
  process: number
  name: string
  authorId: string
  quantity: number
  benefit: string
  salaryRange: string
  requirement: string
  description: string
  isActive: boolean
  deadline: string
  createdAt: string
  updatedAt: string
  __v: number
  skills: string[]
}

export interface JobDataInterface {
  listJobInfoSearch: { [index: string]: object[] }
}
