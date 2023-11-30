import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import { STATUS } from '../../utils/contanst'

const INTInterviewsSlice = createSlice({
  name: 'INTInterviews',
  initialState: {
    INTInterviews: [],
    INTInterviewsStatus: STATUS.IDLE,
    INTSingleInterview: [],
    INTSingleInterviewStatus: STATUS.IDLE,
    INTTotalPages: 0,
    INTTotalInterviews: 0,

    skills: [],
    types: [],
    skill: '',
    type: '',
    text: ''
  },
  reducers: {
    setType(state, action) {
      state.type = action.payload
    },
    setSkill(state, action) {
      state.skill = action.payload
    },
    setText(state, action) {
      state.text = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchINTInterviewsData.pending, (state) => {
        state.INTInterviewsStatus = STATUS.LOADING
      })
      .addCase(fetchINTInterviewsData.fulfilled, (state, action) => {
        state.INTInterviews = action.payload.content
        state.INTTotalPages = action.payload.totalPages
        state.INTTotalInterviews = action.payload.totalElements
        state.INTInterviewsStatus = STATUS.IDLE
      })
      .addCase(fetchINTInterviewsData.rejected, (state, action) => {
        state.INTInterviewsStatus = STATUS.IDLE
      })

      .addCase(fetchINTInterviewByID.pending, (state) => {
        state.INTSingleInterviewStatus = STATUS.LOADING
      })
      .addCase(fetchINTInterviewByID.fulfilled, (state, action) => {
        state.INTSingleInterview = action.payload
        state.INTSingleInterviewStatus = STATUS.IDLE
      })
      .addCase(fetchINTInterviewByID.rejected, (state, action) => {
        state.INTSingleInterviewStatus = STATUS.IDLE
      })

      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills = action.payload
      })
      .addCase(fetchTypes.fulfilled, (state, action) => {
        state.types = action.payload
      })
  }
})

export default INTInterviewsSlice.reducer
export const { setText, setSkill, setType } = INTInterviewsSlice.actions

export const fetchINTInterviewsData = createAsyncThunk(
  'INTInterviews/fetchINTInterviewsData',
  async (query: string) => {
    const response = await axiosInstance.get(`/interviewers/interviews${query}`)
    return response.data.result
  }
)

export const fetchINTInterviewByID = createAsyncThunk<any, string | undefined>(
  'INTInterviews/fetchINTInterviewByID',
  async (interviewID: string | undefined) => {
    const response = await axiosInstance.get(`/interviewers/interviews/${interviewID}`)
    return response.data.result
  }
)

export const fetchSkills = createAsyncThunk('INTInterviews/fetchSkill', async () => {
  const response = await axiosInstance.get(`/interviewers/skills`)
  return response.data.result
})

export const fetchTypes = createAsyncThunk('INTInterviews/fetchTypes', async () => {
  const response = await axiosInstance.get(`/interviewers/type`)
  return response.data.result
})
