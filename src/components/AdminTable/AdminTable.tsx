import { PencilIcon } from '@heroicons/react/24/solid'
import { TrashIcon, UserMinusIcon } from '@heroicons/react/24/outline'
import { Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip } from '@material-tailwind/react'
import { data } from '../../data/fetchData'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { formatDay } from '../../utils/utils'
import Modal from '../Modal/Modal'

const TABLE_HEAD = ['Name', 'Role', 'Phone', 'Email', 'Date created', 'Actions']

const TABLE_HEAD_DELETED = ['Name', 'Role', 'Phone', 'Email', 'Date created', 'Date deleted']

interface TypeData {
  typeSelected: string
}

interface UserType {
  userId: string
  phone: string
  email: string
  fullName: string
  avatar: string
  address: string
  dateOfBirth: string | null
  about: string
  gender: string
  createdAt: string
  updatedAt: string
  role: string
  skills: string[]
  blacklist: boolean
  active: boolean
}

export function AdminTable({ typeSelected }: TypeData) {
  // let [isOpen, setIsOpen] = useState(false)

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

  const [user, setUser] = useState<UserType>()

  function closeModal() {
    setModal({ ...modal, isOpen: false })
  }

  function openModal(user: UserType, type: string) {
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
    setUser(user)
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
              {data.showJobLists.map((user, index) => {
                const isLast = index === data.showJobLists.length - 1
                const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'
                return (
                  <tr key={user.userId}>
                    <td className={classes}>
                      <div className='flex items-center gap-3'>
                        <Typography variant='small' color='blue-gray' className='font-bold'>
                          {user.fullName}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant='small' color='blue-gray' className='font-normal'>
                        {user.role}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant='small' color='blue-gray' className='font-normal'>
                        {user.phone}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant='small' color='blue-gray' className='font-normal'>
                        {user.email}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className='flex items-center gap-3'>
                        <div className='flex flex-col'>
                          <Typography variant='small' color='blue-gray' className='font-normal opacity-70'>
                            {formatDay(user.createdAt)}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    {typeSelected === 'DELETED' && (
                      <td className={classes}>
                        <div className='flex items-center gap-3'>
                          <div className='flex flex-col'>
                            <Typography variant='small' color='blue-gray' className='font-normal opacity-70'>
                              {formatDay(user.updatedAt)}
                            </Typography>
                          </div>
                        </div>
                      </td>
                    )}

                    {typeSelected !== 'DELETED' && (
                      <td className={classes}>
                        <div className='flex items-start justify-start gap-2'>
                          {/* Change Role Acount */}
                          {user.role !== 'ADMIN' && typeSelected !== 'BLACKLIST' && user.active !== false ? (
                            <>
                              <button>
                                <Tooltip content='Edit User'>
                                  <PencilIcon
                                    onClick={() => openModal(user, 'edit')}
                                    className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg'
                                  />
                                </Tooltip>
                              </button>
                            </>
                          ) : null}
                          {/*  Acount BlackList */}
                          {user.role !== 'ADMIN' && typeSelected == 'BLACKLIST' && user.active !== false ? (
                            <>
                              <button>
                                <NavLink to={`/admin/blacklist/${user.userId}`} onClick={() => {}}>
                                  <Tooltip content='Edit User'>
                                    <PencilIcon className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg' />
                                  </Tooltip>
                                </NavLink>
                              </button>
                            </>
                          ) : null}
                          {/* Delete  */}
                          {user.role !== 'ADMIN' && typeSelected !== 'BLACKLIST' && user.active !== false && (
                            <>
                              <button>
                                <Tooltip content='Delete User'>
                                  <TrashIcon
                                    onClick={() => openModal(user, 'delete')}
                                    className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg'
                                  />
                                </Tooltip>
                              </button>
                            </>
                          )}
                          {/*  */}
                          {user.role === 'CANDIDATE' && typeSelected !== 'BLACKLIST' && user.active !== false ? (
                            <>
                              {user.blacklist !== true ? (
                                <button>
                                  <NavLink to={`/admin/users/blacklist/${user.userId}`} onClick={() => {}}>
                                    <Tooltip content='Add Blacklist'>
                                      <UserMinusIcon className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg' />
                                    </Tooltip>
                                  </NavLink>
                                </button>
                              ) : null}
                            </>
                          ) : null}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
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
                      {user?.fullName} - {user?.email}
                    </span>{' '}
                    ra khỏi hệ thống?
                  </h1>
                </>
              ) : modal.type === 'edit' ? (
                <div>
                  <h2 className='mb-4 text-2xl font-bold'>{user?.fullName}</h2>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Phone:</span>
                    <span>{user?.phone}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Date of Birth:</span>
                    <span>{user?.dateOfBirth || 'N/A'}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Gender:</span>
                    <span>{user?.gender}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Address:</span>
                    <span>{user?.address}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>About:</span>
                    <span>{user?.about}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Skills:</span>
                    <ul>{user?.skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Role:</span>
                    <span>{user?.role}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Created At:</span>
                    <span>{formatDay(user?.createdAt)}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Updated At:</span>
                    <span>{formatDay(user?.updatedAt)}</span>
                  </div>
                  <div className='flex mb-2'>
                    <span className='mr-2 font-semibold'>Blacklist:</span>
                    <span>{user?.blacklist ? 'Yes' : 'No'}</span>
                  </div>
                  <div className='flex'>
                    <span className='mr-2 font-semibold'>Active:</span>
                    <span>{user?.active ? 'Yes' : 'No'}</span>
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
