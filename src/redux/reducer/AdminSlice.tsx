import { Dispatch, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AdminService } from '../../services/AdminService'
import { AdminCompanyInterface, AdminJobInterface, JobInterface } from '../../types/job.type'

interface AdminState {
  listRec: any[]
  listRecStatus: string
  listJobs: any[]
  listJobsStatus: string
  jobDetail: JobInterface | null
  jobDetailStatus: string
  companyDetail: AdminCompanyInterface | null
  companyDetailStatus: string
}

const initialState: AdminState = {
  listRec: [],
  listRecStatus: 'idle',
  listJobs: [],
  listJobsStatus: 'idle',
  jobDetail: null, // Ban đầu jobDetail không có dữ liệu
  jobDetailStatus: 'idle',
  companyDetail: null,
  companyDetailStatus: 'idle'
}

const AdminSlice = createSlice({
  name: 'Recruitement',
  initialState,
  reducers: {
    setListRec(state, action) {
      state.listRec = action.payload
    },
    setListJobs(state, action) {
      state.listJobs = action.payload
    },
    setJobDetail(state, action) {
      state.jobDetail = action.payload
    },
    setCompanyDetail(state, action) {
      state.companyDetail = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchListJobs.pending, (state) => {
      state.listJobsStatus = 'pending'
    })
    builder.addCase(fetchListJobs.fulfilled, (state, action) => {
      state.listJobsStatus = 'fulfill'
      state.listJobs = action.payload
    })
    builder.addCase(fetchListJobs.rejected, (state) => {
      state.listJobsStatus = 'failed'
    })
  }
})

export const fetchListJobs = createAsyncThunk(
  'listJobs/fetchListJobs',
  async (params: { name?: string; field?: string; levelRequirement?: string; acceptanceStatus?: string }) => {
    const response = await AdminService.getListJobs(params)
    return response.data.metadata.listJob
  }
)

export default AdminSlice.reducer
export const { setListRec, setListJobs, setJobDetail, setCompanyDetail } = AdminSlice.actions
