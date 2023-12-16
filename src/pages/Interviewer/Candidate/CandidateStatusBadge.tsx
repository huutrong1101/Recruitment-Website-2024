import classnames from 'classnames'
import React from 'react'
import Badge from '../../../components/Badge/Badge'
import { APPLICANTS_STATUS } from '../../../utils/Localization'

interface CandidateStatusBadge extends React.HTMLProps<HTMLDivElement> {
  className?: string
  status: 'PENDING' | 'REVIEWING' | 'PASS' | 'FAIL' | 'COMPLETED'
}

export default function CandidateStatusBadge({ className, status }: CandidateStatusBadge) {
  return (
    <Badge
      className={classnames(
        `px-2 w-32`,
        {
          'bg-emerald-700': status === 'COMPLETED',
          'bg-emerald-600': status === 'PASS',
          'bg-yellow-600': status === 'REVIEWING',
          'bg-yellow-500': status === 'PENDING',
          'bg-orange-600': status === 'FAIL'
          // "bg-red-600": ,
        },

        className
      )}
    >
      <span
        className={classnames('h-2 w-2 rounded-xl', {
          'bg-emerald-700': status === 'COMPLETED',
          'bg-emerald-800': status === 'PASS',
          'bg-yellow-800': status === 'REVIEWING',
          'bg-orange-800': status === 'FAIL'
          // "bg-red-800": status === "FAILED",
        })}
      ></span>
      <span className={classnames('text-center text-white')}>{APPLICANTS_STATUS[status]}</span>
    </Badge>
  )
}
