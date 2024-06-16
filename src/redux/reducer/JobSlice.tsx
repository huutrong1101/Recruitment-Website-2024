import { createSlice } from '@reduxjs/toolkit'
import { STATUS } from '../../utils/contanst'
import { set } from 'lodash'

const initialState = {
  jobs: [],
  highlightedJobs: [],
  jobDetail: null,
  jobFavorite: [],
  postion: [],
  location: [],
  workStatus: [],

  majors: [],
  activities: [],
  type: [],
  province: [],
  experience: [],
  levelRequirement: [],
  genderRequirement: [],
  english: [],

  totalJobs: 0,
  totalHighlightedJobs: 0,
  jobsStatus: STATUS.IDLE
}

const JobSlice = createSlice({
  name: 'Home',
  initialState,
  reducers: {
    setJobs(state, action) {
      state.jobs = action.payload
    },
    setTotalJobs(state, action) {
      state.totalJobs = action.payload
    },
    setHighlightedJobs(state, action) {
      state.highlightedJobs = action.payload
    },
    setTotalHighlightedJobs(state, action) {
      state.totalHighlightedJobs = action.payload
    },
    setJobsStatus(state, action) {
      state.jobsStatus = action.payload
    },
    setPosition(state, action) {
      state.postion = action.payload
    },
    setMojors(state, action) {
      state.majors = action.payload
    },
    setType(state, action) {
      state.type = action.payload
    },
    setLocation(state, action) {
      state.location = action.payload
    },
    setActivity(state, action) {
      state.activities = action.payload
    },
    setProvince(state, action) {
      state.province = action.payload
    },
    setExperience(state, action) {
      state.experience = action.payload
    },
    setLevelRequirement(state, action) {
      state.levelRequirement = action.payload
    },
    setGenderRequirement(state, action) {
      state.genderRequirement = action.payload
    },
    setJobDetail(state, action) {
      state.jobDetail = action.payload
    },
    setWorkStatus(state, action) {
      state.workStatus = action.payload
    },
    setJobFavorite(state, action) {
      state.jobFavorite = action.payload
    },
    setEnglish(state, action) {
      state.english = action.payload
    }
  }
})

export const {
  setJobs,
  setJobsStatus,
  setTotalJobs,
  setPosition,
  setType,
  setLocation,
  setActivity,
  setProvince,
  setExperience,
  setLevelRequirement,
  setGenderRequirement,
  setJobDetail,
  setWorkStatus,
  setJobFavorite,
  setHighlightedJobs,
  setTotalHighlightedJobs,
  setMojors,
  setEnglish
} = JobSlice.actions

export default JobSlice.reducer
