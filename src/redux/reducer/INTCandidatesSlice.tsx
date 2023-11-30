import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import { STATUS } from '../../utils/contanst'
import { data } from '../../data/fetchData'

const INTCandidatesSlice = createSlice({
  name: 'INTCandidates',
  initialState: {
    INTCandidates: [],
    INTCandidatesStatus: STATUS.IDLE,
    INTSingleCandidate: [],
    INTSingleCandidateStatus: STATUS.IDLE,
    INTTotalCandidates: 0,
    INTTotalPages: 0
  },
  reducers: {
    setINTCandidates(state, action) {
      state.INTCandidates = action.payload
    },
    setINTCandidatesStatus(state, action) {
      state.INTCandidatesStatus = action.payload
    },
    setINTSingleCandidate(state, action) {
      state.INTSingleCandidate = action.payload
    },
    setINTSingleCandidateStatus(state, action) {
      state.INTSingleCandidateStatus = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchINTCandidatesData.pending, (state) => {
        state.INTCandidatesStatus = STATUS.LOADING
      })
      .addCase(fetchINTCandidatesData.fulfilled, (state, action) => {
        state.INTCandidates = action.payload.content
        state.INTTotalCandidates = action.payload.totalElements
        state.INTTotalPages = action.payload.totalPages
        state.INTCandidatesStatus = STATUS.IDLE
      })
      .addCase(fetchINTCandidatesData.rejected, (state, action) => {
        state.INTCandidatesStatus = STATUS.IDLE
      })

      .addCase(fetchINTCandidatesByID.pending, (state) => {
        state.INTSingleCandidateStatus = STATUS.LOADING
      })
      .addCase(fetchINTCandidatesByID.fulfilled, (state, action) => {
        state.INTSingleCandidate = action.payload
        state.INTSingleCandidateStatus = STATUS.IDLE
      })
      .addCase(fetchINTCandidatesByID.rejected, (state, action) => {
        state.INTSingleCandidateStatus = STATUS.IDLE
      })

      .addCase(fetchINTCandidatesByInterviewId.pending, (state) => {
        state.INTSingleCandidateStatus = STATUS.LOADING
      })
      .addCase(fetchINTCandidatesByInterviewId.fulfilled, (state, action) => {
        state.INTSingleCandidate = action.payload
        state.INTSingleCandidateStatus = STATUS.IDLE
      })
      .addCase(fetchINTCandidatesByInterviewId.rejected, (state, action) => {
        state.INTSingleCandidateStatus = STATUS.IDLE
      })
  }
})

export const { setINTCandidates, setINTCandidatesStatus, setINTSingleCandidate, setINTSingleCandidateStatus } =
  INTCandidatesSlice.actions
export default INTCandidatesSlice.reducer

export const fetchINTCandidatesData = createAsyncThunk(
  'INTcandidates/fetchINTCandidatesData',
  async (query: string, thunkAPI) => {
    const response = await axiosInstance.get(`/interviewers/candidates${query}`)
    return response.data.result
  }
)

export const fetchINTCandidatesByID = createAsyncThunk(
  'INTcandidates/fetchINTCandidatesByID',
  async (interviewID: any, thunkAPI) => {
    const response = await axiosInstance.get(`/interviewers/candidates/${interviewID}`)
    return response.data.result
  }
)

export const fetchINTCandidatesByInterviewId = createAsyncThunk(
  'INTcandidates/fetchINTCandidatesByInterviewId',
  async (interviewID: any, thunkAPI) => {
    const responseInterview = await axiosInstance.get(`/interviewers/interviews/${interviewID}`)
    const candidateId = responseInterview.data.result.candidate.candidateId
    const response = await axiosInstance.get(`/interviewers/candidates/${candidateId}`)
    return response.data.result
  }
)
