import classnames from 'classnames'
import React from 'react'
import Badge from '../../../components/Badge/Badge'
import { APPLICANTS_STATUS } from '../../../utils/Localization'

interface CandidateStatusBadge extends React.HTMLProps<HTMLDivElement> {
  className?: string
  status: 'NOT_RECEIVED' | 'RECEIVED' | 'PASSED' | 'FAILED' | 'PENDING'
}

export default function CandidateStatusBadge({ className, status }: CandidateStatusBadge) {
  return (
    <Badge
      className={classnames(
        `px-2 w-32`,
        {
          'bg-emerald-600': status === 'PASSED',
          'bg-yellow-600': status === 'NOT_RECEIVED',
          'bg-yellow-500': status === 'PENDING',
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
      <span className={classnames('text-center text-white')}>{APPLICANTS_STATUS[status]}</span>
    </Badge>
  )
}
