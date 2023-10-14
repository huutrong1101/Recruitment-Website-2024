import { FieldSchema } from '../../components/Field/FieldContainer'

export interface EducationFieldList {
  school: string
  major: string
  graduatedYear: string
}

export const EducationSchema: FieldSchema<EducationFieldList> = [
  {
    id: 'school',
    display: 'School'
  },
  {
    id: 'major',
    display: 'Major'
  },
  {
    id: 'graduatedYear',
    display: 'Graduated Year'
  }
]

export interface ExperienceFieldList {
  companyName: string
  position: string
  dateFrom: Date
  dateTo: Date
}

export const ExperienceSchema: FieldSchema<ExperienceFieldList> = [
  {
    id: 'companyName',
    display: 'Company name'
  },
  {
    id: 'position',
    display: 'Position'
  },
  {
    id: 'dateFrom',
    display: 'From',
    type: 'date'
  },
  {
    id: 'dateTo',
    display: 'To',
    type: 'date'
  }
]

export interface CertificateTemplate {
  name: string
  id: string
  receivedDate: Date
  url?: string
}

export const CertificateSchema: FieldSchema<CertificateTemplate> = [
  {
    id: 'name',
    display: 'Certificate Name',
    placeholder: 'AWS DevOps Engineering Professional'
  },
  {
    id: 'id',
    display: 'Certificate Id'
  },
  {
    id: 'receivedDate',
    display: 'Received Date',
    type: 'date'
  },
  {
    id: 'url',
    display: 'Link',
    type: 'url'
  }
]

export interface ProjectTemplate {
  name: string
  description: string
  url: string
}

export const ProjectSchema: FieldSchema<ProjectTemplate> = [
  {
    id: 'name',
    placeholder: 'Github Octocat',
    display: 'Project Name'
  },
  {
    id: `description`,
    display: 'Description',
    placeholder: `A micro-service GitHub bot`
  },
  {
    id: `url`,
    display: 'Link'
  }
]
