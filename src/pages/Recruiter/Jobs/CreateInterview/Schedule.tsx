import { TrashIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import dayjs, { Dayjs } from 'dayjs'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../../../../utils/AxiosInstance'
import { InterviewService } from '../../../../services/InterviewService'
import { StateService } from '../../../../services/changeState'
import InterviewerPopup, { Interviewer } from './InterviewerPopup'
import LoadSpinner from '../../../../components/LoadSpinner/LoadSpinner'
import DatePicker from './DatePicker'

interface UserProps {
  candidateId: string
  candidateFullName: string
  fullName: string
  candidateEmail: string
  phone: string
  address: string
  dateOfBirth: Date
}

interface Skill {
  skillId: string
  name: string
}

export default function Schedule() {
  const { userId, jobId } = useParams()

  const [interviewerArray, setInterviewers] = useState<any[]>([])

  const [candidate, setCandidate] = useState<UserProps>()

  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs())

  const [isLoading, setIsLoading] = useState(false)

  const currentDate = new Date()

  useEffect(() => {
    setIsLoading(true)
    try {
      const fetchDataCandidate = async () => {
        const res = await axiosInstance.get(`recruiter/jobs/${jobId}/candidates/${userId}`)
        setCandidate(res.data.result)
      }
      fetchDataCandidate()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleOnSelectInterviewer = (newListInterviewer: Interviewer[]) => {
    setInterviewers(newListInterviewer)
  }

  const handleDeleteInterviewer = (interviewerId: string) => {
    const newList = interviewerArray.filter((interviewer: any) => interviewer.interviewerId !== interviewerId)
    setInterviewers(newList)
  }

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date)
  }

  const handleCreateInterview = () => {
    const listInterviewersId = interviewerArray.map((interviewer) => interviewer.interviewerId)
    const selectedDateTime = selectedDate?.toDate() // Chuyển ngày và giờ đã chọn sang dạng Date

    if (selectedDateTime && selectedDateTime < new Date()) {
      // Kiểm tra nếu ngày và giờ đã chọn trước thời gian hiện tại
      toast.error('The selected date and time is in the past.')
      return // Dừng quá trình tạo buổi phỏng vấn
    }

    if (listInterviewersId.length === 0) {
      toast.error('Please select at least one interviewer.')
      return // Dừng quá trình tạo buổi phỏng vấn
    }

    const timeFormat = selectedDate?.format('YYYY-MM-DDTHH:mm:ss.SSSZ')

    const data = {
      jobApplyId: jobId || '',
      time: timeFormat || '',
      interviewersId: listInterviewersId,
      candidateId: userId
    }

    toast
      .promise(InterviewService.createInterview(data), {
        pending: 'Creating the interview',
        success: 'The interview was created'
      })
      .then(() => {
        handleChangeState()
        routeChange()
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const handleChangeState = () => {
    const data = {
      candidateId: userId || '',
      jobId: jobId || '',
      state: 'received'
    }
    StateService.changeState(data)
  }

  let navigate = useNavigate()
  const routeChange = () => {
    let path = `../jobdetail/${jobId}`
    navigate(path)
  }

  const handleOnClick = () => {
    // console.log("check");
    handleCreateInterview()
    // handleChangeState();
    // routeChange();
  }

  return (
    <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
      <div className={classNames(`flex justify-between `)}>
        <h1 className='text-2xl font-semibold'>Schedule</h1>

        {/* Add Interviewer */}
        <InterviewerPopup interviewers={interviewerArray} onSelectInterviewer={handleOnSelectInterviewer} />
        {/* /////// */}
      </div>

      <div className='p-4 overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-500'>
          {/* Candidate's info */}
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
            <tr>
              <th scope='col' className='px-6 py-4'>
                Candidate's Name
              </th>
              <th scope='col' className='px-6 py-4'>
                Phone Number
              </th>
              <th scope='col' className='px-6 py-4'>
                Email
              </th>
              {/* <th scope="col" className="px-6 py-4">
                Date created
              </th> */}
              <th scope='col' className='py-4'>
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <div className='flex justify-center my-4'>
                <LoadSpinner className='text-3xl text-emerald-500' />
              </div>
            ) : (
              <>
                {candidate && (
                  <>
                    <tr className='bg-white border-b ' key={candidate.candidateId}>
                      <td scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap '>
                        {candidate.candidateFullName}
                      </td>
                      <td className='px-6 py-4'>{candidate.phone}</td>
                      <td className='px-6 py-4'>{candidate.candidateEmail}</td>

                      <td className='px-4 py-4'>
                        <button>
                          <TrashIcon className='w-6 h-6' />
                        </button>
                      </td>
                    </tr>
                  </>
                )}
              </>
            )}
          </tbody>
          {/* ////////////// */}
          {/* Interviewer Info */}
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
            <tr>
              <th scope='col' className='px-6 py-4'>
                Interviewer's Name
              </th>
              <th scope='col' className='px-6 py-4'>
                Phone Number
              </th>
              <th scope='col' className='px-6 py-4'>
                Email
              </th>
              {/* <th scope="col" className="px-6 py-4">
                Date created
              </th> */}
              <th scope='col' className='py-4'>
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {interviewerArray.map((interviewers, index) => (
              <tr className='bg-white border-b' key={index}>
                <td scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap '>
                  {interviewers.fullName}
                </td>
                <td className='px-6 py-4'>{interviewers.phone}</td>
                <td className='px-6 py-4'>{interviewers.email}</td>
                {/* <td className="px-6 py-4">{interviewer.date}</td> */}
                <td className='px-4 py-4'>
                  <button onClick={() => handleDeleteInterviewer(interviewers.interviewerId)}>
                    <TrashIcon className='w-6 h-6' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {/* /////////// */}
        </table>
      </div>
      <div className='flex items-start justify-start w-1/2 gap-3 px-4'>
        <h1>Choose Date</h1>
        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          // minDate={currentDate}
        />
      </div>
      <div className={classNames(`flex justify-center gap-10`)}>
        <button
          className={classNames(
            `text-lg font-normal text-white`,
            `flex items-center`,
            `bg-[#059669] hover:bg-green-900 py-2 px-4 rounded-xl`
          )}
          onClick={handleOnClick}
        >
          Save
        </button>
        <button
          className={classNames(
            `text-lg font-normal text-white`,
            `flex items-center`,
            `text-white bg-red-700 hover:bg-red-900 py-2 px-4 rounded-xl`
          )}
          onClick={routeChange}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
