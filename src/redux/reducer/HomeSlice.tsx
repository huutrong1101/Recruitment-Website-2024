import { createSlice } from '@reduxjs/toolkit'
import { STATUS } from '../../utils/contanst'

const initialState = {
  events: [],
  eventsStatus: STATUS.IDLE,
  totalEvents: 0,
  jobs: [],
  totalJobs: 0,
  jobsStatus: STATUS.IDLE
}

const HomeSlice = createSlice({
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
    setEvents(state, action) {
      state.events = action.payload
    },
    setEventsStatus(state, action) {
      state.eventsStatus = action.payload
    },
    setTotalEvents(state, action) {
      state.totalEvents = action.payload
    }
  }
})

export const { setJobs, setJobsStatus, setTotalJobs, setEventsStatus, setEvents, setTotalEvents } = HomeSlice.actions

export default HomeSlice.reducer
