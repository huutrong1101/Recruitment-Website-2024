import { Timeline, UploadFile } from 'antd'
import moment, { Moment } from 'moment'
import React from 'react'
import { CakeIcon, EnvelopeIcon, MapIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'

interface DataType {
  key: number
  stt: number
  name: string
  upload: string
  isUploaded: boolean
  isUploading: boolean
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
}

interface ResumeThemeProps {
  values: FormValues
  previewAvatar: string
}

function ResumeTemp3({ values, previewAvatar }: ResumeThemeProps) {
  function shouldShowAdditionalInformation(values: FormValues): boolean {
    return Boolean(
      values.educationLevel || values.GPA || values.major || values.experience || values.jobType || values.english
    )
  }

  return (
    <div className='w-full border border-zinc-100 min-h-[600px] py-6 px-8 relative'>
      <div className='absolute border-r-2 top-0 left-0 w-[229px] h-full'></div>
      <div className='relative flex items-start justify-center'>
        <div className='float-left w-[302px]'>
          <div className='pl-4'>
            {previewAvatar ? (
              <img
                className='object-cover w-[150px] h-[150px] border-2 border-white '
                src={previewAvatar}
                alt={`Preview Avatar`}
              />
            ) : (
              <img
                className='object-cover w-[150px] h-[150px] border-2 border-white '
                src='https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
                alt={`Preview Avatar`}
              />
            )}
          </div>
        </div>
        <div className='float-right w-full pl-5'>
          <div className='flex items-center justify-between mb-2'>
            <p className='text-lg font-bold'>{values.name ? values.name : 'HỌ VÀ TÊN'}</p>
            <p>{values.title ? values.title : 'TIÊU ĐỀ HỒ SƠ'}</p>
          </div>

          {values.goal && (
            <div className='flex flex-col w-full'>
              <p className='text-sm font-bold'>MỤC TIÊU NGHỀ NGHIỆP</p>

              <div className='w-full my-2 border-b-2'></div>

              <div className='flex flex-col gap-2 text-xs'>
                <div dangerouslySetInnerHTML={{ __html: values.goal ?? '' }} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='relative flex items-start justify-center mt-3'>
        <div className='float-left w-[302px] flex flex-col gap-5'>
          <div className='flex flex-col w-[90%]'>
            <p className='text-sm font-bold'>LIÊN HỆ</p>

            <div className='w-full my-2 border-b-2 border-blue-200'></div>

            <div className='flex flex-col gap-2 text-xs'>
              <div className='flex items-center gap-2'>
                <PhoneIcon className='w-3 h-3' />
                <p className=''>{values.phone ? values.phone : 'Điền số điện thoại'}</p>
              </div>
              <div className='flex items-center gap-2'>
                <EnvelopeIcon className='w-3 h-3' />
                <p className=''>{values.email ? values.email : 'Điền email'}</p>
              </div>
              <div className='flex items-center gap-2'>
                <CakeIcon className='w-3 h-3' />
                <p className=''>{values.dateOfBirth ? values.dateOfBirth?.format('DD/MM/YYYY') : 'Điền ngày sinh'}</p>
              </div>
              <div className='flex items-center gap-2'>
                <MapPinIcon className='w-3 h-3' />
                <p className=''>{values.homeTown ? values.homeTown : 'Điền địa chỉ'}</p>
              </div>
            </div>
          </div>

          {values.certifications && values.certifications.length > 0 && (
            <div className='flex flex-col w-[90%]'>
              <p className='text-sm font-bold'>CHỨNG CHỈ</p>

              <div className='w-full my-2 border-b-2 border-blue-200'></div>

              <div className='flex flex-col gap-2 text-xs'>
                {values.certifications &&
                  values.certifications.map((certification, index) => (
                    <div key={index} className='flex items-center justify-center'>
                      <a href={certification.upload} className='font-medium' target='_blank'>
                        {certification.name}
                      </a>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {shouldShowAdditionalInformation(values) && (
            <div className='flex flex-col w-[90%]'>
              <p className='text-sm font-bold'>THÔNG TIN BỔ SUNG</p>

              <div className='w-full my-2 border-b-2 border-blue-200'></div>

              <div className='flex flex-col gap-2 text-xs'>
                <p className='text-xs font-medium'>
                  <span className='font-bold'>Học vấn:</span> <span className=''>{values.educationLevel}</span>
                </p>
                <p className='text-xs font-medium'>
                  <span className='font-bold'>Điểm GPA:</span> <span className=''>{values.GPA} / 4.0</span>
                </p>
                <p className='text-xs font-medium '>
                  <span className='font-bold'>Ngành:</span> <span className=''>{values.major}</span>
                </p>
                <p className='text-xs font-medium '>
                  <span className='font-bold'>Kinh nghiệm làm việc:</span> <span className=''>{values.experience}</span>
                </p>
                <p className='text-xs font-medium '>
                  <span className='font-bold'>Loại hình công việc:</span> <span className=''>{values.jobType}</span>
                </p>
                <p className='text-xs font-medium '>
                  <span className='font-bold'>Trình độ ngoại ngữ:</span> <span className=''>{values.english}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-col float-right w-full gap-5 pl-5'>
          {values.workHistories && values.workHistories.length > 0 && (
            <div className='flex flex-col w-full'>
              <p className='text-sm font-bold'>KINH NGHIỆM LÀM VIỆC</p>

              <div className='w-full my-2 border-b-2'></div>

              <div className='flex flex-col mt-1 text-xs'>
                <Timeline>
                  {values.workHistories &&
                    values.workHistories.map((work, index) => {
                      // Kiểm tra hợp lệ của dateRange
                      const isValidDateRange =
                        work.jobDescription.dateRange[0] &&
                        work.jobDescription.dateRange[1] &&
                        moment(work.jobDescription.dateRange[0]).isValid() &&
                        moment(work.jobDescription.dateRange[1]).isValid()
                      return (
                        <Timeline.Item key={index}>
                          <div className='flex items-center justify-between gap-2 pb-1'>
                            <p className='text-xs font-medium uppercase'>{work.jobDescription.company}</p>
                            {isValidDateRange && (
                              <span className='text-xs'>
                                {moment(work.jobDescription.dateRange[0]).format('DD/MM/YYYY')} -
                                {moment(work.jobDescription.dateRange[1]).format('DD/MM/YYYY')}
                              </span>
                            )}
                          </div>
                          <div className='text-gray-400 '> {work.jobDescription.jobDescription}</div>
                        </Timeline.Item>
                      )
                    })}
                </Timeline>
              </div>
            </div>
          )}

          {values.educations && values.educations.length > 0 && (
            <div className='flex flex-col w-full'>
              <p className='text-sm font-bold'>HỌC VẤN</p>

              <div className='w-full my-2 border-b-2'></div>

              <div className='flex flex-col gap-2 mt-1 text-xs'>
                <Timeline>
                  {values.educations &&
                    values.educations.map((education, index) => {
                      // Kiểm tra hợp lệ của dateRange
                      const isValidDateRange =
                        education.dateRange[0] &&
                        education.dateRange[1] &&
                        moment(education.dateRange[0]).isValid() &&
                        moment(education.dateRange[1]).isValid()
                      return (
                        <Timeline.Item key={index}>
                          <div className='flex items-center justify-between gap-2 pb-1'>
                            <p className='text-xs font-medium uppercase'>{education.major}</p>
                            {isValidDateRange && (
                              <span className='text-xs'>
                                {moment(education.dateRange[0]).format('DD/MM/YYYY')} -
                                {moment(education.dateRange[1]).format('DD/MM/YYYY')}
                              </span>
                            )}
                          </div>
                        </Timeline.Item>
                      )
                    })}
                </Timeline>
              </div>
            </div>
          )}

          {values.activity && (
            <div className='flex flex-col w-full'>
              <p className='text-sm font-bold uppercase'>Giải thưởng / Hoạt động ngoại khoá</p>

              <div className='w-full my-2 border-b-2'></div>

              <div className='flex flex-col gap-2 text-xs'>
                <div dangerouslySetInnerHTML={{ __html: values.activity ?? '' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeTemp3
