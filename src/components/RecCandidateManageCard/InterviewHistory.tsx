import classNames from 'classnames'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip } from '@material-tailwind/react'

const TABLE_HEAD = ['POSITION RECURUITMENT', 'DATE', 'STATE']

export default function InterviewHistory() {
  const { userId } = useParams()
  const [interview, setInterview] = useState([])
  const [totalPages, setTotalPages] = useState()

  let navigate = useNavigate()
  const routeChange = (jobId: string) => {
    let path = `../jobdetail/${jobId}`
    navigate(path)
  }
  useEffect(() => {
    const getInterviewHistory = async () => {
      try {
        const response = await axiosInstance.get(`recruiter/candidates/${userId}/interviews`)

        console.log(response.data.result.content)

        if (response.data.result !== null) {
          setInterview(response.data.result.content)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getInterviewHistory()
  }, [userId])

  console.log(interview)

  return (
    // <div className="p-6 mt-8 bg-white border History rounded-2xl">
    <div className={classNames(`border bg-white shadow-sm rounded-xl`, `px-8 py-8`, `text-justify`)}>
      <h1 className='text-2xl font-semibold'> Interview History</h1>
      {interview ? (
        <div className='relative mt-2 overflow-x-auto'>
          {/* <table className='w-full text-sm text-left text-gray-500'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 '>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                    <Typography variant='small' color='blue-gray' className='font-semibold leading-none'>
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {interview.map((interview: any, index: any) => {
                const isLast = index === interview.length - 1
                const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'
                const date = moment(interview.time).format('Do MMM, YYYY')
                return (
                  <tr key={index}>
                    <td className={classes}>
                      <div className='flex items-center gap-3'>
                        <Typography variant='small' color='blue-gray' className='font-bold'>
                          <p
                            className='cursor-pointer w-fit hover:underline'
                            onClick={() => {
                              routeChange(interview.jobId)
                            }}
                          >
                            {interview.jobName}
                          </p>
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant='small' color='blue-gray' className='font-normal'>
                        {date}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant='small' color='blue-gray' className='font-normal'>
                        <span
                          className={`rounded-lg p-2 mx-2 my-1  ${
                            interview.state === 'PASSED'
                              ? 'bg-green-200'
                              : interview.state === 'FAILED'
                              ? 'bg-green-200'
                              : interview.state === 'NOT_RECEIVED'
                              ? 'bg-yellow-100'
                              : 'bg-yellow-100'
                          }`}
                        >
                          {interview.state === 'RECEIVED'
                            ? 'Pending'
                            : interview.state === 'NOT_RECEIVED'
                            ? 'Pending'
                            : interview.state === 'PASSED'
                            ? 'Finish'
                            : 'Finish'}
                        </span>
                      </Typography>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table> */}
          <Card className='w-full h-full'>
            <CardBody className='px-0 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full text-left table-auto min-w-max'>
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head) => (
                        <th key={head} className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                          <Typography variant='small' color='blue-gray' className='font-semibold leading-none'>
                            {head}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {interview.map((interview: any, index: any) => {
                      const isLast = index === interview.length - 1
                      const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'
                      const date = moment(interview.time).format('Do MMM, YYYY')
                      return (
                        <tr key={index}>
                          <td className={classes}>
                            <div className='flex items-center gap-3'>
                              <Typography variant='small' color='blue-gray' className='font-bold'>
                                <p
                                  className='cursor-pointer w-fit hover:underline'
                                  onClick={() => {
                                    routeChange(interview.jobId)
                                  }}
                                >
                                  {interview.jobName}
                                </p>
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <Typography variant='small' color='blue-gray' className='font-normal'>
                              {date}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography variant='small' color='blue-gray' className='font-normal'>
                              <span
                                className={`rounded-lg p-2 mx-2 my-1  ${
                                  interview.state === 'PASSED'
                                    ? 'bg-green-200'
                                    : interview.state === 'FAILED'
                                    ? 'bg-green-200'
                                    : interview.state === 'NOT_RECEIVED'
                                    ? 'bg-yellow-100'
                                    : 'bg-yellow-100'
                                }`}
                              >
                                {interview.state === 'RECEIVED'
                                  ? 'Pending'
                                  : interview.state === 'NOT_RECEIVED'
                                  ? 'Pending'
                                  : interview.state === 'PASSED'
                                  ? 'Finish'
                                  : 'Finish'}
                              </span>
                            </Typography>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        <div className='text-center text-[1.1rem]'>No interviews found for this candidate</div>
      )}
    </div>
  )
}
