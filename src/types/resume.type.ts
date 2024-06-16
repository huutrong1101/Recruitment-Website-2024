interface Certification {
  name: string
  uploadLink: string
}

interface Education {
  from: string
  to: string
  major: string
}

interface WorkHistory {
  from: string
  to: string
  workUnit: string
  description: string
}

export interface ResumeResponse {
  _id: string
  candidateId: string
  name: string
  title: string
  avatar: string
  goal: string
  phone: string
  educationLevel: string
  homeTown: string
  dateOfBirth: string
  english: string
  jobType: string
  experience: string
  GPA: number
  activity: string
  certifications: Certification[]
  educations: Education[]
  workHistories: WorkHistory[]
  status: string
  createdAt: string
  updatedAt: string
  email: string
  major: string
  allowSearch: boolean
  themeId: string
}
