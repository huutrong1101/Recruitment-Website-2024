import { Dispatch, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RecService } from '../../services/RecService'
import { RecruiterResponseState } from '../../types/user.type'

interface RecState {
  listRec: RecruiterResponseState[]
  listRecStatus: string
  companyDetail: RecruiterResponseState | null
  companyDetailStatus: string
  listWatingJobs: any[]
  listWatingJobsStatus: string
}

const initialState: RecState = {
  listRec: [],
  listRecStatus: 'idle',
  companyDetail: null,
  companyDetailStatus: 'idle',
  listWatingJobs: [],
  listWatingJobsStatus: 'idle'
}

const RecSlice = createSlice({
  name: 'Recruitement',
  initialState,
  reducers: {
    setListRecs(state, action) {
      state.listRec = action.payload
    },
    setRecDetail(state, action) {
      state.companyDetail = action.payload
    },
    setListWatingJobs(state, action) {
      state.listWatingJobs = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListWatingJobs.pending, (state) => {
      state.listWatingJobsStatus = 'pending'
    })
    builder.addCase(fetchListWatingJobs.fulfilled, (state, action) => {
      state.listWatingJobsStatus = 'fulfill'
      state.listWatingJobs = action.payload
    })
    builder.addCase(fetchListWatingJobs.rejected, (state) => {
      state.listWatingJobsStatus = 'failed'
    })
  }
})

export const fetchListWatingJobs = createAsyncThunk('listJobs/fetchListWatingJobs', async () => {
  const response = await RecService.getListWaitingJob()
  return response.data.metadata.listWaitingJob
})

export default RecSlice.reducer
export const { setListWatingJobs, setListRecs, setRecDetail } = RecSlice.actions
