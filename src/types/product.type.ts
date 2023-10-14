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

export interface JobListConfig {
  page?: number | string
  limit?: number | string
  name?: string
  type?: string
  location?: string
  position?: string
  active?: boolean
}
