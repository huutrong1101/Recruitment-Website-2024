import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Checkbox, Input, Modal, Radio, Spin, UploadFile } from 'antd'
import { RecService } from '../../../../../services/RecService'
import { useAppDispatch, useAppSelector } from '../../../../../hooks/hooks'
import moment, { Moment } from 'moment'
import { toast } from 'react-toastify'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { ResumeResponse } from '../../../../../types/resume.type'
import dayjs from 'dayjs'
import PreviewResume from '../../../../UserProfile/UserResume/UserResumeAdd/PreviewResume/PreviewResume'

interface DataType {
  key: number
  stt: number
  name: string
  upload: string
  isUploaded: boolean
  isUploading: boolean
  fileList: UploadFile<any>[]
}

interface DataEducationType {
  key: number
  stt: number
  major: string
  dateRange: [moment.Moment | null, moment.Moment | null] // Use moment.Moment for dateRange
}

interface DataWorkExperienceType {
  key: number
  stt: number
  jobDescription: {
    dateRange: [moment.Moment | null, moment.Moment | null] // Use moment.Moment for dateRange
    company: string
    jobDescription: string
  }
}

interface FormValues {
  title?: string
  name?: string
  GPA?: string
  dateOfBirth?: Moment
  phone?: string
  email?: string
  major?: string
  homeTown?: string
  experience?: string
  jobType?: string
  educationLevel?: string
  english?: string
  goal?: string
  activity?: string
  avatar?: UploadFile[]
  certifications?: DataType[]
  educations?: DataEducationType[]
  workHistories?: DataWorkExperienceType[]
  themeId?: string
}

function SuggestCandidateProfile() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { isUpgrade } = useAppSelector((state) => state.RecJobs)

  const { candidateId } = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState<FormValues | undefined>(undefined)
  const [resumeDetail, setResumeDetail] = useState<ResumeResponse | null>(null)

  useEffect(() => {
    if (candidateId) {
      fetchResumeDetail(candidateId)
    }
  }, [dispatch, candidateId])

  const fetchResumeDetail = async (candidateId: string) => {
    setIsLoading(true)
    try {
      const response = await RecService.getResumeDetail(candidateId)
      if (response && response.data) {
        const data = response.data.metadata
        setResumeDetail(data)

        const formattedEducations = data.educations.map((edu: any, index: number) => ({
          key: index + 1,
          stt: index + 1,
          major: edu.major,
          dateRange: [moment(edu.from), moment(edu.to)]
        }))

        const formattedCertifications = data.certifications.map((cert: any, index: number) => ({
          key: index + 1,
          stt: index + 1,
          name: cert.name,
          upload: cert.uploadFile,
          isUploaded: true,
          isUploading: false
        }))

        const formattedWorkExperiences = data.workHistories.map((edu: any, index: number) => ({
          key: index + 1,
          stt: index + 1,
          jobDescription: {
            dateRange: [moment(edu.from), moment(edu.to)],
            company: edu.workUnit,
            jobDescription: edu.description
          }
        }))

        setFormValues({
          name: data.name,
          title: data.title,
          GPA: data.GPA,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth ? moment(dayjs(data.dateOfBirth).toISOString()) : undefined,
          homeTown: data.homeTown || '',
          experience: data.experience || '',
          jobType: data.jobType || '',
          educationLevel: data.educationLevel || '',
          english: data.english || '',
          goal: data.goal || '',
          activity: data.activity || '',
          email: data.email || '',
          major: data.major || '',
          certifications: formattedCertifications,
          educations: formattedEducations,
          workHistories: formattedWorkExperiences,
          themeId: data.themeId
        })
      }
    } catch (error) {
      console.error('Error fetching resume detail:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <>
      {isLoading ? (
        <div className='flex justify-center items-center my-4 min-h-[70vh] w-full'>
          <Spin size='large' />
        </div>
      ) : resumeDetail ? (
        <>
          <div className='flex flex-col flex-1 gap-4'>
            <div className='w-full border rounded-xl border-zinc-100'>
              <div className='flex items-center justify-between p-2 rounded-tl-lg bg-slate-200 rounded-tr-xl'>
                <div className='flex items-center justify-center gap-5'>
                  <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer' }} className='font-bold' />
                  <h6 className='flex-1 text-lg font-semibold uppercase'>Thông tin ứng viên</h6>
                </div>
              </div>

              <div className='mt-1'>
                {formValues && resumeDetail && (
                  <PreviewResume
                    values={{
                      ...formValues,
                      email: isUpgrade ? formValues.email : 'Thông tin đã ẩn',
                      phone: isUpgrade ? formValues.phone : 'Thông tin đã ẩn'
                    }}
                    previewAvatar={resumeDetail.avatar}
                    templateId={resumeDetail?.themeId}
                    type='watch'
                    setFormValues={setFormValues}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='flex items-center justify-center w-full'>
          <p>Không tìm thấy hồ sơ phù hợp</p>
        </div>
      )}
    </>
  )
}

export default SuggestCandidateProfile
