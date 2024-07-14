import React, { useEffect, useState } from 'react'
import { Spin } from 'antd' // Import Spin
import { useAppSelector, useAppDispatch } from '../../hooks/hooks'
import { JobInterface } from '../../types/job.type'
import JobCard from '../../components/JobCard/JobCard'
import classNames from 'classnames'
import axiosInstance from '../../utils/AxiosInstance'
import { setHighlightedJobs } from '../../redux/reducer/JobSlice'
import { Dispatch } from '@reduxjs/toolkit'

export default function InterestJobs() {
  const dispatch = useAppDispatch()
  const highlightedJobs: JobInterface[] = useAppSelector((state) => state.Job.highlightedJobs)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getHighlightedJobs(dispatch, { page })
  }, [dispatch, page])

  const loadMoreJobs = () => {
    setPage((prevPage) => prevPage + 1)
  }

  async function getHighlightedJobs(dispatch: Dispatch, { page = 1 }) {
    setLoading(true) // Bắt đầu tải, hiển thị spinner
    try {
      const queryParams = `page=${page}&limit=6`
      const response = await axiosInstance.get(`/highlighted_jobs?${queryParams}`, {
        headers: { Authorization: null }
      })
      const newData = response.data.metadata.listJob

      if (page > 1) {
        dispatch(setHighlightedJobs([...highlightedJobs, ...newData]))
      } else {
        dispatch(setHighlightedJobs(newData))
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className='mt-[40px] md:mt-[80px]'>
      <div className={classNames('text-center')}>
        <h4 className={classNames('tracking-wider text-2xl font-bold text-center')}>VIỆC LÀM NỔI BẬT</h4>
      </div>
      <div className='flex flex-wrap -mx-4 mt-[10px]'>
        {highlightedJobs.map((job) => (
          <div key={job._id} className='w-full px-3 mb-6 sm:w-1/2 lg:w-1/3'>
            <JobCard job={job} isShow={false} inNews={false} />
          </div>
        ))}
      </div>
      {loading && <Spin size='large' className='flex justify-center w-full py-5' />}{' '}
      {/* Hiển thị spinner khi đang tải */}
      <div className={classNames('flex items-center justify-center')}>
        <button onClick={loadMoreJobs} className={classNames('bg-emerald-500 text-white p-3 rounded-md flex')}>
          Xem thêm
        </button>
      </div>
    </div>
  )
}
