import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { QuestionListInterface } from '../../../types/question.type'
import { useAppSelector } from '../../../hooks/hooks'
import { InterviewService } from '../../../services/InterviewService'
import axiosInstance from '../../../utils/AxiosInstance'

const INITIAL_INPUT_DATA = {
  note: '',
  content: '',
  type: '',
  skill: ''
}

interface Skill {
  skillId: string
  name: string
}

export default function AddQuestion({ observation, onClick }: any) {
  const [addQuestion, setAddQuestion] = useState('')

  const [dataSearch, setDataSearch] = useState({
    skill: '',
    type: ''
  })

  // const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const skills: QuestionListInterface[] = useAppSelector((state) => state.QuestionList.skills)
  const types: QuestionListInterface[] = useAppSelector((state) => state.QuestionList.types)

  const [showSkills, setShowSkills] = useState(skills)
  const [showTypes, setShowTypes] = useState(types)

  const [triggeredSkill, setTriggeredSkill] = useState(false)
  const [triggeredType, setTriggeredType] = useState(false)

  const [inputData, setInputData] = useState(INITIAL_INPUT_DATA)

  useEffect(() => {
    const fetchSkillType = async () => {
      const response = await axiosInstance(`interviewers/skills`)
      const res = await axiosInstance(`interviewers/type`)
      setShowTypes(res.data.result)
      setShowSkills(response.data.result)
      setDataSearch({
        ...dataSearch
      })
    }
    fetchSkillType()
  }, [])

  const [isActive, setIsActive] = useState(false)
  const handleActive = (e: any) => setIsActive(!isActive)

  const handleOnClick = (event: any) => {
    if (event.target.id === 'container' || event.target.id === 'Submit') onClick()
  }

  const handleSubmitAdd = (e: any) => {
    e.preventDefault()
    // const foundSkill: any = showSkills.find((skill) => skill?.name === inputData?.skill)
    const data = {
      content: inputData.content,
      note: inputData.note,
      type: inputData.type,
      skill: inputData.skill
      // skillId: foundSkill?.skillId || null
    }

    if (data.content === '') {
      toast.promise(InterviewService.error(data.content), {
        error: 'Please fill full question information and reload page'
      })
    }

    if (data.type === '') {
      toast.promise(InterviewService.error(data.type), {
        error: 'Please select Type '
      })
    }

    if (data.content !== ' ' && triggeredType && triggeredSkill) {
      toast
        .promise(InterviewService.createQuestion(data), {
          pending: 'Adding the question',
          success: 'The question was added. Please RELOAD page',
          error: 'Please fill full question information'
        })
        .then(() => setInputData(INITIAL_INPUT_DATA))
    }
  }

  if (!observation) return null
  return (
    <div
      className='fixed inset-0 z-20 flex items-center justify-center bg-black rounded-lg bg-opacity-10 backdrop-blur-sm '
      id='Submit'
      onClick={handleOnClick}
    >
      <div className='relative flex flex-col w-1/2 bg-white rounded-lg h-3/4 drop-shadow-md'>
        <div className='flex justify-start m-5 text-lg font-medium'>Add Question</div>
        <div className='mx-5 my-3 font-normal text-md'>Content</div>
        <div className='flex flex-col items-center w-full gap-y-5'>
          <div className='w-11/12 p-2 mx-5 border-2 rounded-md h-fit border-emerald-600'>
            <textarea
              className='resize-none w-full flex outline-none h-[20vh]'
              placeholder='Question here'
              onChange={(e) => setInputData({ ...inputData, content: e.target.value })}
            ></textarea>
          </div>
        </div>
        <div className='flex h-full'>
          <div className='flex flex-col w-3/5 h-[83%] '>
            <div className='mx-5 my-1 font-normal text-md'>Note</div>
            <div className='flex justify-center w-full h-full'>
              <div className='w-11/12 h-full p-2 ml-6 border-2 rounded-md border-emerald-600 '>
                <textarea
                  className='w-full h-full outline-none resize-none '
                  placeholder='Answer'
                  onChange={(e) => setInputData({ ...inputData, note: e.target.value })}
                ></textarea>
              </div>
            </div>
          </div>
          {/* skill button */}
          <div className='relative flex flex-col w-2/5 p-2'>
            <div className='font-normal text-md'>Skill</div>
            <Menu as='div' className='w-full h-[25%] relative flex flex-col z-10'>
              <div className='relative flex flex-col '>
                <Menu as='div' className=' h-fit'>
                  <div className='absolute w-2/3 '>
                    <div className='w-full h-full '>
                      <Menu.Button
                        className='flex items-center w-full p-3 text-white border border-transparent rounded-md bg-emerald-600 active:border-emerald-600 active:text-emerald-600 active:bg-white'
                        onClick={handleActive}
                      >
                        <div className='inline-flex justify-between w-full '>
                          {inputData.skill || 'Skill'}
                          <ChevronDownIcon className='w-5 h-5 pt-1' />
                        </div>
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                      >
                        <Menu.Items className='flex flex-col items-start w-full h-full bg-gray-200 rounded-md shadow-md cursor-pointer aboslute bg-opacity-90 max-h-[20vh] overflow-hidden overflow-y-scroll'>
                          <div className='w-full h-full text-black border rounded-md border-zinc-200'>
                            {showSkills.map((skill: any, index) => (
                              <Menu.Item key={index}>
                                {({ active }) => (
                                  <p
                                    className={classNames(
                                      active ? 'bg-gray-100 text-gray-900 bg-opacity-80 ' : 'text-gray-700',
                                      'p-2',
                                      'block  text-sm'
                                    )}
                                    // onClick={() => handleSetTech(type)}

                                    onClick={() => {
                                      // handleActive
                                      setTriggeredSkill(true)
                                      setInputData({
                                        ...inputData,
                                        skill: skill
                                      })
                                    }}
                                  >
                                    {skill}
                                  </p>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </div>
                  </div>
                </Menu>
              </div>
            </Menu>
            {/* Type button */}
            <div className='mt-2 font-normal text-md'>Type</div>
            <Menu as='div' className='w-full h-[25%] relative flex flex-col'>
              <div className='absolute w-2/3 '>
                <Menu.Button
                  className='flex items-center w-full p-3 my-1 text-white border border-transparent rounded-md h-fit bg-emerald-600 active:border-emerald-600 active:text-emerald-600 active:bg-white'
                  onClick={handleActive}
                >
                  <div className='inline-flex justify-between w-full '>
                    {inputData.type || 'Type'}
                    <ChevronDownIcon className='w-5 h-5 pt-1' />
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='flex flex-col items-start w-full h-full bg-gray-200 rounded-md shadow-md cursor-pointer bg-opacity-80 aboslute '>
                    <div className='w-full h-full text-black border rounded-md border-zinc-200'>
                      {showTypes.map((type: any, index: any) => (
                        <Menu.Item key={index}>
                          {({ active }) => (
                            <p
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900 bg-opacity-80 ' : 'text-gray-700',
                                'p-2',
                                'block  text-sm'
                              )}
                              onClick={() => {
                                // handleActive
                                setTriggeredType(true)
                                setInputData({ ...inputData, type: type })
                              }}
                            >
                              {type}
                            </p>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </div>
            </Menu>
            <div className='w-full px-3 my-6 font-normal h-1/5 text-md'>
              <div className='flex items-end justify-end w-full h-full '>
                <button
                  className='px-6 py-2 text-white border border-transparent rounded-md w-fit h-fit bg-emerald-600 hover:border-emerald-600 hover:text-emerald-600 hover:transition-all hover:bg-white active:bg-zinc-200 active:border-emerald-600 active:drop-shadow-md disabled:bg-gray-700 disabled:hover:text-white'
                  id='Submit'
                  disabled={inputData.content === '' || inputData.skill === '' || inputData.type === ''}
                  onClick={handleSubmitAdd}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
