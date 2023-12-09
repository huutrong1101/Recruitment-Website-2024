import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LoadingStatus } from '../../types/services'
import { JobInterface } from '../../types/job.type'
import { JobService } from '../../services/JobService'

export interface JobDetailState {
  jobId: string | null
  status: {
    jobStatus: LoadingStatus
  }
  response: {
    job: JobInterface | null
    isApplied: boolean
  }
}

const initialState: JobDetailState = {
  jobId: null,
  status: {
    jobStatus: 'idle'
  },
  response: {
    job: null,
    isApplied: false
  }
}

const JobDetailSlice = createSlice({
  name: 'JobDetail',
  initialState,
  reducers: {
    setJobResponse: (state, action) => {
      state.response.job = action.payload
    },
    setJobIsApplied: (state, action) => {
      state.response.isApplied = action.payload
    }
  },

  extraReducers(builder) {
    builder.addCase(fetchJobDetail.pending, (state) => {
      state.status.jobStatus = 'pending'
    })
    builder.addCase(fetchJobDetail.fulfilled, (state) => {
      state.status.jobStatus = 'fulfill'
    })
    builder.addCase(fetchJobDetail.rejected, (state) => {
      state.status.jobStatus = 'failed'
    })
  }
})

export const fetchJobDetail = createAsyncThunk('JobDetail/fetchJobDetail', async ({ jobId }: any, thunkAPI) => {
  try {
    const jobResponse = await JobService.getJobFromId(jobId)
    // TODO: add job fetch and check if the user is applied onto this job or not
    thunkAPI.dispatch(setJobResponse(jobResponse.data.result))
    // const isUserAppliedToTheJob = (await JobService.getIfUserAppliedTheJob(jobId)).data
    // thunkAPI.dispatch(setJobIsApplied(isUserAppliedToTheJob.result !== null))
  } catch (e) {
    thunkAPI.rejectWithValue(`Failed to fetch a job`)
  }
})

export const checkApplyJob = createAsyncThunk('JobDetail/checkApplyJob', async ({ jobId }: any, thunkAPI) => {
  try {
    const isUserAppliedToTheJob = (await JobService.getIfUserAppliedTheJob(jobId)).data
    thunkAPI.dispatch(setJobIsApplied(isUserAppliedToTheJob.result !== null))
  } catch (e) {
    thunkAPI.rejectWithValue(`Failed to fetch a job`)
  }
})

export const { setJobResponse, setJobIsApplied } = JobDetailSlice.actions

export default JobDetailSlice.reducer
