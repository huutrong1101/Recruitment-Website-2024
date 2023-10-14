import { Dispatch } from '@reduxjs/toolkit'
import axiosInstance from '../utils/AxiosInstance'
import { STATUS } from '../utils/contanst'

import { setJobs, setJobsStatus, setLocation, setPosition, setTotalJobs, setType } from '../redux/reducer/JobSlice'

async function getJobs(dispatch: Dispatch) {
  dispatch(setJobsStatus(STATUS.LOADING))
  try {
    const response = await axiosInstance.get('jobs', {
      headers: { Authorization: null }
    })
    const data = response.data.result.content
    const totalJobs = response.data.result.totalElements
    dispatch(setJobs(data))
    dispatch(setTotalJobs(totalJobs))
    dispatch(setJobsStatus(STATUS.IDLE))
  } catch (error) {
    dispatch(setJobsStatus(STATUS.ERROR))
  }
}

async function getPosition(dispatch: Dispatch) {
  dispatch(setJobsStatus(STATUS.LOADING))
  try {
    const response = await axiosInstance.get('jobs/position')
    const data = response.data.result
    dispatch(setPosition(data))
    dispatch(setJobsStatus(STATUS.IDLE))
  } catch (error) {
    dispatch(setJobsStatus(STATUS.ERROR))
  }
}

async function getType(dispatch: Dispatch) {
  dispatch(setJobsStatus(STATUS.LOADING))
  try {
    const response = await axiosInstance.get('jobs/type')
    const data = response.data.result
    dispatch(setType(data))
    dispatch(setJobsStatus(STATUS.IDLE))
  } catch (error) {
    dispatch(setJobsStatus(STATUS.ERROR))
  }
}

async function getLocation(dispatch: Dispatch) {
  dispatch(setJobsStatus(STATUS.LOADING))
  try {
    const response = await axiosInstance.get('jobs/location')
    const data = response.data.result
    dispatch(setLocation(data))
    dispatch(setJobsStatus(STATUS.IDLE))
  } catch (error) {
    dispatch(setJobsStatus(STATUS.ERROR))
  }
}

async function getJobFromId(jobId: string) {
  if (!jobId) {
    throw new Error(`The value jobId cannot be undefined`)
  }
  return axiosInstance.get(`/jobs/${jobId}`, {
    headers: { Authorization: `` }
  })
}

async function getIfUserAppliedTheJob(jobId: string) {
  return axiosInstance.get(`/candidate/applied-jobs/${jobId}`)
}

async function getRecJobFromID(jobId: string) {
  if (!jobId) {
    throw new Error(`The value jobId cannot be undefined`)
  }
  return axiosInstance.get(`/jobs/${jobId}`, {
    headers: { Authorization: `` }
  })
}

const createJob = async (data: any) => {
  return await axiosInstance.post(`recruiter/job`, data)
}

const deleteJob = async (data: string) => {
  return await axiosInstance.delete(`/recruiter/job/${data}`)
}

const editJob = async (data: any, jobId: any) => {
  return await axiosInstance.put(`recruiter/jobs/${jobId}`, data)
}

export const JobService = {
  editJob,
  deleteJob,
  createJob,
  getJobs,
  getPosition,
  getType,
  getLocation,
  getJobFromId,
  getIfUserAppliedTheJob,
  getRecJobFromID
}
