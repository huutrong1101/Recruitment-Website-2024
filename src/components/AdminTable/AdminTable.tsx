import { PencilIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import { TrashIcon, UserMinusIcon } from '@heroicons/react/24/outline'
import { Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip } from '@material-tailwind/react'
import { data } from '../../data/fetchData'
import { Link, NavLink, createSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { formatDay } from '../../utils/utils'
import Modal from '../Modal/Modal'
import { useAppSelector } from '../../hooks/hooks'
import { AcountConfig } from '../../types/user.type'
import useQueryParams from '../../hooks/useQueryParams'
import { isEmpty, isEqual, isUndefined, omit, omitBy } from 'lodash'
import axiosInstance from '../../utils/AxiosInstance'
import qs from 'query-string'
import LoadSpinner from '../LoadSpinner/LoadSpinner'
import { QueryConfig } from '../../pages/Admin/AdminManagerAccount'
import { toast } from 'react-toastify'
import { AuthService } from '../../services/AuthService'
import { Dispatch, SetStateAction } from 'react'

const TABLE_HEAD = ['Name', 'Role', 'Phone', 'Email', 'Date created', 'Actions']

const TABLE_HEAD_DELETED = ['Name', 'Role', 'Phone', 'Email', 'Date created', 'Date deleted']

interface TypeData {
  typeSelected: string
  queryConfig: QueryConfig
  setTypeSelected: Dispatch<SetStateAction<string>>
}

interface Education {
  school: string
  major: string
}

interface Experience {
  companyName: string
  position: string
  dateFrom: string // ISO 8601 date string
  dateTo: string // ISO 8601 date string
}

interface Certificate {
  name: string
  receivedDate: string // ISO 8601 date string
  url: string
}

interface Project {
  name: string
  description: string
  url: string
}

interface Skill {
  value: number
  label: string
}

interface Information {
  education: Education[]
  experience: Experience[]
  certificate: Certificate[]
  project: Project[]
  skills: Skill[]
}

export interface User {
  accountId: string
  fullName: string
  role: string
  createdDate: string // ISO 8601 date string
  blackList: boolean
  avatar: string
  about: string
  email: string
  dateOfBirth: string // ISO 8601 date string
  address: string
  phone: string
  skills: Skill[]
  information: Information
}

export function AdminTable({ typeSelected, queryConfig, setTypeSelected }: TypeData) {
  // let [isOpen, setIsOpen] = useState(false)

  const accounts: User[] = useAppSelector((state) => state.AdminacountList.adminmanagerAcountList)
  const totalListAccount = useAppSelector((state) => state.AdminacountList.totalListAcounts)
  const [currentPage, setCurrentPage] = useState(1)

  const queryParams: QueryConfig = useQueryParams()

  const navigate = useNavigate()

  const [modal, setModal] = useState({
    type: '',
    isOpen: false,
    title: '',
    titleClass: '',
    cancelTitle: '',
    successClass: '',
    successTitle: '',
    size: ''
  })

  const [prevQueryConfig, setPrevQueryConfig] = useState<QueryConfig>(queryConfig)
  const [pageSize, setPageSize] = useState(Math.ceil(totalListAccount / Number(queryParams.limit || 5)))
  const [user, setUser] = useState(accounts)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<User>()

  useEffect(() => {
    if (!isEqual(prevQueryConfig, queryConfig)) {
      const fetchJobs = async () => {
        setIsLoading(true)
        try {
          const query = qs.stringify(queryConfig)
          const response = await axiosInstance(`/admin/users/${typeSelected}?${query}`)
          setUser(response.data.result.content)
          setPageSize(response.data.result.totalPages)
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchJobs()
      setPrevQueryConfig(queryConfig)
    }
  }, [queryConfig, prevQueryConfig])

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)
      try {
        const query = qs.stringify(queryConfig)
        const response = await axiosInstance(`/admin/users/${typeSelected}?${query}`)
        setUser(response.data.result.content)
        setPageSize(response.data.result.totalPages)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchJobs()
    setPrevQueryConfig(queryConfig)
  }, [typeSelected])

  useEffect(() => {
    const fetchPosition = async () => {
      setIsLoading(true)
      try {
        if (queryConfig) {
          const query = qs.stringify(queryConfig)
          const response = await axiosInstance(`/admin/users/${typeSelected}?${query}`)
          setUser(response.data.result.content)
          setPageSize(response.data.result.totalPages)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosition()
  }, [])

  function closeModal() {
    setModal({ ...modal, isOpen: false })
  }

  // console.log(user)

  function openModal(user: User, type: string) {
    if (type === 'delete') {
      setModal({
        ...modal,
        isOpen: true,
        type: type,
        title: 'ADD BLACKLIST',
        titleClass: 'text-xl font-bold leading-7 text-center text-red-600',
        cancelTitle: 'Cancel',
        successClass: 'text-red-900 bg-red-100 hover:bg-red-200 focus-visible:ring-red-500',
        successTitle: 'YES',
        size: 'max-w-2xl'
      })
    } else if (type === 'edit') {
      setModal({
        ...modal,
        isOpen: true,
        type: type,
        title: 'User Information',
        titleClass: 'text-xl font-bold leading-7 text-center text-yellow-600',
        cancelTitle: 'Cancel',
        successClass: 'text-yellow-900 bg-yellow-100 hover:bg-yellow-200 focus-visible:ring-yellow-500',
        successTitle: 'OK',
        size: 'max-w-xl'
      })
    } else if (type === 'remove_delete') {
      setModal({
        ...modal,
        isOpen: true,
        type: type,
        title: 'REMOVE BLACKLIST',
        titleClass: 'text-xl font-bold leading-7 text-center text-green-600',
        cancelTitle: 'Cancel',
        successClass: 'text-green-900 bg-green-100 hover:bg-green-200 focus-visible:ring-green-500',
        successTitle: 'YES',
        size: 'max-w-2xl'
      })
    }

    setSelectedUserId(user)
  }

  const handleAddBlacklist = (accountId: string) => {
    toast
      .promise(AuthService.addBlacklist(accountId), {
        pending: `Adding to blacklist`,
        success: `This account is added to blacklist`
      })
      .then(() => {
        closeModal()
        setTypeSelected('blacklist')
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const handleRemoveBlacklist = (accountId: string) => {
    toast
      .promise(AuthService.removeBlacklist(accountId), {
        pending: `Removing from blacklist`,
        success: `This account is removed from blacklist`
      })
      .then(() => {
        closeModal()
        setTypeSelected('')
      })
      .catch((error) => toast.error(error.response.data.message))
  }

  const handleReset = () => {
    setCurrentPage(1)
    navigate({
      pathname: '/admin/account',
      search: createSearchParams(
        omit(queryParams, ['name', 'phone', 'email', 'role', 'blacklist', 'page', 'limit'])
      ).toString()
    })
  }

  const handlePagination = (page: number) => {
    setCurrentPage(page)
    const searchParams = {
      ...queryConfig,
      page: page.toString(),
      limit: '5'
    }

    const filteredSearchParams = omitBy(searchParams, isEmpty)

    navigate({
      pathname: '/admin/account',
      search: createSearchParams(filteredSearchParams).toString()
    })
  }

  const handleNext = () => {
    const newPage = currentPage + 1
    setCurrentPage(newPage)
    const searchParams = {
      ...queryConfig,
      page: newPage.toString(),
      limit: '5'
    }

    const filteredSearchParams = omitBy(searchParams, isEmpty)

    navigate({
      pathname: '/admin/account',
      search: createSearchParams(filteredSearchParams).toString()
    })
  }

  const handlePrev = () => {
    const newPage = currentPage - 1
    setCurrentPage(newPage)
    const searchParams = {
      ...queryConfig,
      page: newPage.toString(),
      limit: '5'
    }

    const filteredSearchParams = omitBy(searchParams, isEmpty)

    navigate({
      pathname: '/admin/account',
      search: createSearchParams(filteredSearchParams).toString()
    })
  }

  useEffect(() => {
    handleReset()
  }, [typeSelected])

  console.log(typeSelected)
  return (
    <Card className='w-full h-full'>
      <CardBody className='px-0 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left table-auto min-w-max'>
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                    <Typography variant='small' color='blue-gray' className='font-normal leading-none opacity-70'>
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr className='mt-2'>
                  <td colSpan={TABLE_HEAD.length} className='py-4 text-center'>
                    <div className='flex items-center justify-center  w-full h-[50px] text-[13px] mt-10 mb-10'>
                      <LoadSpinner className='text-2xl text-[#059669] ' />
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {user && user.length > 0 ? (
                    user.map((item, index) => {
                      const isLast = index === user.length - 1
                      const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'
                      return (
                        <tr key={index} className={`${item.blackList === true ? 'text-red-500' : ''}`}>
                          <td className={classes}>
                            <div className='flex items-center gap-3'>
                              <Typography variant='small' color='blue-gray' className='font-bold'>
                                {item.fullName}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography variant='small' color='blue-gray' className='font-normal'>
                              {item.role}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant='small' color='blue-gray' className='font-normal'>
                              {item.phone}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant='small' color='blue-gray' className='font-normal'>
                              {item.email}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <div className='flex items-center gap-3'>
                              <div className='flex flex-col'>
                                <Typography variant='small' color='blue-gray' className='font-normal opacity-70'>
                                  {formatDay(item.createdDate)}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          {typeSelected === 'DELETED' && (
                            <td className={classes}>
                              <div className='flex items-center gap-3'>
                                <div className='flex flex-col'>
                                  <Typography variant='small' color='blue-gray' className='font-normal opacity-70'>
                                    {formatDay(item.createdDate)}
                                  </Typography>
                                </div>
                              </div>
                            </td>
                          )}

                          {typeSelected !== 'DELETED' && (
                            <td className={classes}>
                              <div className='flex items-start justify-start gap-2'>
                                {/* Change Role Acount */}
                                {item.role !== 'ADMIN' && typeSelected !== 'BLACKLIST' ? (
                                  <>
                                    <button>
                                      <Tooltip content='Edit User'>
                                        <PencilIcon
                                          onClick={() => openModal(item, 'edit')}
                                          className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg'
                                        />
                                      </Tooltip>
                                    </button>
                                  </>
                                ) : null}
                                {/*  Acount BlackList */}
                                {item.role !== 'ADMIN' && typeSelected === 'BLACKLIST' ? (
                                  <>
                                    <button>
                                      <NavLink to={`/admin/blacklist/${item.accountId}`} onClick={() => {}}>
                                        <Tooltip content='Edit User'>
                                          <PencilIcon className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg' />
                                        </Tooltip>
                                      </NavLink>
                                    </button>
                                  </>
                                ) : null}
                                {/* Delete  */}
                                {item.role === 'CANDIDATE' &&
                                  typeSelected !== 'BLACKLIST' &&
                                  (item.blackList === true ? (
                                    <>
                                      <button>
                                        <Tooltip content='Remove Blacklist'>
                                          <LockOpenIcon
                                            onClick={() => openModal(item, 'remove_delete')}
                                            className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg'
                                          />
                                        </Tooltip>
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button>
                                        <Tooltip content='Add Blacklist'>
                                          <LockClosedIcon
                                            onClick={() => openModal(item, 'delete')}
                                            className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg'
                                          />
                                        </Tooltip>
                                      </button>
                                    </>
                                  ))}
                              </div>
                            </td>
                          )}
                        </tr>
                      )
                    })
                  ) : (
                    <tr className='mt-2'>
                      <td colSpan={TABLE_HEAD.length} className='py-4 text-center'>
                        Not found result
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
      <CardFooter className='flex items-center justify-between p-4 border-t border-blue-gray-50'>
        <Button variant='outlined' size='sm' onClick={handlePrev}>
          Previous
        </Button>
        <div className='flex items-center gap-2'>
          {Array(pageSize)
            .fill(0)
            .map((_, index) => {
              const pageNumber = index + 1

              return (
                <IconButton
                  variant='outlined'
                  size='sm'
                  className={pageNumber === currentPage ? 'border-cyan-500' : 'border-transparent'}
                  onClick={() => handlePagination(pageNumber)}
                >
                  {pageNumber}
                </IconButton>
              )
            })}
        </div>
        <Button variant='outlined' size='sm' onClick={handleNext}>
          Next
        </Button>
      </CardFooter>

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        titleClass={modal.titleClass}
        cancelTitle={modal.cancelTitle}
        successClass={modal.successClass}
        successTitle={modal.successTitle}
        size={modal.size}
        handleSucces={() => {
          if (modal.type === 'delete' && selectedUserId?.accountId) {
            handleAddBlacklist(selectedUserId.accountId)
          } else if (modal.type === 'remove_delete' && selectedUserId?.accountId) {
            handleRemoveBlacklist(selectedUserId.accountId)
          } else {
            closeModal()
          }
        }}
      >
        <div className='flex items-center justify-center gap-5 mt-2'>
          <div className='w-full'>
            <div className='flex flex-row justify-center mt-2'>
              {modal.type === 'delete' ? (
                <>
                  <h1>
                    Do you want to add{' '}
                    <span className='font-bold text-red-500'>
                      {selectedUserId?.fullName} - {selectedUserId?.email}
                    </span>{' '}
                    to the blacklist?
                  </h1>
                </>
              ) : modal.type === 'edit' ? (
                <div>
                  <h2 className='mb-4 text-2xl font-bold'>{selectedUserId?.fullName}</h2>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Email:</span>
                    <span>{selectedUserId?.email}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Phone:</span>
                    <span>{selectedUserId?.phone}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Date of Birth:</span>
                    <span>{formatDay(selectedUserId?.dateOfBirth) || 'N/A'}</span>
                  </div>

                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Address:</span>
                    <span>{selectedUserId?.address}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>About:</span>
                    <span>{selectedUserId?.about}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Skills:</span>
                    <ul className='flex items-center gap-2'>
                      {selectedUserId?.skills.map((skill, index) => <li key={index}>{skill.label}</li>)}
                    </ul>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Role:</span>
                    <span>{selectedUserId?.role}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Created At:</span>
                    <span>{formatDay(selectedUserId?.createdDate)}</span>
                  </div>

                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Blacklist:</span>
                    <span>{selectedUserId?.blackList ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              ) : (
                <>
                  <h1>
                    Do you want to remove{' '}
                    <span className='font-bold text-green-700'>
                      {selectedUserId?.fullName} - {selectedUserId?.email}
                    </span>{' '}
                    from the blacklist?
                  </h1>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </Card>
  )
}
