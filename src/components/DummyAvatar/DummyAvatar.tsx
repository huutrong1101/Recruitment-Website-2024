import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { AiOutlineUser } from 'react-icons/ai'

interface DummyAvatarProps {
  wrapperClassName?: string
  iconClassName?: string
}

export default function DummyAvatar({ wrapperClassName, iconClassName }: DummyAvatarProps) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    setShow(true)
  }, [])

  return (
    <Transition appear={true} show={show}>
      <Transition.Child
        enter='transform-gpu opacity-0 scale-50'
        enterFrom='transform-gpu opacity-0  scale-50'
        enterTo='transform-gpu opacity-100 scale-100'
        className={classNames(
          `bg-zinc-200 rounded-full p-3 transition-all ease-in-out duration-700`,
          `h-full w-auto`,
          wrapperClassName
        )}
      >
        <Transition.Child
          enter='transform-gpu opacity-0 scale-50'
          enterFrom='transform-gpu opacity-0  scale-50'
          enterTo='transform-gpu opacity-100 scale-100'
          className={classNames(`transition-all ease-in-out duration-700 delay-300`)}
        >
          <AiOutlineUser className={classNames(iconClassName)} />
        </Transition.Child>
      </Transition.Child>
    </Transition>
  )
}
