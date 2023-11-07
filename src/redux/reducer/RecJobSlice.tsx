import { Dispatch, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/AxiosInstance'
import { STATUS } from '../../utils/contanst'

const RecJobListSlice = createSlice({
  name: 'RecJobList',
  initialState: {
    recjobsList: [],
    recjobsListStatus: STATUS.IDLE,
    recjobTotal: 0,
    recjobType: []
  },
  reducers: {
    setRecjobsList(state, action) {
      state.recjobsList = action.payload
    },
    setRecjobsListStatus(state, action) {
      state.recjobsListStatus = action.payload
    },
    setTotalJobs(state, action) {
      state.recjobTotal = action.payload
    },
    setRecjobType(state, action) {
      state.recjobType = action.payload
    }
  }
})

export default RecJobListSlice.reducer
export const { setRecjobsList, setRecjobsListStatus, setTotalJobs, setRecjobType } = RecJobListSlice.actions

export const fetchRecJobList = (query: string) => {
  return async function fetchRecJobListThunk(dispatch: Dispatch) {
    dispatch(setRecjobsListStatus(STATUS.LOADING))
    try {
      const response = await axiosInstance.get(`/jobs?${query}`)
      const data = await response.data
      dispatch(setRecjobsList(data.result.content))
      dispatch(setRecjobsListStatus(STATUS.IDLE))
    } catch (error) {
      dispatch(setRecjobsListStatus(STATUS.ERROR))
    }
  }
}
