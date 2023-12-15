export interface JobInterface {
  jobId: string
  name: string
  jobType: string
  quantity: number
  benefit: string
  salaryRange: string
  requirement: string
  location: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string | null
  deadline: string
  position: string
  skills: []
}

export interface AdminJobInterface {
  jobId: string
  jobName: string
  quantity: number
  benefit: string
  salaryRange: string
  requirement: string
  description: string
  createdAt: string
  deadline: string
  position: string
  location: string
  jobType: string
  author: string
  process: number
  skills: string[]
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
