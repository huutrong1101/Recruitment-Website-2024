import { PencilIcon } from '@heroicons/react/24/solid'
import { TrashIcon, UserMinusIcon } from '@heroicons/react/24/outline'
import { Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip } from '@material-tailwind/react'
import { data } from '../../data/fetchData'
import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { formatDay } from '../../utils/utils'
import Modal from '../Modal/Modal'
import { useAppSelector } from '../../hooks/hooks'
import { AcountConfig } from '../../types/user.type'
import useQueryParams from '../../hooks/useQueryParams'
import { isEqual, isUndefined, omitBy } from 'lodash'
import axiosInstance from '../../utils/AxiosInstance'
import qs from 'query-string'
import { useDispatch } from 'react-redux'
import { fetchAdminManagerAcountList } from '../../redux/reducer/AdminListAcountRecentSlice'
import LoadSpinner from '../LoadSpinner/LoadSpinner'

const TABLE_HEAD = ['Name', 'Role', 'Phone', 'Email', 'Date created', 'Actions']

const TABLE_HEAD_DELETED = ['Name', 'Role', 'Phone', 'Email', 'Date created', 'Date deleted']

interface TypeData {
  typeSelected: string
}

interface AcountInterface {
  accountFullName: string
  accountRole: string
  accountPhone: string
  accountEmail: string
  createdDate: Date
}

export type QueryConfig = {
  [key in keyof AcountConfig]: string
}

export function AdminTable({ typeSelected }: TypeData) {
  console.log(typeSelected)
  // let [isOpen, setIsOpen] = useState(false)

  const accounts: AcountInterface[] = useAppSelector((state) => state.AdminacountList.adminmanagerAcountList)
  const totalListAccount = useAppSelector((state) => state.AdminacountList.totalListAcounts)

  const dispatch = useDispatch()

  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      size: queryParams.limit || 5,
      page: queryParams.page || 1,
      role: queryParams.role || (typeSelected === 'Blacklist' ? 'CANDIDATE' : typeSelected === '' ? '' : typeSelected),
      name: queryParams.name || '',
      blacklist: queryParams.blacklist || typeSelected == 'Blacklist' ? 'true' : '',
      phone: queryParams.phone || '',
      email: queryParams.email || ''
    },
    isUndefined
  )

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
  const [selectedUserId, setSelectedUserId] = useState<AcountInterface>()

  useEffect(() => {
    if (!isEqual(prevQueryConfig, queryConfig)) {
      const fetchJobs = async () => {
        setIsLoading(true)
        try {
          const query = qs.stringify(queryConfig)
          const response = await axiosInstance(`/admin/users/${typeSelected}`)
          setUser(response.data.result.content)
          setPageSize(response.data.result.totalPages)
          // console.log(response.data.result.content)
        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchJobs()
      setPrevQueryConfig(queryConfig)
    }
  }, [typeSelected, queryConfig, prevQueryConfig])

  useEffect(() => {
    const fetchPosition = async () => {
      setIsLoading(true)
      try {
        if (queryConfig) {
          const query = qs.stringify(queryConfig)
          const response = await axiosInstance(`/admin/users/${typeSelected}`)
          setUser(response.data.result.content)
          setPageSize(response.data.result.totalPages)
          console.log(response.data.result.content)
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

  function openModal(user: AcountInterface, type: string) {
    if (type === 'delete') {
      setModal({
        ...modal,
        isOpen: true,
        type: type,
        title: 'Delete User',
        titleClass: 'text-xl font-bold leading-7 text-center text-red-600',
        cancelTitle: 'Cancel',
        successClass: 'text-red-900 bg-red-100 hover:bg-red-200 focus-visible:ring-red-500',
        successTitle: 'OK',
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
    }
    setSelectedUserId(user)
  }

  const handleDelete = () => {
    console.log('delete')
  }

  return (
    <Card className='w-full h-full'>
      <CardBody className='px-0 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left table-auto min-w-max'>
            <thead>
              <tr>
                {typeSelected === 'DELETED' ? (
                  <>
                    {TABLE_HEAD_DELETED.map((head) => (
                      <th key={head} className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                        <Typography variant='small' color='blue-gray' className='font-normal leading-none opacity-70'>
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </>
                ) : (
                  <>
                    {TABLE_HEAD.map((head) => (
                      <th key={head} className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                        <Typography variant='small' color='blue-gray' className='font-normal leading-none opacity-70'>
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <div className='flex items-center justify-center  w-full h-[50px] text-[13px] mt-10 mb-10'>
                  <LoadSpinner className='text-2xl text-[#059669] ' />
                </div>
              ) : (
                <>
                  {user.map((item, index) => {
                    const isLast = index === user.length - 1
                    const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'
                    return (
                      <tr key={index}>
                        <td className={classes}>
                          <div className='flex items-center gap-3'>
                            <Typography variant='small' color='blue-gray' className='font-bold'>
                              {item.accountFullName}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            {item.accountRole}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            {item.accountPhone}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            {item.accountEmail}
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
                              {item.accountRole !== 'ADMIN' && typeSelected !== 'BLACKLIST' ? (
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
                              {item.accountRole !== 'ADMIN' && typeSelected == 'BLACKLIST' ? (
                                <>
                                  <button>
                                    <NavLink to={`/admin/blacklist/${item.accountFullName}`} onClick={() => {}}>
                                      <Tooltip content='Edit User'>
                                        <PencilIcon className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg' />
                                      </Tooltip>
                                    </NavLink>
                                  </button>
                                </>
                              ) : null}
                              {/* Delete  */}
                              {item.accountRole !== 'ADMIN' && typeSelected !== 'BLACKLIST' && (
                                <>
                                  <button>
                                    <Tooltip content='Delete User'>
                                      <TrashIcon
                                        onClick={() => openModal(item, 'delete')}
                                        className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg'
                                      />
                                    </Tooltip>
                                  </button>
                                </>
                              )}
                              {/*  */}
                              {item.accountRole === 'CANDIDATE' && typeSelected !== 'BLACKLIST' ? (
                                <>
                                  {/* {user.blacklist !== true ? (
                                <button>
                                  <NavLink to={`/admin/users/blacklist/${user.userId}`} onClick={() => {}}>
                                    <Tooltip content='Add Blacklist'>
                                      <UserMinusIcon className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg' />
                                    </Tooltip>
                                  </NavLink>
                                </button>
                              ) : null} */}
                                </>
                              ) : null}
                            </div>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
      <CardFooter className='flex items-center justify-between p-4 border-t border-blue-gray-50'>
        <Button variant='outlined' size='sm'>
          Previous
        </Button>
        <div className='flex items-center gap-2'>
          <IconButton variant='outlined' size='sm'>
            1
          </IconButton>
          <IconButton variant='text' size='sm'>
            2
          </IconButton>
          <IconButton variant='text' size='sm'>
            3
          </IconButton>
          <IconButton variant='text' size='sm'>
            ...
          </IconButton>
          <IconButton variant='text' size='sm'>
            8
          </IconButton>
          <IconButton variant='text' size='sm'>
            9
          </IconButton>
          <IconButton variant='text' size='sm'>
            10
          </IconButton>
        </div>
        <Button variant='outlined' size='sm'>
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
        handleSucces={closeModal}
      >
        <div className='flex items-center justify-center gap-5 mt-2'>
          <div className='w-full'>
            <div className='flex flex-row justify-center mt-2'>
              {modal.type === 'delete' ? (
                <>
                  <h1>
                    Bạn có muốn xóa người dùng{' '}
                    <span className='font-bold text-red-500'>
                      {selectedUserId?.accountFullName} - {selectedUserId?.accountEmail}
                    </span>{' '}
                    ra khỏi hệ thống?
                  </h1>
                </>
              ) : modal.type === 'edit' ? (
                <div>
                  <h2 className='mb-4 text-2xl font-bold'>{selectedUserId?.fullName}</h2>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Email:</span>
                    {/* <span>{selectedUserId?.email}</span> */}
                    <span>User Email</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Phone:</span>
                    {/* <span>{selectedUserId?.phone}</span> */}
                    <span>User Phone</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Date of Birth:</span>
                    {/* <span>{selectedUserId?.dateOfBirth || 'N/A'}</span> */}
                    <span>User Date</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Gender:</span>
                    {/* <span>{selectedUserId?.gender}</span> */}
                    <span>User Gender</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Address:</span>
                    {/* <span>{selectedUserId?.address}</span> */}
                    <span>User Address</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>About:</span>
                    {/* <span>{selectedUserId?.about}</span> */}
                    <span>User About</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Skills:</span>
                    {/* <ul>{selectedUserId?.skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul> */}
                    <span>Skill</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Role:</span>
                    {/* <span>{selectedUserId?.role}</span> */}
                    <span>User Role</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Created At:</span>
                    {/* <span>{formatDay(user?.createdAt)}</span> */}
                    <span>Date Created</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Updated At:</span>
                    {/* <span>{formatDay(user?.updatedAt)}</span> */}
                    <span>Date Update</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Blacklist:</span>
                    {/* <span>{user?.blacklist ? 'Yes' : 'No'}</span> */}
                    <span>Yes</span>
                  </div>
                  <div className='flex'>
                    <span className='mr-2 font-semibold'>Active:</span>
                    {/* <span>{user?.active ? 'Yes' : 'No'}</span> */}
                    <span>Yes</span>
                  </div>
                </div>
              ) : (
                <>
                  <h1>Hello world</h1>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </Card>
  )
}
