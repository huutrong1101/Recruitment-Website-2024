import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { HiMail } from 'react-icons/hi'
import { HiMapPin, HiPhone } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import { useAppSelector } from '../../hooks/hooks'
import { UserService } from '../../services/UserService'
import {
  CertificateSchema,
  EducationSchema,
  ExperienceSchema,
  ProjectSchema
} from '../UserProfile/UserProfileMyInformationSchema'
import './styles/PrintResume.css'
import moment from 'moment'

function ResumeRenderSection<T>({
  keyId,
  value,
  primaryLabelKey
}: {
  keyId: string
  value: any
  primaryLabelKey: string
}) {
  const parseSchemaFromId = (keyId: string) => {
    if (keyId === 'education') {
      return EducationSchema
    } else if (keyId === 'experience') {
      return ExperienceSchema
    } else if (keyId === 'certificate') {
      return CertificateSchema
    } else if (keyId === 'project') {
      return ProjectSchema
    }
    throw new Error(`Unable to parse schema from id ${keyId}`)
  }

  function formatDate(dateString: string) {
    const formattedDate = moment(dateString).format('DD-MM-YYYY')
    return formattedDate
  }

  return (
    <div className={classNames(`mb-4`)}>
      {parseSchemaFromId(keyId).map(({ id, display }) => {
        const dateFields = ['graduatedYear', 'dateFrom', 'dateTo', 'receivedDate']
        const isDateField = dateFields.includes(id)
        const formattedValue = isDateField ? formatDate(value[id]) : value[id]

        return (
          <p
            className={classNames({
              'font-bold text-black': primaryLabelKey === id
            })}
          >
            {formattedValue}
          </p>
        )
      })}
    </div>
  )
}

export default function PrintResume() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAppSelector((app) => app.Auth)

  const convertSkillsFormat = (inputSkills: any[]) => {
    return inputSkills.map((skill) => {
      return {
        value: skill.skillId || '',
        label: skill.name || ''
      }
    })
  }

  useEffect(() => {
    setLoading(true)
    UserService.getUserInformation()
      .then(async (response) => {
        const fetchContainerItem = await response.data.result
        const skillsFormat = convertSkillsFormat(fetchContainerItem.skills)
        const dataFormatSkills = { ...fetchContainerItem, skills: skillsFormat }

        if (dataFormatSkills !== null) {
          // setContainerItem({ ...JSON.parse(fetchContainerItem) })
          setData(dataFormatSkills)
        }
      })
      .catch(() => toast.error(`There was an error when fetching user information`))
      .finally(() => {
        setLoading(false)
      })

    return () => {}
  }, [])

  const selectPrimaryLabelKey = (keyId: string) => {
    if (keyId === 'education') {
      return 'school'
    } else if (keyId === 'experience') {
      return 'companyName'
    } else if (keyId === 'certificate') {
      return 'certificateName'
    } else if (keyId === 'project') {
      return 'projectName'
    }
    throw new Error(`Unable to parse schema from id ${keyId}`)
  }

  return (
    <div className={`print-resume`}>
      <div className={`print-action-bar flex flex-row-reverse mb-4`}>
        <div className={`w-20`}>
          <PrimaryButton
            className={`disabled:animate-pulse print:hidden`}
            text='Print'
            disabled={loading}
            onClick={() => {
              window.print()
            }}
          />
        </div>
      </div>
      <div className='inset-0 mb-4 overflow-y-auto border print:border-0 print:mb-0'>
        <div className='flex flex-col p-6 print:p-2'>
          {/* Header */}
          <div className='flex flex-row flex-1 gap-6'>
            <div className={classNames(`w-2/3`)}>
              <h1 className={classNames(`text-4xl font-bold my-2`)}>{user?.fullName}</h1>
            </div>
            <div className={classNames(`my-2 text-emerald-800`)}>
              <div className={`flex flex-row items-center gap-2`}>
                <HiMail />
                <h1 className={classNames(`text-emerald-800 underline`)}>
                  <Link to='mailto:aaa'>{user?.email}</Link>
                </h1>
              </div>
              <div className={`flex flex-row items-center gap-2`}>
                <HiPhone />
                <h1 className={classNames(`text-emerald-800`)}>{user?.phone}</h1>
              </div>

              <div className={`flex flex-row items-center gap-2`}>
                <HiMapPin />
                <h1 className={classNames(`text-emerald-800`)}>{user?.address}</h1>
              </div>
            </div>
          </div>
          {/* Body */}
          <div className={classNames(`border-b border-zinc-200 my-4`)} />

          {loading ? (
            <div className={classNames(`flex flex-col items-center justify-center text-3xl min-h-[50vh]`)}>
              <LoadSpinner />
            </div>
          ) : (
            <div>
              {/* Separate onto a section */}
              <div className={classNames(`flex flex-col flex-wrap max-h-80vh`)}>
                {[...Object.keys(data)].map((keyId, _idx) => {
                  // @ts-ignore
                  if (data[keyId].length === 0) {
                    return <></>
                  }

                  return (
                    <div className={classNames(`text-zinc-500  mb-12`)} key={_idx}>
                      <h1 className={classNames(`font-semibold text-emerald-800 text-2xl capitalize`)}>{keyId}</h1>

                      <div className={classNames(`inline-block mx-6`)}>
                        {keyId !== 'skills' ? (
                          // @ts-ignore
                          data[keyId].map((value, index) => (
                            <ResumeRenderSection
                              keyId={keyId}
                              value={value}
                              primaryLabelKey={selectPrimaryLabelKey(keyId)}
                            />
                          ))
                        ) : (
                          <>
                            {/* @ts-ignore */}
                            {data[keyId].map(({ label, _value }, _index) => (
                              <span className={classNames(`text-emerald-600 px-4 py-4 inline-block`)} key={_index}>
                                {label}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
