import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Tab } from '@headlessui/react'
import { default as classNames, default as classnames } from 'classnames'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { HiCalendarDays, HiListBullet } from 'react-icons/hi2'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Modal from '../../../components/Modal/Modal'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import UserProfileInterviewListView from './UserProfileInterviewListView'
import { getUserInterviews } from '../../../redux/reducer/UserInterviewSlice'

export interface TableRow {
  id: string
  value: any
}

export interface TableProps<T> {
  rows: TableRow[]
  data: T[]
}

function UserProfileInterviewCalendarView<T>({ rows, data }: TableProps<T>) {
  let [isOpen, setIsOpen] = useState(false)

  const [itemClick, setItemClick] = useState({
    jobName: '',
    time: '',
    interviewersName: [],
    interviewLink: ''
  })

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  console.log({ data })

  const convertDataForFullCalendar = (data: any) => {
    const initialEvents = data.map((item: any, index: any) => {
      const dateObject = moment(item.time)
      return {
        id: index.toString(),
        title: item.jobName,
        date: dateObject.format('YYYY-MM-DD'),

        jobName: item.jobName,
        interviewersName: item.interviewersName,
        interviewLink: item.interviewLink,
        time: item.time
      }
    })

    return initialEvents
  }

  const newData = convertDataForFullCalendar(data)

  const handleEventClick = (selected: any) => {
    openModal()
    setItemClick(selected.event.extendedProps)
  }

  return (
    <>
      <div className='w-full mt-2'>
        <FullCalendar
          height='70vh'
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          // select={handleDateClick}
          eventClick={handleEventClick}
          initialEvents={newData}
        />
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title='Interview Detail'
        titleClass='text-xl font-bold leading-7 text-center text-green-600'
        cancelTitle='Cancel'
        successClass='text-green-900 bg-green-100 hover:bg-green-200 focus-visible:ring-green-500'
        successTitle='OK'
        size='max-w-xl'
        handleSucces={closeModal}
      >
        <div className='flex items-center justify-center gap-5 mt-2'>
          <div className='w-full'>
            <div className='flex flex-row justify-center mt-2'>
              <div className='flex flex-col w-[50%] '>
                {rows.map((row, _rowIdx) => {
                  return (
                    <div
                      key={`thead-${row.id}-${_rowIdx}`}
                      className={classNames(
                        `font-semibold text-zinc-400 text-left py-2 px-4 text-xs  rounded-xl`,
                        ` hover:text-emerald-600 transition-color duration-75`
                      )}
                    >
                      {row.value} :
                    </div>
                  )
                })}
              </div>
              <div className='flex flex-col w-[50%]'>
                <div
                  className={classNames(
                    `text-zinc-400 text-left py-2 px-4 text-xs  rounded-xl`,
                    ` hover:text-emerald-600 transition-color duration-75`
                  )}
                >
                  {itemClick.jobName}
                </div>
                <div
                  className={classNames(
                    `text-zinc-400 text-left py-2 px-4 text-xs  rounded-xl`,
                    ` hover:text-emerald-600 transition-color duration-75`
                  )}
                >
                  {moment(itemClick.time).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                <div
                  className={classNames(
                    `text-zinc-400 text-left py-2 px-4 text-xs  rounded-xl`,
                    ` hover:text-emerald-600 transition-color duration-75`
                  )}
                >
                  {itemClick.interviewersName.join(', ')}
                </div>
                <a
                  href={itemClick.interviewLink}
                  target='_blank'
                  className={classNames(
                    `text-zinc-400 text-left py-2 px-4 text-xs  rounded-xl`,
                    ` hover:text-emerald-600 transition-color duration-75`
                  )}
                >
                  Click here to get interview
                </a>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

const viewModeItems = [
  {
    name: 'List view',
    icon: <HiListBullet />
  },
  {
    name: 'Calendar View',
    icon: <HiCalendarDays />
  }
]

const rows = [
  {
    id: 'jobName',
    value: 'Job title'
  },
  {
    id: 'time',
    value: 'Date',
    format: 'DD/MM/YYYY HH:mm:ss'
  },
  {
    id: 'interviewerNames',
    value: 'Interviewer',
    format: 'join'
  },
  {
    id: 'link',
    value: 'Link'
  }
]

export default function UserProfileInterviews() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const data = useAppSelector((state) => state.UserInterview.interviews)

  useEffect(() => {
    // console.log(searchParams);
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '5'
    dispatch(getUserInterviews({ page, limit }))
      .unwrap()
      .catch((response) => {
        console.log()
        toast.error(
          // `There was an error when fetching your interview schedule.`,
          response.message
        )
      })
  }, [])

  return (
    <div className='flex-1'>
      <Tab.Group>
        <Tab.List className={classnames(`flex flex-row gap-2 bg-zinc-100 p-1 rounded-xl`)}>
          {viewModeItems.map((_, _idx) => {
            return (
              <Tab
                className={({ selected }) =>
                  classnames(
                    `px-3 py-2 rounded-xl transition-all duration-100 ease-in-out`,
                    `hover:bg-zinc-300 flex flex-row items-center gap-2`,
                    selected ? `bg-emerald-600 text-emerald-300 hover:!bg-emerald-800` : ``
                  )
                }
                key={_.name}
              >
                <span>{_.icon}</span>
                <span>{_.name}</span>
              </Tab>
            )
          })}
        </Tab.List>

        {/* Content items */}
        <Tab.Panels>
          <Tab.Panel>
            <UserProfileInterviewListView rows={rows} data={data} />
          </Tab.Panel>
          <Tab.Panel>
            <UserProfileInterviewCalendarView rows={rows} data={data} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
