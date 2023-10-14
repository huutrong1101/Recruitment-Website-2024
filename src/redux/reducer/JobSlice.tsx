import { createSlice } from '@reduxjs/toolkit'
import { STATUS } from '../../utils/contanst'

const initialState = {
  jobs: [],
  postion: [],
  type: [],
  location: [],
  totalJobs: 0,
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
    setJobsStatus(state, action) {
      state.jobsStatus = action.payload
    },
    setPosition(state, action) {
      state.postion = action.payload
    },
    setType(state, action) {
      state.type = action.payload
    },
    setLocation(state, action) {
      state.location = action.payload
    }
  }
})

export const { setJobs, setJobsStatus, setTotalJobs, setPosition, setType, setLocation } = JobSlice.actions

export default JobSlice.reducer
