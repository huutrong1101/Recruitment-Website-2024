import { useState, Fragment } from 'react'
import { AcountConfig } from '../../types/user.type'
import { Outlet, createSearchParams, useNavigate } from 'react-router-dom'
import useQueryParams from '../../hooks/useQueryParams'
import { isUndefined, omitBy } from 'lodash'
import classNames from 'classnames'
import { BsFilterLeft } from 'react-icons/bs'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { typeSearchAdmin } from '../../utils/contanst'
import { AdminTable } from '../../components/AdminTable/AdminTable'

export type QueryConfig = {
  [key in keyof AcountConfig]: string
}

const types = [
  { id: 1, name: 'All', typename: '' },
  { id: 2, name: 'Recruiter', typename: 'recruiter' },
  { id: 3, name: 'Interviewer', typename: 'interviewer' },
  { id: 4, name: 'Candidate', typename: 'candidate' },
  { id: 5, name: 'Blacklist', typename: 'blacklist' }
]

const field = typeSearchAdmin[0].type.toString()

export default function AdminManagerAccount() {
  const [typeSelected, setTypeSelected] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const [dataSearch, setDataSearch] = useState({
    key: '',
    field: field
  })
  const navigate = useNavigate()

  const queryParams: QueryConfig = useQueryParams()

  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 5,
      role:
        queryParams.role || (typeSelected === 'Blacklist' ? 'CANDIDATE' : typeSelected === 'All' ? '' : typeSelected),
      name: queryParams.name,
      phone: queryParams.phone,
      email: queryParams.email
    },
    isUndefined
  )

  const handleSearch = async (e: any) => {
    e.preventDefault()
    console.log(dataSearch)
  }

  const handleGetData = (type: any) => {
    setTypeSelected(type.typename)

    // navigate({
    //   pathname: '/admin/users',
    //   search: createSearchParams({
    //     ...queryConfig,
    //     role: type.typename === 'Blacklist' ? 'CANDIDATE' : typeSelected === 'All' ? '' : type.typename,
    //     page: '1'
    //   }).toString()
    // })
  }

  return (
    <div className=''>
      <form onSubmit={handleSearch} className='flex justify-center mt-5 mb-5 item-center'>
        <div
          className={classNames(
            'flex items-center flex-shrink-0 w-1/8 p-2 border rounded-lg mr-5 gap-2',
            'focus-within:border-emerald-700'
          )}
        >
          <BsFilterLeft className={classNames(`w-[20px] ml-4`)} />
          <p> Type : </p>
          <Menu as='div' className='relative'>
            <Menu.Button className='flex items-center justify-between w-full p-2 border cursor-pointer rounded-xl'>
              <span className='ml-2 text-zinc-400'>{dataSearch.field}</span>
              <ChevronDownIcon className='w-5 ml-4' />
              {/* Drop down  */}
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
              <Menu.Items className='absolute left-0 z-10 w-full mt-1 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  {typeSearchAdmin.map((type) => (
                    <Menu.Item key={type.typeID}>
                      {({ active }) => (
                        <p
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                          onClick={() =>
                            setDataSearch({
                              ...dataSearch,
                              field: type.type
                            })
                          }
                        >
                          {type.type}
                        </p>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
        <div
          className={classNames(
            'flex items-center flex-shrink-0 w-1/3 p-2 border rounded-lg',
            'focus-within:border-emerald-700'
          )}
        >
          <MagnifyingGlassIcon className={classNames(`w-[20px]`)} />
          <input
            value={dataSearch.key}
            onChange={(e) => setDataSearch({ ...dataSearch, key: e.target.value })}
            type='text'
            placeholder='Search your Keywords'
            className={classNames(
              'w-full h-full text-[12px] ml-3 focus:outline-none text-base text-zinc-400 bg-slate-50'
            )}
          />
        </div>
        {/* Button */}
        <div className={classNames('gap-2 ml-5 w-1/8 items-center justify-center')}>
          <button
            className={classNames(
              'bg-[#05966A] hover:bg-emerald-700 text-white p-3 rounded-md flex w-full text-center items-center justify-center'
            )}
            type='submit'
          >
            Search
          </button>
        </div>
      </form>

      <div className='relative flex-col justify-center bg-white'>
        <div className='inline-flex items-start justify-start p-1 mb-1 overflow-x-auto border rounded-lg border-zinc-900 border-opacity-10'>
          {types.map((type) => (
            <div
              key={type.id}
              className={`inline-flex flex-col items-start justify-start w-full md:w-1/2  ${
                typeSelected === type.typename ? 'rounded bg-[#DFF9EF]' : ''
              }`}
            >
              <div className='flex flex-col items-center justify-center rounded-lg'>
                <div className='inline-flex items-center justify-center px-5 py-1.5 '>
                  <div className='flex items-center justify-center gap-2'>
                    <button
                      className='text-zinc-900 text-[16px] font-semibold capitalize leading-normal tracking-wide'
                      onClick={() => handleGetData(type)}
                    >
                      {type.name}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          {/* <AdminTable typeSelected={typeSelected} /> */}
          <AdminTable typeSelected={typeSelected} />
        </div>
      </div>
      <Outlet />
    </div>
  )
}
