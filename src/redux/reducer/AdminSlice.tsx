import { Dispatch, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AdminService } from '../../services/AdminService'
import { AdminCompanyInterface, AdminJobInterface, JobInterface, NewInterface } from '../../types/job.type'

interface AdminState {
  listRec: any[]
  listRecStatus: string
  listJobs: any[]
  listJobsStatus: string
  jobDetail: JobInterface | null
  jobDetailStatus: string
  companyDetail: AdminCompanyInterface | null
  companyDetailStatus: string
  newDetail: NewInterface | null
  newDetailStatus: string
  totalCandidate: number
  totalRecruiter: number
  totalJob: number
  totalBlog: number
}

const initialState: AdminState = {
  listRec: [],
  listRecStatus: 'idle',
  listJobs: [],
  listJobsStatus: 'idle',
  jobDetail: null,
  jobDetailStatus: 'idle',
  companyDetail: null,
  companyDetailStatus: 'idle',
  newDetail: null,
  newDetailStatus: 'idle',
  totalCandidate: 0,
  totalRecruiter: 0,
  totalJob: 0,
  totalBlog: 0
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
    },
    setNewDetail(state, action) {
      state.newDetail = action.payload
    },
    setTotalCandidate(state, action) {
      state.totalCandidate = action.payload
    },
    setTotalRecruiter(state, action) {
      state.totalRecruiter = action.payload
    },
    setTotalJob(state, action) {
      state.totalJob = action.payload
    },
    setTotalBlog(state, action) {
      state.totalBlog = action.payload
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
export const {
  setListRec,
  setListJobs,
  setJobDetail,
  setCompanyDetail,
  setNewDetail,
  setTotalCandidate,
  setTotalRecruiter,
  setTotalJob,
  setTotalBlog
} = AdminSlice.actions
