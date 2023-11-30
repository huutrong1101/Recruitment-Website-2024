import { PlusIcon, UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Checkbox } from '@mui/material'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import axiosInstance from '../../../../utils/AxiosInstance'

export interface Interviewer {
  name: string | null
  email: string | null
  phone: string | null
  date: string | null
  id: string | null
  position: string | null
}
interface InterviewerPopupProps {
  interviewers: Interviewer[]
  onSelectInterviewer: (newListInterviewer: Interviewer[]) => void
}

export default function InterviewerPopup({ interviewers, onSelectInterviewer }: InterviewerPopupProps) {
  const [isOpen, setIsOpen] = useState(false)

  const [interviewerList, setInterviewerList] = useState<any[]>([])

  useEffect(() => {
    const getInterviewers = async () => {
      try {
        const response = await axiosInstance(`/recruiter/interviewers`)
        setInterviewerList(response.data.result.content)
      } catch (error) {
        console.log(error)
      }
    }
    getInterviewers()
  }, [])

  const [selectedInterviewers, setSelectedInterviewers] = useState<any[]>([])

  useEffect(() => {
    setSelectedInterviewers(interviewers)
  }, [interviewers])

  const handleChoose = (interviewer: any) => {
    const index = selectedInterviewers.findIndex((selected) => selected.interviewerId === interviewer.interviewerId)
    if (index === -1) {
      setSelectedInterviewers([...selectedInterviewers, interviewer])
    } else {
      const updatedSelectedInterviewers = [...selectedInterviewers]
      updatedSelectedInterviewers.splice(index, 1)
      setSelectedInterviewers(updatedSelectedInterviewers)
    }
  }

  const isSelected = (interviewer: any) => {
    return selectedInterviewers.some((selected) => selected.interviewerId === interviewer.interviewerId)
  }

  const handleAdd = () => {
    onSelectInterviewer(selectedInterviewers)
    setIsOpen(false)
  }

  return (
    <div>
      <button
        className={classNames(
          `text-lg font-normal text-white`,
          `flex items-center`,
          `bg-emerald-700 py-2 px-4 rounded-xl mr-4`
        )}
        onClick={() => setIsOpen(true)}
      >
        <UserPlusIcon className='w-6 h-6 mr-2' />
        <p>Add Interviewer</p>
      </button>
      {isOpen && (
        <div className='fixed inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-md'>
          <div className='flex flex-col bg-white border border-gray-300 rounded-lg popup-content h-3/4'>
            <div className='flex justify-end w-full'>
              <button onClick={() => setIsOpen(false)} className={classNames(`px-1 py-1`)}>
                <XMarkIcon className='w-6 h-6 text-gray-500 hover:bg-gray-200 hover:rounded-full' />
              </button>
            </div>
            <div className='px-4 pb-4 overflow-y-auto'>
              <table className='w-full text-sm text-left text-gray-500'>
                {/* Interviewer Info */}
                <thead className='sticky top-0 z-10 text-xs text-gray-700 uppercase bg-gray-50'>
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
                    <th scope='col' className='py-4'></th>
                  </tr>
                </thead>
                <tbody>
                  {interviewerList.map((interviewers: any) => (
                    <tr className='bg-white border-b' key={interviewers.interviewerId}>
                      <td scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap '>
                        {interviewers.fullName}
                      </td>
                      <td className='px-6 py-4'>{interviewers.phone}</td>
                      <td className='px-6 py-4'>{interviewers.email}</td>
                      <td className='px-4 py-4'>
                        <button className='flex' onClick={() => handleChoose(interviewers)}>
                          <Checkbox color='success' size='medium' checked={isSelected(interviewers)} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* /////////// */}
              </table>
            </div>
            <div className='flex items-center justify-center mt-3'>
              <div className='p-2 text-white border rounded-lg cursor-pointer bg-emerald-600' onClick={handleAdd}>
                <PlusIcon className='w-[25px]' />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
