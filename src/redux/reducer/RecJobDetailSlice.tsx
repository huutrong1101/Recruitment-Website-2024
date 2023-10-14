import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LoadingStatus } from '../../types/services'
import { JobInterface } from '../../types/product.type'
import { JobService } from '../../services/JobService'

export interface RecJobDetailSlice {
  jobId: string | null
  status: {
    jobStatus: LoadingStatus
  }
  response: {
    job: JobInterface | null
  }
}

const initialState: RecJobDetailSlice = {
  jobId: null,
  status: {
    jobStatus: 'idle'
  },
  response: {
    job: null
  }
}

const JobDetailSlice = createSlice({
  name: 'RecJobDetail',
  initialState,
  reducers: {
    setJobResponse: (state, action) => {
      state.response.job = action.payload
    }
  },

  extraReducers(builder) {
    builder.addCase(fetchRecJobDetail.pending, (state) => {
      state.status.jobStatus = 'pending'
    })
    builder.addCase(fetchRecJobDetail.fulfilled, (state) => {
      state.status.jobStatus = 'fulfill'
    })
    builder.addCase(fetchRecJobDetail.rejected, (state) => {
      state.status.jobStatus = 'failed'
    })
  }
})

export const fetchRecJobDetail = createAsyncThunk(
  'RecJobDetail/fetchRecJobDetail',
  async ({ jobId }: any, thunkAPI) => {
    try {
      const jobResponse = await JobService.getRecJobFromID(jobId)
      // TODO: add job fetch and check if the user is applied onto this job or not
      thunkAPI.dispatch(setJobResponse(jobResponse.data.result))
    } catch (e) {
      thunkAPI.rejectWithValue(`Failed to fetch a job`)
    }
  }
)

export const { setJobResponse } = JobDetailSlice.actions

export default JobDetailSlice.reducer
