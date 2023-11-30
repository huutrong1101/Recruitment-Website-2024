import axiosInstance from '../utils/AxiosInstance'

const inviteCandidate = async (jobId: any, data: any) => {
  return await axiosInstance.post(`/recruiter/jobs/invite/${jobId}`, data)
}

export const InviteService = {
  inviteCandidate
}
