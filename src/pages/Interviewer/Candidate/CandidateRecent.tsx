import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'

// Component & Icon
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon } from '@heroicons/react/24/outline'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Card, Typography, Button, CardBody, CardFooter, IconButton, Tooltip } from '@material-tailwind/react'

// Function from Slice
import { fetchINTCandidatesData } from '../../../redux/reducer/INTCandidatesSlice'

// Status
import CandidateStatusBadge from './CandidateStatusBadge'

import NOT_AVATAR from '../../../../images/not_avatar.jpg'

export const formatDDMMYY = (date: any) => {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())
  return `${day}-${month}-${year}`
}

const rowsPerPageOptions = [5, 10, 15]

const TABLE_HEAD = ['Name', 'Position', 'Date', 'State', 'Score', 'Actions']

const CandidateRecent = () => {
  const { INTCandidates, INTCandidatesStatus, INTTotalCandidates, INTTotalPages } = useAppSelector(
    (state: any) => state.INTCandidates
  )

  const dispatch = useAppDispatch()

  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [query, setQuery] = useState(`?limit=${rowsPerPage}&page=${page + 1}`)

  const handleIncreasePage = () => {
    if (page < INTTotalPages - 1) {
      const newPage = page + 1
      setCurrentPage(newPage + 1)
      setPage(newPage)
      setQuery(`?limit=${rowsPerPage}&page=${newPage + 1}`)
    }
  }

  const handleDecreasePage = () => {
    if (page > 0) {
      const newPage = page - 1
      setCurrentPage(newPage + 1)
      setPage(newPage)
      setQuery(`?limit=${rowsPerPage}&page=${newPage + 1}`)
    }
  }

  const handleChangeRowsPerPage = (page: number) => {
    setQuery(`?limit=${rowsPerPage}&page=${page}`)
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, INTTotalCandidates - page * rowsPerPage)

  useEffect(() => {
    dispatch(fetchINTCandidatesData(query))
  }, [query])

  console.log(INTCandidates)

  console.log(rowsPerPage)
  return (
    <div className='CandidateRecent'>
      <div className='px-6 py-6 mt-8 border-2 shadow-xl rounded-xl'>
        <div className='mb-5 text-2xl font-semibold '>Candidate Recent</div>
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
                  {INTCandidates.map((candidate: any, index: any) => {
                    const isLast = index === INTCandidates.length - 1
                    const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50'
                    return (
                      <tr key={index}>
                        <td className={classes}>
                          <div className='flex items-center gap-3'>
                            <Typography variant='small' color='blue-gray' className='font-bold'>
                              <div className='flex items-center'>
                                {!candidate?.avatar || candidate?.avatar === null ? (
                                  <img src={NOT_AVATAR} className='w-10 h-10 mr-4 rounded-full' />
                                ) : (
                                  <img src={candidate?.avatar} className='w-10 h-10 mr-4 rounded-full' />
                                )}

                                <div>{candidate?.candidateFullName}</div>
                              </div>
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            {candidate.position}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            {formatDDMMYY(candidate?.date)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            {typeof candidate?.state === 'string' && (
                              <CandidateStatusBadge
                                status={candidate?.state as 'PENDING' | 'REVIEWING' | 'PASS' | 'FAIL'}
                              />
                            )}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            {candidate?.score === null ? 'No Score' : `${candidate.score}`}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant='small' color='blue-gray' className='font-normal'>
                            <button>
                              <Link to={`/interviewer/candidate-recent/${candidate.candidateId}`}>
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
            <Button variant='outlined' size='sm' onClick={handleDecreasePage}>
              Previous
            </Button>
            <div className='flex items-center gap-2'>
              {Array(INTTotalPages)
                .fill(0)
                .map((_, index) => {
                  const pageNumber = index + 1
                  const isCurrentPage = pageNumber === currentPage
                  return (
                    <IconButton
                      variant='outlined'
                      size='sm'
                      onClick={() => {
                        handleChangeRowsPerPage(pageNumber)
                        setCurrentPage(pageNumber)
                      }}
                      className={isCurrentPage ? 'border-cyan-500' : 'border-transparent'}
                    >
                      {pageNumber}
                    </IconButton>
                  )
                })}
            </div>
            <Button variant='outlined' size='sm' onClick={handleIncreasePage}>
              Next
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default CandidateRecent
