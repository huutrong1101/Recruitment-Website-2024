import { ComputerDesktopIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { JobService } from '../../../services/JobService'
import { fetchRecInterviewerSkill } from '../../../redux/reducer/RecInterviewerSilce'
import AddJobWidget from '../../../components/JobCard/AddJobWidget'
import AddJobCard from '../../../components/JobCard/AddJobCard'
import dayjs, { Dayjs } from 'dayjs'

interface Skill {
  skillId: string
  name: string
}

interface Option {
  value: string
  label: string
}

export default function AddJob() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchRecInterviewerSkill())
  }, [])

  const listSkills: Skill[] = useAppSelector((state) => state.RecInterviewerList.skill)

  const listSkillsData = listSkills.map((skill) => ({
    value: skill.skillId,
    label: `${skill.name}`
  }))

  const [jobInformation, setJobInformation] = useState([
    { icon: <UserIcon />, name: 'Employee Type', value: '' },
    { icon: <MapPinIcon />, name: 'Location', value: '' },
    {
      icon: <ComputerDesktopIcon />,
      name: 'Position',
      value: ''
    }
  ])

  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState<number>(0)
  const [description, setDescription] = useState('')
  const [requirement, setRequirement] = useState('')
  const [benefit, setBenefit] = useState('')
  const [skillsRequired, setSkillsRequired] = useState<Option[]>([])
  const [positionName, setPositionName] = useState([])
  const [location, setLocation] = useState([])
  const [jobType, setjobType] = useState([])
  const [salaryRange, setSalaryRange] = useState('')
  const [deadline, setDeadline] = useState<Dayjs | null>(dayjs())

  const selectedDateTime = deadline?.date()

  const selectedValues = skillsRequired.map((option) => option.label)

  const handleSelectChange = (selectedOptions: any) => {
    setSkillsRequired(selectedOptions)
  }

  const navigate = useNavigate()

  const handleSubmit = (event: any) => {
    event.preventDefault()
    if (name === '') {
      toast.error('Please enter Job Name')
      return
    } else if (jobType?.length === 0) {
      toast.error('Please select Job Type')
      return
    } else if (quantity === 0) {
      toast.error('Please enter Quantity')
      return
    } else if (description === '') {
      toast.error('Please enter Description')
      return
    } else if (requirement === '') {
      toast.error('Please enter Requirement')
      return
    } else if (positionName.length === 0) {
      toast.error('Please select Employee Type')
      return
    } else if (benefit === '') {
      toast.error('Please enter Benefit')
      return
    } else if (selectedValues.length === 0) {
      toast.error('Please select Skills')
      return
    } else if (salaryRange === '') {
      toast.error('Please enter Salary')
      return
    } else if (location.length === 0) {
      toast.error('Please select location')
      return
    } else if (selectedDateTime && selectedDateTime < dayjs().date()) {
      // Kiểm tra nếu ngày và giờ đã chọn trước thời gian hiện tại
      toast.error('The selected date and time is in the past.')
      return
    } else {
      const data = {
        name: name,
        jobType: jobType,
        quantity: quantity,
        benefit: benefit,
        salaryRange: salaryRange,
        requirement: requirement,
        location: location,
        description: description,
        deadline: deadline?.format('YYYY-MM-DD'),
        position: positionName,
        skillRequired: selectedValues
      }

      toast
        .promise(JobService.createJob(data), {
          pending: `Creating Job`,
          success: `Job was created`
        })
        .then(() => {
          navigate({
            pathname: '/recruiter/jobs'
          })
        })
        .catch((error) => toast.error(error.response.data.message))
    }
  }

  return (
    <div className={classNames(`job-detail`, `flex flex-col gap-6`)}>
      <div className={classNames(`flex flex-col md:flex-row gap-12`)}>
        {/* Left side description */}
        <form className={classNames(`w-full md:w-8/12`, `flex flex-col gap-6 mt-5`)}>
          {/* Widgets */}
          <AddJobWidget nameData={name} setNameData={setName} quantityData={quantity} setQuantityData={setQuantity} />
          {/* Details */}
          <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
            <div>
              <h1 className='text-2xl font-semibold'>Job description</h1>
              <TextareaAutosize
                id='description'
                minRows={4}
                value={description}
                className='resize-none p-2.5 w-full text-justify bg-white border'
                placeholder='Job description here...'
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>

          {/* Requirement */}
          <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
            <div>
              <h1 className='text-2xl font-semibold'>Requirement</h1>
              <TextareaAutosize
                id='requirement'
                minRows={4}
                value={requirement}
                className='resize-none p-2.5 w-full text-justify bg-white border'
                placeholder='Requirement here...'
                onChange={(event) => setRequirement(event.target.value)}
              />
            </div>
          </div>
          {/* Benefit */}
          <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
            <div>
              <h1 className='text-2xl font-semibold'>Benefit</h1>
              <TextareaAutosize
                id='requirement'
                minRows={4}
                value={benefit}
                className='resize-none p-2.5 w-full text-justify bg-white border'
                placeholder='Requirement here...'
                onChange={(event) => setBenefit(event.target.value)}
              />
            </div>
          </div>

          {/* Skill */}
          <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
            <div>
              <h1 className='text-2xl font-semibold'>Skills Require</h1>
              <Select options={listSkillsData} isMulti value={skillsRequired} onChange={handleSelectChange} />
            </div>
          </div>

          <div className={classNames(`px-8 py-8`, `text-justify`)}>
            <button
              onClick={handleSubmit}
              className='rounded-lg bg-[#059669] hover:bg-green-900 px-4 py-2 mx-2 my-1 text-white'
              // onClick={routeChange}
            >
              Add Job
            </button>
          </div>
        </form>
        {/* Right side description */}
        <div className={classNames(`w-full md:w-3/12 flex-1 relative mt-5`)}>
          <AddJobCard
            cardData={jobInformation}
            setCardData={setJobInformation}
            setpositionId={setPositionName}
            setLocation={setLocation}
            setjobType={setjobType}
            salary={salaryRange}
            setSalary={setSalaryRange}
            deadline={deadline}
            setDeadline={setDeadline}
          />
        </div>
      </div>
    </div>
  )
}
