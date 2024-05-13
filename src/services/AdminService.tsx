import { setCompanyDetail, setJobDetail, setListRec } from '../redux/reducer/AdminSlice'
import { Dispatch } from '@reduxjs/toolkit'
import axiosInstance from '../utils/AxiosInstance'

const getListRec = async (dispatch: Dispatch) => {
  // No Content-Type header is manually set here
  const response = await axiosInstance.get(`/admin/recruiters`)
  const data = response.data.metadata.listRecruiter
  dispatch(setListRec(data))
}

const getListJobs = async ({
  name = '',
  field = '',
  levelRequirement = '',
  acceptanceStatus = '',
  page = 1, // mặc định là trang đầu tiên nếu không được cung cấp
  limit = 10
} = {}) => {
  // Tạo đối tượng URLSearchParams mới
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (name) params.append('name', name)
  if (field) params.append('field', field)
  if (levelRequirement) params.append('levelRequirement', levelRequirement)
  if (acceptanceStatus) params.append('acceptanceStatus', acceptanceStatus)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()

  return await axiosInstance.get(`/admin/jobs?${queryParams}`)
}

const getJobDetail = async (dispatch: Dispatch, id: string) => {
  const response = await axiosInstance.get(`/admin/jobs/${id}`)
  const data = response.data.metadata
  dispatch(setJobDetail(data))
}

const getListCompany = async ({
  name = '',
  acceptanceStatus = '',
  page = 1, // mặc định là trang đầu tiên nếu không được cung cấp
  limit = 10
} = {}) => {
  // Tạo đối tượng URLSearchParams mới
  const params = new URLSearchParams()

  // Thêm các param vào nếu chúng không rỗng
  if (name) params.append('name', name)
  if (acceptanceStatus) params.append('acceptanceStatus', acceptanceStatus)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  // Chuyển params thành chuỗi để gắn vào URL
  const queryParams = params.toString()

  return await axiosInstance.get(`/admin/recruiters?${queryParams}`)
}

const getCompanyDetail = async (dispatch: Dispatch, id: string) => {
  const response = await axiosInstance.get(`/admin/recruiters/${id}`)
  const data = response.data.metadata
  dispatch(setCompanyDetail(data))
}

const approveJob = async (id: string, acceptanceStatus: string) => {
  const values = {
    acceptanceStatus: acceptanceStatus
  }
  return await axiosInstance.patch(`admin/jobs/${id}/approve`, values)
}

const approveCompany = async (id: string, acceptanceStatus: string) => {
  const values = {
    acceptanceStatus: acceptanceStatus
  }
  return await axiosInstance.patch(`admin/recruiters/${id}/approve`, values)
}

export const AdminService = {
  getListRec,
  getListJobs,
  getJobDetail,
  getListCompany,
  getCompanyDetail,
  approveJob,
  approveCompany
}
