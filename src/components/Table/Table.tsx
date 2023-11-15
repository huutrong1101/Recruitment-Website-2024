import classNames from 'classnames'
import moment from 'moment'
import { useEffect, useState } from 'react'
import Modal from '../../components/Modal/Modal'

export interface TableRow {
  id: string
  value: any
  format?: string | 'join'
}

export interface TableProps<T> {
  rows: TableRow[]
  data: T[]
  isModal: boolean
}

export default function Table<T>({ rows, data, isModal }: TableProps<T>) {
  let [isOpen, setIsOpen] = useState(false)

  const [itemClick, setItemClick] = useState({
    interviewId: '',
    interviewLink: '',
    interviewerNames: [],
    jobId: '',
    jobName: '',
    time: ''
  })

  const handleClick = (value: any) => {
    openModal()
    setItemClick(value)
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  /**
   * Pre-condition for id
   */
  useEffect(() => {
    const set = new Set<string>()
    for (let row of rows) {
      if (set.has(row.id)) {
        throw new Error(`Duplicate row id ${row.id}`)
      } else {
        set.add(row.id)
      }
    }
  }, [])

  return (
    <div className='w-full list-view-table-wrapper'>
      {/* Table simulation */}
      <table className={classNames(`table-auto border-collapse bg-white/40 w-full border`)}>
        <thead className={classNames(`rounded uppercase`)}>
          <tr>
            {rows.map((row, _rowIdx) => {
              return (
                <th
                  key={`thead-${row.id}-${_rowIdx}`}
                  className={classNames(
                    `font-semibold text-zinc-400 text-left py-2 px-4 text-xs  rounded-xl`,
                    ` hover:text-emerald-600 transition-color duration-75`
                  )}
                >
                  {row.value}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index: number) => (
            <tr
              key={`tbody-tr-${item.id}-${index}`}
              className={classNames(
                `border-t border-b bg-white text-zinc-600 hover:bg-black/5 transition-colors duration-75`
              )}
            >
              {rows.map((_row, _index) => {
                const key: string = _row.id
                let value: any = item[key]
                if (_row.format === 'join') {
                  value = item[key].join(', ')
                } else if (_row.format) {
                  value = moment(item[key]).format(_row.format)
                }

                return (
                  <td
                    key={`tbody-tr-td-${key}-${index}-${_index}`}
                    className={classNames(`font-normal text-left py-4 px-4 text-sm`)}
                    onClick={() => handleClick(item)}
                  >
                    {/* {item[key]} */}
                    {value === item.link ? 'Link' : value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {isModal && (
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
              <div className='flex flex-row items-center justify-center mt-2 mr-4'>
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
                    {itemClick.interviewerNames.join(', ')}
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
      )}
    </div>
  )
}
