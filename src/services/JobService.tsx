import { Dispatch } from '@reduxjs/toolkit'
import axiosInstance from '../utils/AxiosInstance'
import { STATUS } from '../utils/contanst'

import {
  setActivity,
  setExperience,
  setGenderRequirement,
  setJobDetail,
  setJobs,
  setJobsStatus,
  setLevelRequirement,
  setLocation,
  setPosition,
  setProvince,
  setTotalJobs,
  setType
} from '../redux/reducer/JobSlice'

async function getJobs(
  dispatch: Dispatch,
  {
    name = '',
    province = '',
    type = '',
    levelRequirement = '',
    experience = '',
    field = '',
    genderRequirement = ''
    // page = 1,
    // limit = 10
  } = {}
) {
  dispatch(setJobsStatus(STATUS.LOADING))
  try {
    const params = new URLSearchParams()

    if (name) params.append('name', name)
    if (province) params.append('province', province)
    if (type) params.append('type', type)
    if (levelRequirement) params.append('levelRequirement', levelRequirement)
    if (experience) params.append('experience', experience)
    if (field) params.append('field', field)
    if (genderRequirement) params.append('genderRequirement', genderRequirement)

    // params.append('page', page.toString())
    // params.append('limit', limit.toString())

    const queryParams = params.toString()

    console.log(`/jobs?${queryParams}`)

    const response = await axiosInstance.get(`/jobs?${queryParams}`, {
      headers: { Authorization: null }
    })

    const data = response.data.metadata.listJob
    const totalJobs = response.data.metadata.totalElement
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
    const response = await axiosInstance.get('job_type')
    const data = response.data.metadata.jobType
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

async function getActivity(dispatch: Dispatch) {
  const response = await axiosInstance.get('field_of_activity')
  const data = response.data.metadata.fieldOfActivity
  dispatch(setActivity(data))
}

async function getProvince(dispatch: Dispatch) {
  const response = await axiosInstance.get('province')
  const data = response.data.metadata.provinceOfVietNam
  dispatch(setProvince(data))
}

async function getExperience(dispatch: Dispatch) {
  const response = await axiosInstance.get('experience')
  const data = response.data.metadata.experience
  dispatch(setExperience(data))
}

async function getLevelRequirement(dispatch: Dispatch) {
  const response = await axiosInstance.get('level_requirement')
  const data = response.data.metadata.levelRequirement
  dispatch(setLevelRequirement(data))
}

async function getGenderRequirement(dispatch: Dispatch) {
  const response = await axiosInstance.get('gender_requirement')
  const data = response.data.metadata.genderRequirement
  dispatch(setGenderRequirement(data))
}

async function getJobFromId(jobId: string) {
  if (!jobId) {
    throw new Error(`The value jobId cannot be undefined`)
  }
  return await axiosInstance.get(`/jobs/${jobId}`)
}

async function getIfUserAppliedTheJob(jobId: string) {
  return axiosInstance.get(`/candidate/applied-jobs/${jobId}`)
}

async function getRecJobFromID(jobId: string) {
  if (!jobId) {
    throw new Error(`The value jobId cannot be undefined`)
  }
  return axiosInstance.get(`jobs/${jobId}`)
}

const createJob = async (data: any) => {
  return await axiosInstance.post(`recruiter/job`, data)
}

const deleteJob = async (data: string) => {
  return await axiosInstance.delete(`/recruiter/jobs/${data}`)
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
  getRecJobFromID,
  getActivity,
  getProvince,
  getExperience,
  getLevelRequirement,
  getGenderRequirement
}
