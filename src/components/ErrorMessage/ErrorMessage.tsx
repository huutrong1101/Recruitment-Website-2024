import React from 'react'
import { FieldError } from 'react-hook-form'

interface ErrorMessageProps {
  error?: FieldError
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null

  return <div className='w-full text-red-500'>{error.message}</div>
}

export default ErrorMessage
