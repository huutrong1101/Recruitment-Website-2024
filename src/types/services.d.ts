export interface AppliedCandidateListConfig {
  name?: string
  state?: string
}

export interface RecInterviewerListConfig {
  page?: number | string
  limit?: number | string
  name?: string
  skill?: string
}

export interface RecInterviewerInterface {
  email: string
  phone: string
  fullName: string
  avatar: string
  address: string
  about: string
  skills: {
    skillId: number
    name: string
  }[]
  projects: {
    projectId: string
    projectName: string
    positionInProject: string
    description: string
  }[]
  awards: {
    awardId: string
    awardName: string
    awardOrganization: string
    awardWinningTime: string
  }[]
  experiences: {
    experienceId: string
    companyName: string
    position: string
    time: string
  }[]
  courses: {
    courseId: string
    courseName: string
    trainningOrganizations: string
    completionTime: string
  }[]
  certificates: {
    certificateId: string
    certificateName: string
    certificateBody: string
    certificationTime: string
  }[]
  educations: {
    educationId: string
    schoolName: string
    specialized: string
    certificate: string
  }[]
  dateOfBirth: string
  interviewerId: string
}

export interface RecCandidateList {
  page?: number | string
  limit?: number | string
  name?: string
  skill?: string
}
export interface RecCandidateInterface {
  email: string
  phone: number | string
  fullName: any
  avatar: string
  address: string
  about: string
  skills: {
    skillId: number
    name: string
  }[]
  projects: {
    projectId: string
    projectName: string
    positionInProject: string
    description: string
  }[]
  awards: {
    awardId: string
    awardName: string
    awardOrganization: string
    awardWinningTime: string
  }[]
  experiences: {
    experienceId: string
    companyName: string
    position: string
    time: string
  }[]
  courses: {
    courseId: string
    courseName: string
    trainningOrganizations: string
    completionTime: string
  }[]
  certificates: {
    certificateId: string
    certificateName: string
    certificateBody: string
    certificationTime: string
  }[]
  educations: {
    educationId: string
    schoolName: string
    specialized: string
    certificate: string
  }[]
  dateOfBirth: string
  interviewerId: string
}

export interface JobReccerListConfig {
  page?: number | string
  size?: number | string
  name?: string
  type?: string
  location?: string
  posName?: string
}

export interface AdminJobListConfig {
  page?: number | string
  size?: number | string
}
export interface AdminJobInterface {
  idJob: string
  name: string
  date: string
  quantity: number
  member: string
}

export interface AdminJobPassInterface {
  name: string
  date: string
  phone: number
  score: string
  state: string
  interview: string
}

export interface AdminDelete {
  fullName: string
  createdAt: string
  clastLoginAt: string
  email: string
  phone: number
  gender: string
  userId: string
  state: string
}
export interface AdminDeleteAcountConfig {
  index: string
  size: string
  fullName: string
}
export interface AdminJobPassListConfig {
  page?: number | string
  size?: number | string
  id?: number | string
}
export interface AcountFrofileInterface {
  userId: string
  name: string
  avatar: string
  phone: number
  address: string
}
export interface AcountFrofileUsersInterface {
  userId: string
  name: string
  avatar: string
  createdAt: string
  phone: number
  address: string
  blackDate: string
  blackReason: string
  email: string
  role: string
}

export interface TypeListInterface {
  type: string
}

export interface SkillListInterface {
  skillId: number
  skill: string
}

export interface DataSearchInterface {
  skill?: string
  type?: string
}

export interface Pagable {
  page?: number | string
  limit?: number | string
}

export interface GetUsersInterviewsParams extends Pagable {}

export type LoadingStatus = 'pending' | 'idle' | 'failed' | 'fulfill'
