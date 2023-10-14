import { Transition } from '@headlessui/react'
import classNames from 'classnames'
import { useEffect, useState, useRef } from 'react'
import './OneTimePasswordInputArray.scss'

interface OneTimePasswordInputArrayProps {
  onFilled?: (otp: string) => void
  onUnfilled?: () => void
}

let currentOTPIndex: number = 0
export default function OneTimePasswordInputArray({ onFilled, onUnfilled }: OneTimePasswordInputArrayProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''))
  const [visible, setVisible] = useState<boolean[]>(new Array(6).fill(true))
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = target
    const newOTP: string[] = [...otp]
    newOTP[currentOTPIndex] = value.substring(value.length - 1)
    setOtp([...newOTP])

    if (value === '') {
      // Skip the go next
      return
    }

    if (value !== null || value !== undefined) {
      setVisible([...visible].fill(true, currentOTPIndex + 1, currentOTPIndex + 2))

      // Focus to next element if is not a final one
      if (currentOTPIndex < 6) {
        setTimeout(() => {
          const nextFieldInput = document.getElementById(`otp-input-${currentOTPIndex + 1}`)

          if (nextFieldInput != null) {
            nextFieldInput.focus({ preventScroll: true })
            ;(nextFieldInput as HTMLInputElement).select()
          }
        }, 2)
      }
    }
  }

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    currentOTPIndex = index
    if (e.key === 'Backspace' && otp[index] === '') {
      e.preventDefault()
      const previousFieldInput = document.getElementById(`otp-input-${currentOTPIndex - 1}`)

      if (previousFieldInput != null) {
        previousFieldInput.focus({ preventScroll: true })
        ;(previousFieldInput as HTMLInputElement).select()
      }
    }
    if (e.code === 'ArrowLeft') {
      setTimeout(() => {
        const previousFieldInput = document.getElementById(`otp-input-${currentOTPIndex - 1}`)

        if (previousFieldInput != null) {
          previousFieldInput.focus({ preventScroll: true })
          ;(previousFieldInput as HTMLInputElement).select()
        }
      }, 0)
    }

    if (e.code === 'ArrowRight') {
      setTimeout(() => {
        const previousFieldInput = document.getElementById(`otp-input-${currentOTPIndex + 1}`)

        if (previousFieldInput != null) {
          previousFieldInput.focus({ preventScroll: true })
          ;(previousFieldInput as HTMLInputElement).select()
        }
      }, 0)
    }
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [activeOTPIndex])

  useEffect(() => {
    if (otp.every((value) => value !== undefined)) {
      onFilled && onFilled(otp.join(''))
    } else {
      onUnfilled && onUnfilled()
    }
  }, [otp])

  return (
    <div className={classNames(`text-center gap-6 w-full`, ``)}>
      {otp.map((_, index) => {
        return (
          <Transition
            as={'input'}
            appear={true}
            ref={index === activeOTPIndex ? inputRef : null}
            show={visible[index]}
            enter='transform-gpu ease-in-out duration-1000'
            enterFrom='transform-gpu translate-y-2 opacity-0'
            enterTo='transform-gpu translate-y-0 opacity-100'
            className={classNames(
              `ml-1 sm:ml-4 w-6 rounded-md text-xl md:text-3xl text-center inline-block`,
              `border bg-none outline-none`,
              `bg-emerald-600 text-emerald-900 selection:text-black focus:border-black`,
              `border-emerald-700`,
              `delay-[calculate(${index} * 75ms)]`,
              {
                hidden: !visible[index]
              }
            )}
            onChange={handleOnChange}
            onKeyDown={(e) => handleOnKeyDown(e, index)}
            value={otp[index]}
            key={`otp-input-${index}`}
            id={`otp-input-${index}`}
            type='number'
          ></Transition>
        )
      })}
    </div>
  )
}
