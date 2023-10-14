import { ChangeEvent, HTMLProps, useRef } from 'react'
import PrimaryButton from '../PrimaryButton/PrimaryButton'

interface PrimaryInputFileProps extends HTMLProps<HTMLInputElement> {
  text?: string
  onSelectedFile?: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  isLoading?: boolean
}

export default function PrimaryInputFile({
  text,
  onSelectedFile,
  isLoading,
  disabled,
  ...children
}: PrimaryInputFileProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOnButtonClick = () => {
    if (inputRef !== null) {
      inputRef.current?.click()
    }
  }

  return (
    <>
      <input type='file' className={`hidden`} ref={inputRef} onChange={onSelectedFile} {...children} />

      <PrimaryButton
        text={text || 'Change'}
        onClick={handleOnButtonClick}
        disabled={disabled || false}
        isLoading={isLoading || false}
      />
    </>
  )
}
