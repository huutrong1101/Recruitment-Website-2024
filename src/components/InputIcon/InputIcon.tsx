import classnames from 'classnames'
import { FieldValues, Path, UseFormRegister } from 'react-hook-form'

interface InputIconProps<T extends FieldValues> extends React.HTMLProps<HTMLInputElement> {
  register: UseFormRegister<T>
  required?: boolean
  icon: React.ReactElement
  wrapperClassName?: string
  className?: string
  label: Path<T>
  validation?: {
    required?: string | boolean
    pattern?: {
      value: RegExp
      message: string
    }
    minLength?: {
      value: number
      message: string
    }
    validate?: (value: string) => true | string
  }
}

export default function InputIcon<T extends FieldValues>({
  wrapperClassName,
  icon,
  register,
  label,
  required,
  validation,
  ...children
}: InputIconProps<T>) {
  return (
    <div
      className={classnames(
        `flex flex-row items-center justify-center`,
        `bg-white text-zinc-500`,
        `rounded-md`,
        `border w-full`,
        wrapperClassName
      )}
    >
      <div className={classnames(`w-4 mx-2`)}>
        <span className=''>{icon}</span>
      </div>

      <div className='flex-1'>
        <input
          className={classnames(
            `p-2`,
            `font-light`,
            `outline-none rounded-r-md`,
            `w-full`,
            `border-0 focus:ring-0 focus-within:border-blue-500`
          )}
          {...register(label, validation)}
          {...children}
        />
      </div>
    </div>
  )
}
