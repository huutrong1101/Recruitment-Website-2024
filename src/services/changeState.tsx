import axiosInstance from '../utils/AxiosInstance'

const changeState = async (data: any) => {
  return await axiosInstance.put(`/recruiter/candidates/state`, data)
}

export const StateService = {
  changeState
}
