import { Dispatch, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RecService } from '../../services/RecService'
import { RecruiterResponseState } from '../../types/user.type'
import { JobInterface } from '../../types/job.type'

interface RecState {
  listRec: RecruiterResponseState[]
  totalRec: number
  listRecStatus: string
  companyDetail: RecruiterResponseState | null
  companyDetailStatus: string
  listWatingJobs: any[]
  listWatingJobsStatus: string
  listJobOfRec: JobInterface[]
  resumeDetail: any
  listResumeStatus: string[]
  jobDetail: JobInterface | null
  isRecFavorite: boolean
  listExperienceJobApplication: any[]
  isUpgrade: boolean
}

const initialState: RecState = {
  listRec: [],
  totalRec: 0,
  listRecStatus: 'idle',
  companyDetail: null,
  companyDetailStatus: 'idle',
  listWatingJobs: [],
  listWatingJobsStatus: 'idle',
  listJobOfRec: [],
  resumeDetail: null,
  listResumeStatus: [],
  jobDetail: null,
  isRecFavorite: false,
  listExperienceJobApplication: [],
  isUpgrade: false
}

const RecSlice = createSlice({
  name: 'Recruitement',
  initialState,
  reducers: {
    setListRecs(state, action) {
      state.listRec = action.payload
    },
    setTotalRecs(state, action) {
      state.totalRec = action.payload
    },
    setRecDetail(state, action) {
      state.companyDetail = action.payload
    },
    setListWatingJobs(state, action) {
      state.listWatingJobs = action.payload
    },
    setListJobOfRec(state, action) {
      state.listJobOfRec = action.payload
    },
    setResumeDetail(state, action) {
      state.resumeDetail = action.payload
    },
    setListResumeStatus(state, action) {
      state.listResumeStatus = action.payload
    },
    setRecJobDetail(state, action) {
      state.jobDetail = action.payload
    },
    setIsRecFavorite(state, action) {
      state.isRecFavorite = action.payload
    },
    setListExperienceJobApplication(state, action) {
      state.listExperienceJobApplication = action.payload
    },
    setIsUpgrade(state, action) {
      state.isUpgrade = action.payload
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

export const checkFavoriteRec = createAsyncThunk('JobDetail/checkFavoriteJob', async ({ slug }: any, thunkAPI) => {
  try {
    const isUserFavoritedToTheRec = await RecService.getIfUserFavoriteTheRec(slug)
    thunkAPI.dispatch(setIsRecFavorite(isUserFavoritedToTheRec.data.metadata.exist))
  } catch (e) {
    thunkAPI.rejectWithValue(`Failed to fetch a job`)
  }
})

export const checkRecUpgrade = createAsyncThunk('RecUpgrade/checkRecUpgrade', async (_, thunkAPI) => {
  const checkRecUpgrade = await RecService.checkRecUpgrade()
  thunkAPI.dispatch(setIsUpgrade(checkRecUpgrade.data.metadata.premiumAccount))
})

export default RecSlice.reducer
export const {
  setListWatingJobs,
  setListRecs,
  setRecDetail,
  setListJobOfRec,
  setResumeDetail,
  setListResumeStatus,
  setRecJobDetail,
  setTotalRecs,
  setIsRecFavorite,
  setListExperienceJobApplication,
  setIsUpgrade
} = RecSlice.actions
