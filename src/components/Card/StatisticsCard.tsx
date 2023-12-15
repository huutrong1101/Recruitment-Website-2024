import React from 'react'
import { Typography, Card, CardHeader, CardBody, CardFooter } from '@material-tailwind/react'
import PropTypes from 'prop-types'
import { BanknotesIcon } from '@heroicons/react/24/outline'

interface StatisticsCardProps {
  color: string
  icon: React.ReactElement
  title: string
  value: string
}

export default function StatisticsCard({ color, icon, title, value }: StatisticsCardProps) {
  return (
    <Card>
      <CardHeader variant='gradient' className={`absolute grid w-16 h-16 ml-4 -mt-4 place-items-center ${color}`}>
        {icon}
      </CardHeader>
      <CardBody className='p-4 text-right'>
        <Typography variant='small' className='font-normal text-blue-gray-600'>
          {title}
        </Typography>
        <Typography variant='h4' color='blue-gray'>
          {value}
        </Typography>
      </CardBody>
    </Card>
  )
}
