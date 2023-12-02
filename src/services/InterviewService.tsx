import qs from 'query-string'
import axiosInstance from '../utils/AxiosInstance'
import { getLocalToken } from '../utils/localToken'
import axios from 'axios'

const createInterview = async (data: any) => {
  return await axiosInstance.post(`/recruiter/interviews`, data)
}

const createQuestion = async (data: any) => {
  return await axiosInstance.post(`/interviewers/interview-questions`, data)
}

const updateQuestion = async (data: any, questionID: string) => {
  return await axiosInstance.put(`/interviewers/interview-questions/${questionID}`, data)
}

const deleteQuestion = async (questionID: string) => {
  return await axiosInstance.delete(`/interviewers/interview-questions/${questionID}`)
}

export async function getCandidateInterviews({ page, limit }: any) {
  const query = qs.stringify({ page, limit })

  return axiosInstance.get(`/candidate/interviews?${query}`)
}

const error = async (data: any) => {
  return await axiosInstance.post(`interviewer/question`, data)
}

const getInterviewerInfor = async () => {
  return await axiosInstance.get(`interviewers/information`)
}

const updateInterviewerInformation = async (values: any) => {
  return await axiosInstance.put(`/interviewers/information`, values)
}

export const InterviewService = {
  createInterview,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  error,
  getCandidateInterviews,
  getInterviewerInfor,
  updateInterviewerInformation
}
