import { ComputerDesktopIcon, ExclamationTriangleIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextareaAutosize } from '@mui/material'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { fetchRecInterviewerSkill } from '../../../redux/reducer/RecInterviewerSilce'
import { JobService } from '../../../services/JobService'
import axiosInstance from '../../../utils/AxiosInstance'
import { JobInterface } from '../../../types/job.type'
import EditJobWidget from './EditJobWidget'
import EditJobCard from './EditJobCard'
import moment from 'moment'

export default function EditJob() {
  const [jobInformation, setJobInformation] = useState([{ icon: <UserIcon />, name: '', value: '' }])
  //############## Handle Get ##############
  const { jobId } = useParams()
  const [job, setJob] = useState<JobInterface | null>(null)
  useEffect(() => {
    const getJobDetail = async () => {
      const response = await axiosInstance.get(`recruiter/jobs/${jobId}`)
      setJob(response.data.result)
    }
    getJobDetail()
  }, [jobId])

  useEffect(() => {
    if (job) {
      setJobInformation([
        {
          icon: <UserIcon />,
          name: 'Employee Type',
          value: job.position
        },
        {
          icon: <MapPinIcon />,
          name: 'Location',
          value: job.location
        },
        {
          icon: <ComputerDesktopIcon />,
          name: 'Position',
          value: job.jobType
        }
      ])
      setName(job?.name || '')
      setDescription(job?.description || '')
      setQuantity(job?.quantity)
      setRequirement(job?.requirement || '')
      setBenefit(job?.benefit || '')
      setSkillsRequired(job?.skills || [])
      setSalaryRange(job?.salaryRange || '')
      setDeadline(job?.deadline || '')
      setjobactive(job?.isActive)
    }
  }, [job])

  const navigate = useNavigate()

  const handleClickOpen = () => {
    navigate({
      pathname: '/recruiter/jobs'
    })
  }

  const skillsArray = job?.skills.map((item) => item)

  // ############## Handle Put ##############

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchRecInterviewerSkill())
  }, [])
  // console.log(showSkill)
  const listSkills = useAppSelector((state) => state.RecInterviewerList.skill)

  const listSkillsData = listSkills.map((skill: any) => ({
    value: skill.skillId,
    label: `${skill.name}`
  }))

  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(job?.quantity || Number)
  const [description, setDescription] = useState('')
  const [requirement, setRequirement] = useState('')
  const [benefit, setBenefit] = useState('')
  const [skillsRequired, setSkillsRequired] = useState<any[]>([])
  const [positionName, setPositionName] = useState([])
  const [location, setLocation] = useState([])
  const [jobType, setjobType] = useState([])
  const [salaryRange, setSalaryRange] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isActive, setjobactive] = useState(true)
  const [selectedValues, setSelectedValues] = useState<any[]>([])

  useEffect(() => {
    setSelectedValues(listSkillsData.filter((skillData) => skillsRequired.includes(skillData.label)))
  }, [skillsRequired])

  const handleSelectChange = (selectedOptions: any) => {
    setSelectedValues(selectedOptions)
  }

  const handleSubmit = (event: any) => {
    event.preventDefault()
    if (name === '') {
      toast.error('Please enter Job Name')
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
    } else if (benefit === '') {
      toast.error('Please enter Benefit')
      return
    } else if (selectedValues.length === 0) {
      toast.error('Please select Skills')
      return
    } else if (salaryRange === '') {
      toast.error('Please enter Salary')
      return
    }

    const dataSkill = selectedValues.map((item) => item.label)

    const data = {
      name: name,
      jobType: jobType,
      quantity: quantity,
      benefit: benefit,
      salaryRange: salaryRange,
      requirement: requirement,
      location: location,
      description: description,
      deadline: moment(deadline).format('YYYY-MM-DD'),
      position: positionName,
      skillRequired: dataSkill
      // name,
      // jobType,
      // position,
      // quantity,
      // benefit,
      // salaryRange,
      // requirement,
      // location,
      // description,
      // isActive,
      // deadline: job?.deadline,
      // skillRequired: dataSkill
    }

    console.log(data)

    toast
      .promise(JobService.editJob(data, job?.jobId), {
        pending: `Job Editing`,
        success: `The Job was Edited`
      })
      .then(() => {
        navigate({
          pathname: '/recruiter/jobs'
        })
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  return (
    <div className={classNames(`job-detail`, `flex flex-col gap-6`)}>
      <div className={classNames(`flex flex-col md:flex-row gap-12`)}>
        {/* Left side description */}
        <div className={classNames(`w-full md:w-8/12`, `flex flex-col gap-6 mt-5`)}>
          {/* Widgets */}
          <EditJobWidget nameData={name} setNameData={setName} quantityData={quantity} setQuantityData={setQuantity} />
          {/* Details */}
          <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
            <div>
              <h1 className='text-2xl font-semibold'>Job description</h1>
              <TextareaAutosize
                minRows={4}
                value={description}
                className='resize-none p-2.5 w-full text-justify bg-white border'
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>

          {/* Requirement */}
          <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
            <div>
              <h1 className='text-2xl font-semibold'>Requirement</h1>
              <TextareaAutosize
                minRows={4}
                value={requirement}
                className='resize-none p-2.5 w-full text-justify bg-white border'
                onChange={(event) => setRequirement(event.target.value)}
              />
            </div>
          </div>

          {/* Benefit */}
          <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
            <div>
              <h1 className='text-2xl font-semibold'>Benefit</h1>
              <TextareaAutosize
                minRows={4}
                value={benefit}
                className='resize-none p-2.5 w-full text-justify bg-white border'
                onChange={(event) => setBenefit(event.target.value)}
              />
            </div>
          </div>

          <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
            <div>
              <h1 className='text-2xl font-semibold'>Skills Require</h1>
              <Select options={listSkillsData} isMulti value={selectedValues} onChange={handleSelectChange} />
            </div>
          </div>
          {/* /Skill */}
          <div className={classNames(`flex`)}>
            <div className={classNames(`px-8 py-8`, `text-justify`)}>
              <button
                onClick={handleSubmit}
                className='rounded-lg bg-[#059669] hover:bg-green-900 px-4 py-2 mx-2 my-1 text-white'
                // onClick={routeChange}
              >
                Save
              </button>
            </div>
            <div className={classNames(`py-8`, `text-justify`)}>
              <button
                className='px-4 py-2 mx-2 my-1 text-white bg-gray-500 rounded-lg hover:bg-gray-900'
                // onClick={deleteJob}
                onClick={handleClickOpen}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        {/* Right side description */}
        <div className={classNames(`w-full md:w-3/12 flex-1 relative mt-5`)}>
          <EditJobCard
            cardData={jobInformation}
            setCardData={setJobInformation}
            setpositionId={setPositionName}
            setLocation={setLocation}
            setjobType={setjobType}
            salary={salaryRange}
            setSalary={setSalaryRange}
          />
        </div>
      </div>
    </div>
  )
}
