import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'

// Component & Icon
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

// Function from Slice

// Status
import LoadSpinner from '../../../components/LoadSpinner/LoadSpinner'
import { ADMIN_APPLICANTS_STATUS } from '../../../utils/Localization'
import Error from '../Candidate/Error'
import { fetchINTInterviewsData } from '../../../redux/reducer/INTInterviewsSlice'
import { STATUS } from '../../../utils/contanst'
import { formatDDMMYY } from '../Candidate/CandidateRecent'
import { Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip } from '@material-tailwind/react'
import { data } from '../../../data/fetchData'
import CandidateStatusBadge from '../Candidate/CandidateStatusBadge'

const rowsPerPageOptions = [5, 10, 15]

const TABLE_HEAD = ['Job Name', 'Position', 'Date', 'State', 'Actions']

const InterviewRecent = () => {
  const { INTInterviews, INTInterviewsStatus, INTTotalInterviews, INTTotalPages } = useAppSelector(
    (state: any) => state.INTInterviews
  )
  const { INTCandidates } = useAppSelector((state: any) => state.INTCandidates)
  const dispatch = useAppDispatch()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [query, setQuery] = useState(`?size=${rowsPerPage}&page=${page + 1}`)

  const handleIncreasePage = () => {
    if (page < INTTotalPages - 1) {
      setPage(page + 1)
      const newPage = page + 1
      setQuery(`?size=${rowsPerPage}&page=${newPage + 1}`)
    }
  }
  const handleDecreasePage = () => {
    if (page > 0) {
      setPage(page - 1)
      const newPage = page - 1
      setQuery(`?size=${rowsPerPage}&page=${newPage + 1}`)
    }
  }

  const handleChangeRowsPerPage = (event: any) => {
    const rowsPerPageValue = parseInt(event.target.value, 10)
    if (rowsPerPageValue !== rowsPerPage) {
      setRowsPerPage(rowsPerPageValue)
      setPage(0)
      const newPage = 0
      const newRowsPerPage = rowsPerPageValue
      setQuery(`?size=${newRowsPerPage}&page=${newPage + 1}`)
    }
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, INTTotalInterviews - page * rowsPerPage)

  useEffect(() => {
    dispatch(fetchINTInterviewsData(query))
  }, [query])

  console.log(INTInterviews)

  // if (INTInterviewsStatus === STATUS.IDLE || INTInterviewsStatus === STATUS.LOADING) {
  return (
    <div className='InterviewRecent'>
      <div className='px-6 py-6 mt-8 border-2 shadow-xl rounded-xl'>
        <div className='mb-5 text-2xl font-semibold'>Interview Recent</div>

        <Card className='w-full h-full'>
          <CardBody className='px-0 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full text-left table-auto min-w-max'>
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th key={head} className='p-4 border-y border-blue-gray-100 bg-blue-gray-50/50'>
                        <Typography variant='small' color='blue-gray' className='font-normal leading-none opacity-70'>
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INTInterviews.map((interview: any, index: any) => {
                    const isLast = index === INTInterviews.length - 1
                    const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'
                    return (
                      <tr key={index}>
                        <td className={classes}>
                          <div className='flex items-center gap-3'>
                            <Typography variant='small' color='blue-gray' className='font-bold'>
                              {interview?.jobName}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            {interview?.position}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            {formatDDMMYY(interview?.time)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            {typeof interview?.state === 'string' && (
                              <CandidateStatusBadge status={interview?.state as 'PENDING' | 'COMPLETED'} />
                            )}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            <button>
                              <Link to={`/interviewer/interview-recent/${interview.interviewId}`}>
                                <Tooltip content='Read Detail'>
                                  <PencilIcon className='relative flex items-center justify-center w-5 h-5 gap-2 rounded-lg' />
                                </Tooltip>
                              </Link>
                            </button>
                          </Typography>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
          <CardFooter className='flex items-center justify-between p-4 border-t border-blue-gray-50'>
            <Button variant='outlined' size='sm'>
              Previous
            </Button>
            <div className='flex items-center gap-2'>
              <IconButton variant='outlined' size='sm'>
                1
              </IconButton>
              <IconButton variant='text' size='sm'>
                2
              </IconButton>
              <IconButton variant='text' size='sm'>
                3
              </IconButton>
              <IconButton variant='text' size='sm'>
                ...
              </IconButton>
              <IconButton variant='text' size='sm'>
                8
              </IconButton>
              <IconButton variant='text' size='sm'>
                9
              </IconButton>
              <IconButton variant='text' size='sm'>
                10
              </IconButton>
            </div>
            <Button variant='outlined' size='sm'>
              Next
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
  // } else if (INTInterviewsStatus === STATUS.ERROR500) {
  //   // return <Error errorCode={STATUS.ERROR500} />
  // } else if (INTInterviewsStatus === STATUS.ERROR404) {
  //   // return <Error errorCode={STATUS.ERROR404} />
  // }
}
export default InterviewRecent
