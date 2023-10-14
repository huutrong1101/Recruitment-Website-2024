import { Dialog, Transition } from '@headlessui/react'
import classnames from 'classnames'
import { Fragment, useEffect, useState } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  handleSucces: () => void
  title: string
  titleClass: string
  size: string
  children: React.ReactNode
  cancelTitle: string
  successClass: string
  successTitle: string
}

export default function Modal({
  isOpen,
  onClose,
  title,
  titleClass,
  children,
  size,
  cancelTitle,
  successClass,
  successTitle,
  handleSucces
}: ModalProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen)

  useEffect(() => {
    setIsDialogOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setIsDialogOpen(false)
    onClose()
  }

  const handleSuccess = () => {
    handleSucces()
  }

  return (
    <>
      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={handleClose}>
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
                <Dialog.Panel
                  className={`w-full  p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl ${
                    size ? size : 'max-w-md'
                  } `}
                >
                  <Dialog.Title
                    as='h3'
                    className={titleClass ? titleClass : 'text-lg font-medium leading-6 text-gray-900'}
                  >
                    {title}
                  </Dialog.Title>
                  <div className='mt-2'>{children}</div>

                  <div className='flex items-center justify-end gap-3 mt-4'>
                    <button
                      type='button'
                      className={classnames(
                        'inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      )}
                      onClick={handleClose}
                    >
                      {cancelTitle}
                    </button>
                    <button
                      type='button'
                      className={classnames(
                        'inline-flex justify-center px-4 py-2 text-sm font-medium  border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                        successClass
                      )}
                      onClick={handleSuccess}
                    >
                      {successTitle}
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
