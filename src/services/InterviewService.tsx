import qs from 'query-string'
import axiosInstance from '../utils/AxiosInstance'

const createInterview = async (data: any) => {
  return await axiosInstance.post(`/recruiter/interviews`, data)
}

const createQuestion = async (data: any) => {
  return await axiosInstance.post(`interviewer/question`, data)
}

const updateQuestion = async (data: any, questionID: string) => {
  return await axiosInstance.put(`interviewer/question/${questionID}`, data)
}

const deleteQuestion = async (questionID: string) => {
  return await axiosInstance.delete('interviewer/question/' + questionID)
}

export async function getCandidateInterviews({ index, size }: any) {
  const query = qs.stringify({ index, size })

  return axiosInstance.get(`/candidate/interviews?${query}`)
}

const error = async (data: any) => {
  return await axiosInstance.post(`interviewer/question`, data)
}

export const InterviewService = {
  createInterview,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  error,
  getCandidateInterviews
}
