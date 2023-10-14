import classnames from 'classnames'
import React from 'react'
import { APPLICANTS_STATUS } from '../../utils/Localization'
import Badge from './Badge'

interface JobStatusBadge extends React.HTMLProps<HTMLDivElement> {
  className?: string
  status: 'NOT_RECEIVED' | 'RECEIVED' | 'PASSED' | 'FAILED'
}

export default function JobStatusBadge({ className, status }: JobStatusBadge) {
  return (
    <Badge
      className={classnames(
        `px-2 w-32`,
        {
          'bg-emerald-600': status === 'PASSED',
          'bg-yellow-600': status === 'NOT_RECEIVED',
          'bg-orange-600': status === 'RECEIVED' || status === 'FAILED'
          // "bg-red-600": ,
        },

        className
      )}
    >
      <span
        className={classnames('h-2 w-2 rounded-xl', {
          'bg-emerald-800': status === 'PASSED',
          'bg-yellow-800': status === 'NOT_RECEIVED',
          'bg-orange-800': status === 'RECEIVED' || status === 'FAILED'
          // "bg-red-800": status === "FAILED",
        })}
      ></span>
      <span
        className={classnames({
          'text-emerald-300': status === 'PASSED',
          'text-yellow-300': status === 'NOT_RECEIVED',
          'text-orange-300': status === 'RECEIVED' || status === 'FAILED'
          // "text-red-300": status === "FAILED",
        })}
      >
        {APPLICANTS_STATUS[status]}
      </span>
    </Badge>
  )
}
