import classnames from 'classnames'
import { AiOutlineLoading } from 'react-icons/ai'

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  className?: string
  isLoading?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function PrimaryButton({ text, className, size, isLoading, ...children }: PrimaryButtonProps) {
  return (
    <button
      className={classnames(
        `Button bg-emerald-600 hover:bg-emerald-800 disabled:bg-emerald-900 text-white`,
        `transition-colors ease-in-out duration-100`,
        `rounded-lg flex-row justify-center items-center inline-flex gap-4`,
        'text-base px-4 py-2 w-full',
        {
          'text-sm px-4 py-2': size === 'sm'
        },
        className
      )}
      {...children}
    >
      {isLoading && <AiOutlineLoading className={`animate-spin`} />}
      {text}
    </button>
  )
}
