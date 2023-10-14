import classNames from 'classnames'
import { AiOutlineLoading } from 'react-icons/ai'

interface LoadSpinnerProps {
  className?: string
}

export default function LoadSpinner({ className, ...children }: LoadSpinnerProps) {
  return <AiOutlineLoading className={classNames(`animate-spin`, className)} {...children} />
}
