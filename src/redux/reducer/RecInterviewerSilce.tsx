import { Dispatch, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/AxiosInstance'
import { STATUS } from '../../utils/contanst'
import axios from 'axios'

const RecInterviewerSlice = createSlice({
  name: 'RecInterviewerList',
  initialState: {
    recInterviewerList: [],
    recInterviewerListStatus: STATUS.IDLE,
    recInterviewerTotal: 0,
    skill: []
  },
  reducers: {
    setRecInterviewerList(state, action) {
      state.recInterviewerList = action.payload
    },
    setRecInterviewerListStatus(state, action) {
      state.recInterviewerListStatus = action.payload
    },
    setrecInterviewerTotal(state, action) {
      state.recInterviewerTotal = action.payload
    },
    setInterviewerskillList(state, action) {
      state.skill = action.payload
    }
  }
})

export default RecInterviewerSlice.reducer
export const { setRecInterviewerList, setRecInterviewerListStatus, setrecInterviewerTotal, setInterviewerskillList } =
  RecInterviewerSlice.actions

export const fetchRecInterviewerList = () => {
  return async function fetchRecInterviewerListThunk(dispatch: Dispatch) {
    dispatch(setRecInterviewerListStatus(STATUS.LOADING))
    try {
      const response = await axiosInstance.get(`recruiter/interviewers`)
      const data = await response.data
      dispatch(setRecInterviewerList(data.result))
      dispatch(setRecInterviewerListStatus(STATUS.IDLE))
    } catch (error) {
      dispatch(setRecInterviewerListStatus(STATUS.ERROR))
    }
  }
}

export const fetchRecInterviewerSkill = () => {
  return async function fetchRecInterviewerSkillThunk(dispatch: Dispatch) {
    dispatch(setRecInterviewerListStatus(STATUS.LOADING))
    try {
      const response = await axiosInstance.get(`/skills`)
      const data = await response.data
      dispatch(setInterviewerskillList(data.result))
      dispatch(setRecInterviewerListStatus(STATUS.IDLE))
    } catch (error) {
      dispatch(setRecInterviewerListStatus(STATUS.ERROR))
    }
  }
}
