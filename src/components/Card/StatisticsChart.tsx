import React from 'react'
import PropTypes from 'prop-types'
import { Typography, Card, CardHeader, CardBody, CardFooter } from '@material-tailwind/react'
import Chart from 'react-apexcharts'

const StatisticsChart = ({ color, chart, title, description, footer }: any) => {
  return (
    <Card>
      <CardHeader variant='gradient' className={color}>
        <Chart {...chart} />
      </CardHeader>
      <CardBody className='p-6'>
        <Typography variant='h6' color='blue-gray'>
          {title}
        </Typography>
        <Typography variant='small' className='font-normal text-blue-gray-600'>
          {description}
        </Typography>
      </CardBody>
      {footer && <CardFooter className='px-6 py-5 border-t border-blue-gray-50'>{footer}</CardFooter>}
    </Card>
  )
}

StatisticsChart.propTypes = {
  color: PropTypes.string.isRequired,
  chart: PropTypes.shape({
    type: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    series: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
      }).isRequired
    ).isRequired,
    options: PropTypes.object.isRequired
  }).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  footer: PropTypes.string
}

export default StatisticsChart
