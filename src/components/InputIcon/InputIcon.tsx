import classnames from 'classnames'
import { FieldValues, Path, UseFormRegister } from 'react-hook-form'

// export interface InputIconValues extends React.HTMLProps<HTMLInputElement> {}

interface InputIconProps<T extends FieldValues> extends React.HTMLProps<HTMLInputElement> {
  register: UseFormRegister<T>
  required?: boolean
  icon: React.ReactElement
  wrapperClassName?: string
  className?: string
  label: Path<T>
}

export default function InputIcon<T extends FieldValues>({
  wrapperClassName,
  icon,
  register,
  label,
  required,
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
          className={classnames(`p-2`, `font-light`, `outline-none rounded-r-md`, `w-full`)}
          {...register(label, { required })}
          {...children}
        />
      </div>
    </div>
  )
}
