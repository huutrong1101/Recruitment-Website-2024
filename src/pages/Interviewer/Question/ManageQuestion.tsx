import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, PencilIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { isEqual, isUndefined, omit, omitBy } from 'lodash'
import qs from 'query-string'
import { Fragment, useEffect, useState } from 'react'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppSelector } from '../../../hooks/hooks'
import useQueryParams from '../../../hooks/useQueryParams'
import { QuestionListConfig, QuestionListInterface } from '../../../types/question.type'
import axiosInstance from '../../../utils/AxiosInstance'
import { InterviewService } from '../../../services/InterviewService'
import { TYPE_alter } from '../../../utils/Localization'
import LoadSpinner from '../../../components/LoadSpinner/LoadSpinner'
import { data } from '../../../data/fetchData'
import UpdateQuestion from './UpdateQuestion'
import AddQuestion from './AddQuestion'

export type QueryConfig = {
  [key in keyof QuestionListConfig]: string
}

export default function QuestionInterview() {
  const [dataSearch, setDataSearch] = useState({
    skill: '',
    type: ''
  })

  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      size: queryParams.size || 5,
      skill: queryParams.skill,
      type: queryParams.type,
      note: queryParams.note,
      content: queryParams.content
    },
    isUndefined
  )

  const navigate = useNavigate()

  const [addQuestion, setAddQuestion] = useState(false)
  const handleOnClick = () => setAddQuestion(false)

  const [updateQuestion, setUpdateQuestion] = useState(false)
  const handleUpdateClick = () => setUpdateQuestion(false)

  const [isActive, setIsActive] = useState(false)
  const handleActive = (e: any) => setIsActive(!isActive)

  const [clicked, setClicked] = useState(false)

  const [prevQueryConfig, setPrevQueryConfig] = useState<QueryConfig>(queryConfig)
  const { totalQuestions }: any = useAppSelector((state) => state.QuestionList.totalQuestions)
  const questions: QuestionListInterface[] = useAppSelector((state) => state.QuestionList.questionList)
  const skills: QuestionListInterface[] = useAppSelector((state) => state.QuestionList.skills)
  const types: QuestionListInterface[] = useAppSelector((state) => state.QuestionList.types)
  const [pageSize, setPageSize] = useState(Math.ceil(totalQuestions / Number(queryParams.size || 5)))
  const [isLoading, setIsLoading] = useState(false)

  const [showQuestion, setShowQuestion] = useState(questions)
  const [showSkills, setShowSkills] = useState(skills)
  const [showTypes, setShowTypes] = useState(types)
  const [questionID, setQuestionID] = useState([])

  useEffect(() => {
    const fetchQuesList = async () => {
      setIsLoading(true)
      try {
        if (queryConfig) {
          const query = qs.stringify(queryConfig)

          const response = await axiosInstance(`interviewers/question?${query}`)
          setShowQuestion(response.data.result.content)
          setPageSize(response.data.result.totalPages)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchQuesList()
  }, [])

  useEffect(() => {
    const fetchSkillType = async () => {
      setIsLoading(true)
      const resSkill = await axiosInstance(`interviewers/skills`)
      const resType = await axiosInstance(`interviewers/type`)
      setShowTypes(resType.data.result)
      setShowSkills(resSkill.data.result)
    }
    fetchSkillType()
  }, [])

  useEffect(() => {
    if (!isEqual(prevQueryConfig, queryConfig)) {
      const fetchQuestionPagination = async () => {
        setIsLoading(true)
        try {
          const query = qs.stringify(queryConfig)
          const response = await axiosInstance(`interviewers/question?${query}`)
          setShowQuestion(response.data.result.content)
          setPageSize(response.data.result.totalPages)
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchQuestionPagination()
      setPrevQueryConfig(queryConfig)
    }
  }, [queryConfig, prevQueryConfig])

  function ListAllQuesstion() {
    setDataSearch({
      skill: '',
      type: ''
    })

    navigate({
      pathname: '',
      search: createSearchParams(omit(queryConfig, ['page', 'size', 'skill', 'type'])).toString()
    })
  }

  function DeleteQuestion(id: any) {
    toast.promise(InterviewService.deleteQuestion(id), {
      pending: 'Deleting this question !!',
      success: 'The question was deleted',
      error: 'Có lỗi xãy ra trong quá trình xóa'
    })
  }

  return (
    <div className='my-4 '>
      <div className='bg-white border border-gray-200 rounded-md drop-shadow-md min-h-[calc(100vh-72px-2rem)] '>
        <div className='flex flex-col'>
          <div className='flex justify-center my-4'>
            <div className='inline-flex justify-between w-11/12'>
              <div className='flex items-center '>
                <div className='text-2xl font-semibold w-fit h-fit'>Interview Questions</div>
              </div>
              <div className='w-fit h-fit '>
                <button
                  className='Text text-white px-4 py-2.5 bg-emerald-600 rounded-lg drop-shadow-xl
                                  text-[14px] font-medium leading-tight hover:text-emerald-600 hover:bg-white
                                  border-transparent border hover:border-emerald-600 hover:transition-all duration-200'
                  onClick={() => setAddQuestion(true)}
                >
                  <PlusCircleIcon className='inline-flex w-5' /> Add Question
                </button>
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-center w-full'>
            <div className='w-full h-fit '>
              <div className='flex w-full h-full gap-x-4'>
                <div className='flex w-full mb-4 ml-20 cursor-pointer gap-x-6'>
                  {/* Skill */}
                  <div className='relative flex flex-col w-40 h-fit'>
                    <Menu as='div' className=' h-fit'>
                      <div className='absolute w-full'>
                        <div className='w-full h-full '>
                          <Menu.Button
                            className='w-full p-1.5 mb-1 bg-emerald-600 rounded-md text-white border border-transparent
                                active:border-emerald-600  active:text-emerald-600 
                                 active:bg-white flex items-center'
                            onClick={handleActive}
                          >
                            <div className='inline-flex justify-between w-full '>
                              {dataSearch.skill || 'Skill'}
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
                            <Menu.Items className='flex flex-col items-start w-full h-full rounded-md shadow-md bg-gray-50 aboslute max-h-[20vh] overflow-hidden overflow-y-scroll'>
                              <div className='w-full h-full text-black border rounded-md border-zinc-200'>
                                {showSkills.map((skill: any, index) => (
                                  <Menu.Item key={index}>
                                    {({ active }) => (
                                      <Link
                                        to={{
                                          pathname: '/interviewer/question',
                                          search: createSearchParams({
                                            ...queryConfig,
                                            skill: skill,
                                            page: '1'
                                          }).toString()
                                        }}
                                        className={classNames(
                                          active ? 'bg-gray-100 text-gray-900 bg-opacity-80' : 'text-gray-700',
                                          'p-2',
                                          'block  text-sm'
                                        )}
                                        onClick={() => {
                                          setDataSearch({
                                            ...dataSearch,
                                            skill: skill
                                          })
                                        }}
                                      >
                                        {skill}
                                      </Link>
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

                  {/* Type */}
                  <div className='relative flex flex-col w-40 h-fit'>
                    <Menu as='div' className='w-full h-fit'>
                      <div className='absolute w-full '>
                        <Menu.Button
                          className='w-full h-fit p-1.5 mb-1 bg-emerald-600 rounded-md text-white border border-transparent
                                active:border-emerald-600  active:text-emerald-600 
                                 active:bg-white flex items-center'
                          onClick={handleActive}
                        >
                          <div className='inline-flex justify-between w-full '>
                            {dataSearch.type || 'Type'}
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
                          <Menu.Items className='flex flex-col items-start w-full h-full rounded-md shadow-md bg-gray-50 aboslute '>
                            <div className='w-full h-full text-black border rounded-md border-zinc-200'>
                              {showTypes.map((type: any, index: any) => (
                                <Menu.Item key={index}>
                                  {({ active }) => (
                                    <Link
                                      to={{
                                        pathname: '/interviewer/question',
                                        search: createSearchParams({
                                          ...queryConfig,
                                          type: type,
                                          page: '1'
                                        }).toString()
                                      }}
                                      className={classNames(
                                        active ? 'bg-gray-100 text-gray-900 bg-opacity-80' : 'text-gray-700',
                                        'p-2',
                                        'block  text-sm'
                                      )}
                                      onClick={() => {
                                        setDataSearch({
                                          ...dataSearch,
                                          type: type
                                        })
                                      }}
                                    >
                                      {type}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ))}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </div>
                    </Menu>
                  </div>
                </div>
                <div className='flex mr-12 justify-self-end'>{/* <SearchBar></SearchBar> */}</div>
              </div>
            </div>
          </div>
          <div>
            <div className='flex justify-center my-2 '>
              <div className='w-11/12 border-2 border-gray-200 rounded-lg '>
                <div className='overflow-auto px-2 min-h-[60vh] max-h-[60vh]'>
                  <table className='w-full '>
                    <thead className='w-fit'>
                      <tr className='flex justify-center px-4 mt-3'>
                        <th className='mx-3 text-lg font-semibold tracking-wide text-left basis-1/6 '>Skill</th>
                        <th className='mx-3 text-lg font-semibold tracking-wide text-left basis-1/6 '>Type</th>
                        <th className='mx-3 text-lg font-semibold tracking-wide text-left basis-2/6 '>Question</th>
                        <th className='mx-3 text-lg font-semibold tracking-wide text-left basis-2/6 '>Note</th>
                        <th className='flex justify-center text-lg font-semibold tracking-wide text-left basis-1/6 '>
                          Edit
                        </th>
                      </tr>
                    </thead>
                    <tbody className=''>
                      <div className='grid text-left'>
                        {isLoading ? (
                          <div className='flex justify-center mb-10'>
                            <LoadSpinner className='text-3xl' />
                          </div>
                        ) : (
                          <div className='px-4  min-w-[145vh] '>
                            {' '}
                            {/*max-w-[145vh] */}
                            {showQuestion.length > 0 ? (
                              showQuestion.map((question: any) => (
                                <tr
                                  className='flex flex-row items-center py-2 my-2 text-left border-2 border-white cursor-pointer text-md hover: hover:border-emerald-600 hover:rounded-lg hover:text-black hover:transition-all '
                                  key={question.questionId}
                                >
                                  <td className='mx-3 basis-1/6'>{question.skill}</td>
                                  <td className='mx-3 basis-1/6'>{question.typeQuestion}</td>
                                  <td className='flex-wrap mx-3 truncate basis-2/6 '>{question.content}</td>
                                  <td className='flex-wrap mx-3 truncate basis-2/6 '>{question.note}</td>
                                  <td className='inline-flex justify-center gap-x-2 basis-1/6'>
                                    <button
                                      className='p-2 hover:bg-zinc-300 hover:rounded-md '
                                      onClick={() => {
                                        setUpdateQuestion(true)
                                        setQuestionID(question.questionId)
                                      }}
                                    >
                                      <PencilIcon className='w-5 h-5' />
                                    </button>
                                    <button
                                      className='p-2 hover:bg-zinc-300 hover:rounded-md '
                                      onClick={() => {
                                        setClicked(true)
                                        DeleteQuestion(question.questionId)
                                      }}
                                    >
                                      {clicked}
                                      <TrashIcon className='w-5 h-5' />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <div className='flex justify-center w-full mb-10'>
                                <span>Không tìm thấy kết quả</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </tbody>
                  </table>
                </div>

                {/* pagination */}
                <div className='flex justify-between w-full m-4'>
                  <div
                    className='px-2 px-3 py-1 text-lg transition-colors rounded-lg cursor-pointer text-emerald-600 hover:bg-emerald-700 hover:text-emerald-300'
                    onClick={ListAllQuesstion}
                  >
                    Remove all filters
                  </div>
                  <div className='mr-10'>
                    {/* <PaginationInterview queryConfig={queryConfig} pageSize={pageSize} /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddQuestion onClick={handleOnClick} observation={addQuestion} />
      <UpdateQuestion onClick={handleUpdateClick} observation={updateQuestion} questionID={questionID} />
    </div>
  )
}
