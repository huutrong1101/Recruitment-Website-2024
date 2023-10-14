import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, useState } from 'react'
import { HiTrash } from 'react-icons/hi2'
import { RxChevronDown, RxChevronUp } from 'react-icons/rx'
import PrimaryButton from '../PrimaryButton/PrimaryButton'
import { FieldSchema } from './FieldContainer'

interface RemoveItemDialogProps {
  visible: boolean
  onClose: () => void
  onRemove: () => void
}

function RemoveItemDialog({ visible, onClose, onRemove }: RemoveItemDialogProps) {
  return (
    <>
      <Transition appear show={visible} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-full p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl'>
                  <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-red-400'>
                    Discard the information
                  </Dialog.Title>

                  <div className='mt-2'>
                    <p className='text-sm text-gray-500'>
                      Do you want to discard this information? Your inputted information will be lost forever.
                    </p>
                  </div>

                  <div className='flex flex-row-reverse gap-2 mt-4'>
                    <button
                      type='button'
                      className={classNames(
                        `inline-flex justify-center rounded-md `,
                        `border border-transparent bg-emerald-100 px-4 py-2 `,
                        `text-sm font-medium text-emerald-700 hover:bg-emerald-200 focus:outline-none`,
                        `focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2`
                      )}
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      className={classNames(
                        `inline-flex justify-center rounded-md `,
                        `border border-transparent bg-red-100 px-4 py-2 `,
                        `text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none`,
                        `focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2`
                      )}
                      onClick={onRemove}
                    >
                      Remove
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default function FieldItemInput<T>({
  schema,
  value,
  index,
  primaryLabel,
  removable,

  onFieldItemChange,
  onUpdateFields,
  onDeleteItem
}: {
  schema: FieldSchema<T>
  value: T
  index: number
  primaryLabel: keyof T
  removable: boolean

  onFieldItemChange: () => void
  onUpdateFields: (index: number, data: T) => void
  onDeleteItem: (index: number) => void
}) {
  const [visible, setVisible] = useState<boolean>(false)
  const [data, setData] = useState({ ...value })
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false)

  const handleToggleExpand = () => {
    setVisible((isVisible) => !isVisible)
  }

  const handleFieldChange = (_internalId: any, objectId: unknown, value: string) => {
    // console.log(internalId, objectId, value);
    let cloneObject = structuredClone(data)
    // @ts-ignore
    cloneObject[objectId] = value

    setData(cloneObject)
  }

  const handleUpdateFields = () => {
    onUpdateFields(index, data)
    setVisible(false)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogVisible(false)
  }

  const handleDeleteItem = () => {
    onDeleteItem(index)
  }

  const handleVisibleDeleteDialog = () => {
    setDeleteDialogVisible(true)
  }

  return (
    <div className={classNames(`flex flex-col gap-4 px-4 py-2 border border-gray-900/10`, `rounded-xl select-none`)}>
      {/* Action bar */}
      <div className={`flex flex-row items-center cursor-pointer`}>
        <button
          className={classNames(`flex-1 text-left`, {
            // @ts-ignore
            'text-zinc-400': Object.keys(value).every((id) => value[id] === '')
          })}
          onClick={handleToggleExpand}
          type={`button`}
        >
          {/* @ts-ignore */}
          {primaryLabel !== undefined
            ? value[primaryLabel] === '' || value[primaryLabel] === ''
              ? `Empty item`
              : value[primaryLabel]
            : index}
        </button>
        <div className={`flex flex-row items-center gap-4`}>
          {removable && (
            <button type={'button'} className={`text-red-600`} onClick={handleVisibleDeleteDialog}>
              <HiTrash />
            </button>
          )}

          <button type='button' onClick={handleToggleExpand}>
            {visible ? <RxChevronUp /> : <RxChevronDown />}
          </button>
        </div>
      </div>

      {/* Collapse path */}
      {visible && (
        <>
          <div className='flex flex-col w-full gap-4 p-4'>
            {schema.map(({ display, id, type, placeholder }, _internalFieldIndex) => (
              <div key={_internalFieldIndex}>
                <label className='flex items-center text-sm font-medium leading-6 text-gray-900'>
                  <span>{display}</span>
                </label>
                <input
                  value={data[id] as string}
                  type={type || 'text'}
                  className='w-full px-4 py-1 border border-gray-400 rounded-xl'
                  placeholder={placeholder || 'abc'}
                  onChange={(e) => handleFieldChange(index, id as any, e.target.value)}
                />
              </div>
            ))}
          </div>

          <PrimaryButton type={`button`} text={`Update `} onClick={handleUpdateFields} />
        </>
      )}

      <>
        <RemoveItemDialog visible={deleteDialogVisible} onClose={handleCloseDeleteDialog} onRemove={handleDeleteItem} />
      </>
    </div>
  )
}
