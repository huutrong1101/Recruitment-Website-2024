import { Dispatch, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/AxiosInstance'
import { STATUS } from '../../utils/contanst'

const CandidateListSlice = createSlice({
  name: 'candidateList',
  initialState: {
    candidatesList: [],
    candidatesListStatus: STATUS.IDLE,
    candidateTotal: 0,
    skill: []
  },
  reducers: {
    setCandidatesList(state, action) {
      state.candidatesList = action.payload
    },
    setCandidatesListStatus(state, action) {
      state.candidatesListStatus = action.payload
    },
    setCandidateTotal(state, action) {
      state.candidateTotal = action.payload
    },
    setCandidateskillList(state, action) {
      state.skill = action.payload
    }
  }
})

export default CandidateListSlice.reducer
export const { setCandidatesList, setCandidatesListStatus, setCandidateTotal, setCandidateskillList } =
  CandidateListSlice.actions

export const fetchCandidateList = () => {
  return async function fetchCandidateListThunk(dispatch: Dispatch) {
    dispatch(setCandidatesListStatus(STATUS.LOADING))
    try {
      const reponse = await axiosInstance.get(`recruiter/applied-candidates`)
      const data = await reponse.data
      dispatch(setCandidatesList(data.result.content))
      dispatch(setCandidateTotal(data.result.totalElements))
      dispatch(setCandidatesListStatus(STATUS.IDLE))
    } catch (error) {
      dispatch(setCandidatesListStatus(STATUS.ERROR))
    }
  }
}

export const fetchCandidateSkill = () => {
  return async function fetchCandidatesSkillThunk(dispatch: Dispatch) {
    dispatch(setCandidatesListStatus(STATUS.LOADING))
    try {
      const response = await axiosInstance.get(`candidate/skills`)
      const data = await response.data
      dispatch(setCandidateskillList(data.result))
      dispatch(setCandidatesListStatus(STATUS.IDLE))
    } catch (error) {
      dispatch(setCandidatesListStatus(STATUS.ERROR))
    }
  }
}
