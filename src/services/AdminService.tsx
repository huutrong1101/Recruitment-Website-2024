import {
  setCompanyDetail,
  setJobDetail,
  setListRec,
  setNewDetail,
  setTotalBlog,
  setTotalCandidate,
  setTotalJob,
  setTotalRecruiter
} from '../redux/reducer/AdminSlice'
import { Dispatch } from '@reduxjs/toolkit'
import axiosInstance from '../utils/AxiosInstance'

const getListRec = async (dispatch: Dispatch) => {
  // No Content-Type header is manually set here
  const response = await axiosInstance.get(`/admin/recruiters/list_recruiter`)
  const data = response.data.metadata.listRecruiter
  dispatch(setListRec(data))
}

const getListJobs = async ({
  name = '',
  field = '',
  levelRequirement = '',
  acceptanceStatus = '',
  companyName = '',
  page = 1,
  limit = 10
} = {}) => {
  // Tạo đối tượng URLSearchParams mới
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (name) params.append('name', name)
  if (field) params.append('field', field)
  if (levelRequirement) params.append('levelRequirement', levelRequirement)
  if (acceptanceStatus) params.append('acceptanceStatus', acceptanceStatus)
  if (companyName) params.append('companyName', companyName)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()

  return await axiosInstance.get(`/admin/jobs/list_job?${queryParams}`)
}

const getJobDetail = async (dispatch: Dispatch, id: string) => {
  const response = await axiosInstance.get(`/admin/jobs/detail/${id}`)
  const data = response.data.metadata
  dispatch(setJobDetail(data))
}

const getListCompany = async ({
  searchText = '',
  field = '',
  acceptanceStatus = '',
  page = 1, // mặc định là trang đầu tiên nếu không được cung cấp
  limit = 10
} = {}) => {
  // Tạo đối tượng URLSearchParams mới
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (searchText) params.append('searchText', searchText)
  if (field) params.append('field', field)
  if (acceptanceStatus) params.append('acceptanceStatus', acceptanceStatus)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()

  return await axiosInstance.get(`/admin/recruiters/list_recruiter?${queryParams}`)
}

const getCompanyDetail = async (dispatch: Dispatch, id: string) => {
  const response = await axiosInstance.get(`/admin/recruiters/information/${id}`)
  const data = response.data.metadata
  dispatch(setCompanyDetail(data))
}

const getNewDetail = async (dispatch: Dispatch, id: string) => {
  const response = await axiosInstance.get(`/admin/blogs/detail/${id}`)
  const data = response.data.metadata
  dispatch(setNewDetail(data))
}

const approveJob = async (id: string, acceptanceStatus: string, reasonDecline: string) => {
  const values: { acceptanceStatus: string; reasonDecline?: string } = {
    acceptanceStatus: acceptanceStatus
  }
  if (reasonDecline) {
    values.reasonDecline = reasonDecline
  }

  return await axiosInstance.patch(`admin/jobs/approve/${id}`, values)
}

const approveCompany = async (id: string, acceptanceStatus: string, reasonDecline: string) => {
  const values: { acceptanceStatus: string; reasonDecline?: string } = {
    acceptanceStatus: acceptanceStatus
  }

  if (reasonDecline) {
    values.reasonDecline = reasonDecline
  }
  return await axiosInstance.patch(`/admin/recruiters/approve/${id}`, values)
}

const createJob = async (values: any) => {
  return await axiosInstance.post(`/admin/jobs/create`, values)
}

const createCompany = async (values: FormData) => {
  // No Content-Type header is manually set here
  return await axiosInstance.post(`/admin/recruiters/create`, values)
}

const createNew = async (values: FormData) => {
  // No Content-Type header is manually set here
  return await axiosInstance.post(`/admin/blogs/create`, values)
}

const updateRecInformation = async (values: FormData, companyId: string) => {
  // No Content-Type header is manually set here
  return await axiosInstance.patch(`/admin/recruiters/update/${companyId}`, values)
}

const updateJobInformation = async (values: FormData, jobId: string) => {
  return await axiosInstance.patch(`/admin/jobs/update/${jobId}`, values)
}

const updateNewInformation = async (values: FormData, newId: string) => {
  return await axiosInstance.patch(`/admin/blogs/update/${newId}`, values)
}

async function getTotalCandidate(dispatch: Dispatch) {
  const response = await axiosInstance.get('/admin/statistic/total_candidate')
  const data = response.data.metadata.number
  dispatch(setTotalCandidate(data))
}

async function getTotalRecruiter(dispatch: Dispatch) {
  const response = await axiosInstance.get('/admin/statistic/total_recruiter')
  const data = response.data.metadata.number
  dispatch(setTotalRecruiter(data))
}

async function getTotalJob(dispatch: Dispatch) {
  const response = await axiosInstance.get('/admin/statistic/total_job')
  const data = response.data.metadata.number
  dispatch(setTotalJob(data))
}

async function getTotalBlogs(dispatch: Dispatch) {
  const response = await axiosInstance.get('/admin/statistic/total_blog')
  const data = response.data.metadata.number
  dispatch(setTotalBlog(data))
}

const getListNews = async ({ name = '', type = '', status = '', page = 1, limit = 10 } = {}) => {
  // Tạo đối tượng URLSearchParams mới
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (name) params.append('name', name)
  if (type) params.append('type', type)
  if (status) params.append('status', status)
  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()

  return await axiosInstance.get(`/admin/blogs/list_blog?${params}`)
}

const getCaculateRevenueByYear = async (year: number) => {
  return await axiosInstance.get(`/admin/statistic/revenue_by_year?year=${year}`)
}

const getCaculateRevenueByMonth = async (month: number, year: number) => {
  return await axiosInstance.get(`/admin/statistic/revenue_by_month?month=${month}&year=${year}`)
}

const getCaculateRevenueByDate = async (startDate: string, endDate: string) => {
  return await axiosInstance.get(`/admin/statistic/revenue?startDate=${startDate}&endDate=${endDate}`)
}

export const AdminService = {
  getListRec,
  getListJobs,
  getJobDetail,
  getListCompany,
  getCompanyDetail,
  approveJob,
  approveCompany,
  createJob,
  createCompany,
  createNew,
  updateRecInformation,
  updateJobInformation,
  updateNewInformation,
  getTotalCandidate,
  getTotalRecruiter,
  getTotalJob,
  getTotalBlogs,
  getListNews,
  getNewDetail,
  getCaculateRevenueByYear,
  getCaculateRevenueByMonth,
  getCaculateRevenueByDate
}
