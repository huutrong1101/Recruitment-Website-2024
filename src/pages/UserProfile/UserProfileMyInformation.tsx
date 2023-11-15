import { useEffect, useState } from 'react'
// import CreatableSelect from "react-select/creatable";
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { toast } from 'react-toastify'
import FieldContainer from '../../components/Field/FieldContainer'
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner'
import { getSkills } from '../../services/CandidateService'
import { UserService } from '../../services/UserService'
import { CertificateSchema, EducationSchema, ExperienceSchema, ProjectSchema } from './UserProfileMyInformationSchema'
import { LoadingStatus } from '../../types/services'

// const colourOptions = [
//   { value: "reactjs", label: "ReactJS" },
//   { value: "c and csharp", label: "C/C++" },
//   { value: "html", label: "HTML" },
//   { value: "java", label: "Java" },
// ];

const animatedComponents = makeAnimated()

export default function UserProfileMyInformation() {
  // Container item is a item that fetch from information field
  const [containerItem, setContainerItem] = useState({
    education: [],
    experience: [],
    certificate: [],
    project: [],
    skills: []
  })
  const [loadingState, setLoadingState] = useState<LoadingStatus>('idle')
  const [skillOptions, setSkillOptions] = useState<any[]>([])
  const navigate = useNavigate()

  const convertSkillsFormat = (inputSkills: any[]) => {
    return inputSkills.map((skill) => {
      return {
        value: skill.skillId || '',
        label: skill.name || ''
      }
    })
  }

  useEffect(() => {
    setLoadingState('pending')
    UserService.getUserInformation()
      .then(async (response) => {
        const fetchContainerItem = await response.data.result
        const skillsFormat = convertSkillsFormat(fetchContainerItem.skills)
        const dataFormatSkills = { ...fetchContainerItem, skills: skillsFormat }

        if (dataFormatSkills !== null) {
          // setContainerItem({ ...JSON.parse(fetchContainerItem) })
          setContainerItem(dataFormatSkills)
        }
      })
      .then(() => setLoadingState('fulfill'))
      .catch(() => setLoadingState('failed'))

    return () => {}
  }, [])

  useEffect(() => {
    getSkills()
      .then((response) => {
        const { result } = response.data
        setSkillOptions(
          result.map(({ skillId, name }: any) => {
            return {
              label: name,
              value: skillId
            }
          })
        )
      })
      .catch(() => toast.error(`Cannot fetch candidate skills`))
  }, [])

  // const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (selectedOptions: any) => {
    // setSelectedOptions(selectedOptions);
    // handleValuesUpdate("skills", selectedOptions);
    const clonedObject = structuredClone(containerItem)
    // @ts-ignore
    clonedObject['skills'] = selectedOptions
    setContainerItem({ ...clonedObject })
  }

  const handleSubmit = (e: any, updatedItem: any) => {
    e !== null && e.preventDefault()

    toast.promise(UserService.updateUserInformation(updatedItem), {
      pending: `Updating your information`,
      success: `Successfully update the information`,
      error: `There was an error when updated the information`
    })
  }

  const handleValuesUpdate = (ofId: string, values: any[]) => {
    const clonedObject = structuredClone(containerItem)
    // @ts-ignore
    clonedObject[ofId] = values
    setContainerItem({ ...clonedObject })
    handleSubmit(null, { ...clonedObject })
    // Maybe save the information
    // toast.promise(
    //   {},
    //   {
    //     pending: `Saving changes`,
    //     error: `Failed to save change`,
    //     success: `Successfully changed`,
    //   },
    // );
  }

  return (
    <div className='flex flex-col flex-1 gap-4'>
      <form onSubmit={(e) => handleSubmit(e, containerItem)}>
        <div className='pb-12'>
          {loadingState === 'pending' ? (
            <div className='min-h-[60vh] flex flex-col items-center justify-center text-2xl'>
              <LoadSpinner />
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6'>
              <FieldContainer
                label='Education'
                // values={educationItems}
                // onChange={setEducation}
                initialValues={containerItem.education}
                primaryLabel={`school`}
                fieldListSchema={EducationSchema}
                onFieldUpdate={(data) => handleValuesUpdate('education', data)}
              />

              <FieldContainer
                label='Experience'
                initialValues={containerItem.experience}
                fieldListSchema={ExperienceSchema}
                primaryLabel={`companyName`}
                onFieldUpdate={(data) => handleValuesUpdate('experience', data)}
              />

              <FieldContainer
                label='Certificate'
                initialValues={containerItem.certificate}
                fieldListSchema={CertificateSchema}
                primaryLabel={`name`}
                onFieldUpdate={(data) => handleValuesUpdate('certificate', data)}
              />

              <FieldContainer
                label='Project'
                initialValues={containerItem.project}
                fieldListSchema={ProjectSchema}
                primaryLabel={`name`}
                onFieldUpdate={(data) => handleValuesUpdate('project', data)}
              />

              <div className='pb-8 mb-3 border-b col-span-full border-gray-900/10'>
                <label
                  htmlFor='street-address'
                  className='text-xl font-bold leading-7 text-center text-green-600 font-Outfit'
                >
                  Skill
                </label>
                <div className='flex flex-wrap items-center justify-start mt-3 '>
                  <Select
                    // defaultValue={[skill[0]]}
                    isMulti
                    name='colors'
                    options={skillOptions}
                    className='w-full px-4 basic-multi-select'
                    classNamePrefix='select'
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    value={containerItem.skills}
                    onChange={handleSelectChange}
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        width: '96.5%'
                      })
                    }}
                  />
                </div>
                {/* <small className={classNames(`mx-4 text-gray-400`)}>
                  Please save your skill after changes.
                </small> */}
              </div>
            </div>
          )}
        </div>
        <div className='flex items-center justify-end gap-x-6'>
          <button
            type='button'
            onClick={() => {
              navigate('/print-resume')
            }}
            className='px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
          >
            Export to pdf
          </button>
          <button
            type='submit'
            className='px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
