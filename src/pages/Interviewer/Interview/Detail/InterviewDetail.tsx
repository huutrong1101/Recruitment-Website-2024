import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../../hooks/hooks'

// Component

// Function from Slice
import { fetchINTCandidatesByID } from '../../../../redux/reducer/INTCandidatesSlice'
import {
  fetchINTInterviewByID,
  fetchSkills,
  fetchTypes,
  setSkill,
  setText,
  setType
} from '../../../../redux/reducer/INTInterviewsSlice'

// Icon
import { CheckIcon, MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/20/solid'
import { BsFilterLeft } from 'react-icons/bs'

// Status
import LoadSpinner from '../../../../components/LoadSpinner/LoadSpinner'
import { JOB_POSITION, TYPE_alter } from '../../../../utils/Localization'
import { STATUS } from '../../../../utils/contanst'
import { formatDDMMYY } from '../../Candidate/CandidateRecent'
import {
  assignQuestionForInterview,
  deleteQuestionOfInterview,
  fetchINTAssignedQuestions,
  fetchINTQuestionData,
  removeQuestions,
  selectQuestions,
  setEmptySelectedQuestions
} from '../../../../redux/reducer/INTQuestionsSlice'
import INTCandidateDetail from '../../Candidate/Detail/INTCandidateDetail'

function formatHHMM(date: any) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}
export function truncatedString(str: any) {
  const maxLength = 50
  if (str && str.length > maxLength) {
    return str.substring(0, maxLength - 3) + '...'
  }
  return str
}
export function checkCompleteMarkScore(lst: any) {
  let sum = 0
  for (let i = 0; i < lst.length; i++) {
    if (lst[i]?.score === '') {
      return false
    } else sum += lst[i]?.score
  }
  if (sum === 0) return false
  return true
}
function calculateTotalScore(lst: any) {
  let sum = 0
  for (let i = 0; i < lst.length; i++) {
    sum += lst[i]?.score
  }
  return sum
}
export function isDateReached(targetDate: any) {
  var currentDate = new Date()
  if (!(targetDate instanceof Date)) {
    targetDate = new Date(targetDate)
  }
  if (currentDate > targetDate) {
    return true
  } else {
    return false
  }
}

const InterviewDetail = () => {
  const { id } = useParams()
  const ID: string = id!
  const { INTSingleInterview, INTSingleInterviewStatus, skills, types, text, skill, type } = useAppSelector(
    (state: any) => state.INTInterviews
  )

  const { searchQuestions, searchQuestionsStatus, selectedQuestions, assignedQuestions, assignedQuestionsStatus } =
    useAppSelector((state: any) => state.INTQuestions)

  const dispatch = useAppDispatch()

  const [view, setView] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleChange = (event: any) => {
    const textFilter = event.target.value
    dispatch(setText(textFilter))
    dispatch(fetchINTQuestionData(`?content=${textFilter}&skill=${skill}&typeQuestion=${type}`))
    setTimeout(() => {
      setShowDropdown(true)
    }, 300)
  }
  const handleClickType = (event: any) => {
    const typeFilter = event.target.value
    dispatch(setType(typeFilter))
    dispatch(fetchINTQuestionData(`?content=${text}&skill=${skill}&typeQuestion=${typeFilter}`))
    setTimeout(() => {
      setShowDropdown(true)
    }, 300)
  }
  const handleClickSkill = (event: any) => {
    const skillFilter = event.target.value
    dispatch(setSkill(skillFilter))
    dispatch(fetchINTQuestionData(`?content=${text}&skill=${skillFilter}&typeQuestion=${type}`))
    setTimeout(() => {
      setShowDropdown(true)
    }, 300)
  }

  const handleAdd = (question: any) => {
    dispatch(selectQuestions({ ID, question }))
  }
  const handleRemove = (question: any) => {
    dispatch(removeQuestions({ ID, question }))
  }
  const handleSave = async () => {
    await dispatch(assignQuestionForInterview({ ID, selectedQuestions }))
    dispatch(setEmptySelectedQuestions({ ID }))
    dispatch(fetchINTAssignedQuestions(id))
  }
  const handleDelete = async (question: any) => {
    await dispatch(deleteQuestionOfInterview({ ID, question }))
    dispatch(fetchINTAssignedQuestions(id))
  }

  const handleDropdownBlur = () => {
    setTimeout(() => {
      setShowDropdown(false)
    }, 200)
  }

  const showCandidate = () => {
    dispatch(fetchINTCandidatesByID(ID))
    setView(true)
  }

  useEffect(() => {
    dispatch(fetchINTInterviewByID(id))
    dispatch(fetchINTAssignedQuestions(id))
    dispatch(fetchSkills())
    dispatch(fetchTypes())
  }, [])

  if (INTSingleInterviewStatus === STATUS.IDLE || INTSingleInterviewStatus === STATUS.LOADING) {
    return (
      <div className='InterviewDetail '>
        <div className='px-6 py-6 mt-8 border-2 shadow-xl rounded-xl'>
          <div className='text-2xl font-semibold'>Interview Information</div>

          <div className='mt-2 text-base'>
            Job Name: <span className='ml-2 text-sm'>{INTSingleInterview?.jobName}</span>
          </div>
          <div className='text-base'>
            Position Recruiment: <span className='ml-2 text-sm'>{JOB_POSITION[INTSingleInterview?.position]}</span>
          </div>
          <div className='text-base'>
            Date:{' '}
            <span className='ml-2 text-sm'>
              {formatHHMM(INTSingleInterview?.time) + ' ' + formatDDMMYY(INTSingleInterview?.time)}
            </span>
          </div>
          <div className='text-base'>
            Link Meeting:
            <Link to={INTSingleInterview?.interviewLink}>
              <span className='ml-2 text-sm text-blue-600 hover:text-blue-900 decoration-solid drop-shadow-lg'>
                {truncatedString(INTSingleInterview?.interviewLink)}
              </span>
            </Link>
          </div>
        </div>
        {!checkCompleteMarkScore(assignedQuestions) && (
          <div className='px-6 py-6 border-2 shadow-xl mt-14 rounded-xl'>
            <div className='text-2xl font-semibold'>Assign Questions For Interview</div>
            <form className='relative flex justify-center mt-2'>
              <div className='flex items-center px-4 py-2 my-2 border rounded-l-xl border-e-0'>
                <BsFilterLeft className='h-[25px] w-[25px]' />
                <select
                  className='px-2 py-1 ml-2'
                  id='dropdown1'
                  onChange={handleClickSkill}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={handleDropdownBlur}
                >
                  <option value=''>Type: None</option>
                  {skills.map((skill: any) => (
                    <option key={skill.skillId} value={skill.name}>
                      {skill.name}
                    </option>
                  ))}
                </select>
                <select
                  className='px-2 py-1 ml-2'
                  id='dropdown2'
                  onChange={handleClickType}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={handleDropdownBlur}
                >
                  <option value=''>Skill: None</option>
                  {types.map((type: any, index: any) => (
                    <option key={index} value={type}>
                      {TYPE_alter[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div className='flex items-center px-4 py-2 my-2 border rounded-r-xl'>
                <label htmlFor='simple-search'>
                  <MagnifyingGlassIcon className='w-5 h-5' />
                </label>
                <input
                  type='text'
                  id='simple-search'
                  className='ml-2 w-[30vw]'
                  value={text}
                  placeholder='Search Name'
                  onChange={handleChange}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={handleDropdownBlur}
                  required
                />
              </div>
              {showDropdown && (
                <ul
                  className='absolute bg-white border border-gray-300 top-[65px] ml-6
                                                rounded-lg custom-scroll min-w-[700px] min-h-[50px]
                                                max-h-[200px] overflow-y-auto'
                >
                  {searchQuestionsStatus === STATUS.LOADING && (
                    <div className='flex justify-center'>
                      <LoadSpinner className='w-8 h-8 mt-2' />
                    </div>
                  )}

                  {searchQuestionsStatus === STATUS.IDLE &&
                    searchQuestions?.map((question: any) => (
                      <li
                        key={question.questionId}
                        className='p-2 cursor-pointer hover:bg-gray-100'
                        onClick={() => {
                          setShowDropdown(false)
                          handleAdd(question)
                        }}
                      >
                        {question.content}
                      </li>
                    ))}
                  {searchQuestionsStatus === STATUS.IDLE && searchQuestions.length === 0 && (
                    <li className='px-5 py-3'>No results found</li>
                  )}
                </ul>
              )}
            </form>
            <div className='mx-auto mt-8 mb-8'>
              <div>
                <table className='w-full border border-collapse border-gray-300 rounded table-auto'>
                  <thead>
                    <tr className='bg-gray-200'>
                      <th className='w-7/12 px-4 py-2'>Question</th>
                      <th className='w-2/12 px-4 py-2'>Type</th>
                      <th className='w-2/12 px-4 py-2'>Skill</th>
                      <th className='w-1/12 px-4 py-2'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedQuestionsStatus === STATUS.LOADING && (
                      <tr className='h-[80px]'>
                        <td colSpan={4}>
                          <div className='flex justify-center'>
                            <LoadSpinner className='w-8 h-8 mt-2' />
                          </div>
                        </td>
                      </tr>
                    )}
                    {assignedQuestionsStatus === STATUS.IDLE &&
                      assignedQuestions?.map((item: any) => (
                        <tr key={item.questionId} className='bg-white'>
                          <td className='px-4 py-2 border'>{item.content}</td>
                          <td className='px-4 py-2 text-center border'>{item.typeQuestion}</td>
                          <td className='px-4 py-2 text-center border'>{item.skill}</td>
                          <td className='px-4 py-2 text-center border'>
                            <div className='flex justify-center'>
                              <TrashIcon
                                onClick={() => {
                                  handleDelete(item)
                                }}
                                className='w-5 h-5 ml-3 mr-2 text-gray-500 cursor-pointer'
                              />
                              <CheckIcon className='w-5 h-5 text-gray-500' />
                            </div>
                          </td>
                        </tr>
                      ))}

                    {assignedQuestionsStatus === STATUS.IDLE &&
                      selectedQuestions[ID]?.map((item: any) => (
                        <tr key={item.questionId} className='bg-white'>
                          <td className='px-4 py-2 border'>{item.content}</td>
                          <td className='px-4 py-2 text-center border'>{item.typeQuestion}</td>
                          <td className='px-4 py-2 text-center border'>{item.skill.name}</td>
                          <td className='px-4 py-2 text-center border'>
                            <TrashIcon
                              onClick={() => {
                                handleRemove(item)
                              }}
                              className='w-5 h-5 ml-3 text-gray-500 cursor-pointer'
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className='flex justify-end mt-4'>
                <button
                  className='px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-800'
                  onClick={handleSave}
                >
                  Save Questions
                </button>
              </div>
            </div>
          </div>
        )}
        {checkCompleteMarkScore(assignedQuestions) && assignedQuestionsStatus === STATUS.LOADING && (
          <div className='flex justify-center'>
            <LoadSpinner className='w-8 h-8 mt-8' />
          </div>
        )}
        {checkCompleteMarkScore(assignedQuestions) && assignedQuestionsStatus === STATUS.IDLE && (
          <div className='px-6 py-6 border-2 shadow-xl mt-14 rounded-xl'>
            <div className='text-2xl font-semibold'>Result of Interview</div>
            <table className='w-full mt-4 border border-collapse border-gray-300 rounded'>
              <thead>
                <tr className='bg-gray-200'>
                  <th className='w-6/12 px-4 py-2'>Question</th>
                  <th className='w-5/12 px-4 py-2'>Note</th>
                  <th className='w-1/12 px-4 py-2'>Score</th>
                </tr>
              </thead>
              <tbody>
                {assignedQuestions?.map((item: any) => (
                  <tr key={item.questionId} className='bg-white'>
                    <td className='px-4 py-2 border'>{item.content}</td>
                    <td className='px-4 py-2 border'>{item.note}</td>
                    <td className='px-4 py-2 text-center border'>{item.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex justify-end mt-4 text-base'>
              <div className='mr-8'>
                Number of questions:
                <span className='text-xl font-medium'> {assignedQuestions.length}</span>
              </div>
              <div className='mr-8'>
                Total score:
                <span className='text-xl font-medium'>
                  {' '}
                  {calculateTotalScore(assignedQuestions)}/{10 * assignedQuestions.length}
                </span>
              </div>
              <div>
                Score out of 100:
                <span className='text-xl font-medium'>
                  {' '}
                  {Math.round((calculateTotalScore(assignedQuestions) * 1.0 * 100) / (10 * assignedQuestions.length))}
                </span>
              </div>
            </div>
          </div>
        )}

        {view ? (
          <div className='mt-14'>
            <INTCandidateDetail />
          </div>
        ) : (
          <div className='flex justify-between mt-8'>
            <button
              className='px-4 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-800'
              onClick={showCandidate}
            >
              Show More Candidate Information
            </button>
            {!checkCompleteMarkScore(assignedQuestions) && isDateReached(INTSingleInterview?.time) && (
              <Link to={`/interviewer/interview-recent/${id}/score-page`}>
                <button className='px-4 py-2 font-bold text-white bg-orange-600 rounded hover:bg-orange-800'>
                  Start Interview
                </button>
              </Link>
            )}
            {!checkCompleteMarkScore(assignedQuestions) && !isDateReached(INTSingleInterview?.time) && (
              <button className='px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-800'>
                Not Arrived Yet
              </button>
            )}
          </div>
        )}
        {view && !checkCompleteMarkScore(assignedQuestions) && isDateReached(INTSingleInterview?.time) && (
          <div className='flex justify-end mt-8'>
            <Link to={`/interviewer/interview-recent/${id}/score-page`}>
              <button className='px-4 py-2 font-bold text-white bg-orange-600 rounded hover:bg-orange-800'>
                Start Interview
              </button>
            </Link>
          </div>
        )}
        {view && !checkCompleteMarkScore(assignedQuestions) && !isDateReached(INTSingleInterview?.time) && (
          <div className='flex justify-end mt-8'>
            <button className='px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-800'>
              Not Arrived Yet
            </button>
          </div>
        )}
      </div>
    )
  } else if (INTSingleInterviewStatus === STATUS.ERROR500 || assignedQuestionsStatus === STATUS.ERROR500) {
    // return <Error errorCode={STATUS.ERROR500} />
  } else if (INTSingleInterviewStatus === STATUS.ERROR404) {
    // return <Error errorCode={STATUS.ERROR404} />
  }
}

export default InterviewDetail
