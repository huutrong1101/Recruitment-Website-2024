import { setListRecs, setRecDetail } from '../redux/reducer/RecSlice'
import axiosInstance from '../utils/AxiosInstance'
import { Dispatch } from '@reduxjs/toolkit'

const getListRec = async (dispatch: Dispatch, { searchText = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()

  if (searchText) params.append('searchText', searchText)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  const queryParams = params.toString()

  const response = await axiosInstance.get(`recruiters?${queryParams}`)
  const data = response.data.metadata.listRecruiter

  dispatch(setListRecs(data))
}

const getRecFromSlug = async (dispatch: Dispatch, recSlug: string) => {
  if (!recSlug) {
    throw new Error(`The value jobId cannot be undefined`)
  }
  const response = await axiosInstance.get(`/recruiters/${recSlug}`)
  const data = response.data.metadata
  dispatch(setRecDetail(data))
}

const getListWaitingJob = async ({
  name = '',
  field = '',
  type = ''
  // page = 1, limit = 10
} = {}) => {
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (name) params.append('name', name)
  if (field) params.append('field', field)
  if (type) params.append('type', type)

  // params.append('page', page.toString())
  // params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()
  // No Content-Type header is manually set here
  return await axiosInstance.get(`/recruiter/jobs/waiting_jobs?${queryParams}`)
}

const getAcceptedJobs = async ({ name = '', field = '', type = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (name) params.append('name', name)
  if (field) params.append('field', field)
  if (type) params.append('type', type)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()
  // No Content-Type header is manually set here
  return await axiosInstance.get(`/recruiter/jobs/accepted_jobs?${queryParams}`)
}

const getDeclinedJobs = async ({
  name = '',
  field = '',
  type = ''
  // page = 1, limit = 10
} = {}) => {
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (name) params.append('name', name)
  if (field) params.append('field', field)
  if (type) params.append('type', type)

  // params.append('page', page.toString())
  // params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()
  // No Content-Type header is manually set here
  return await axiosInstance.get(`/recruiter/jobs/declined_jobs?${queryParams}`)
}

const createJob = async (values: any) => {
  // No Content-Type header is manually set here
  return await axiosInstance.post(`/recruiter/jobs/create_job`, values)
}

export const RecService = {
  createJob,
  getListWaitingJob,
  getAcceptedJobs,
  getDeclinedJobs,
  getListRec,
  getRecFromSlug
}
