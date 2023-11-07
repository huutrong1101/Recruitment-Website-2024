import { Dispatch, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/AxiosInstance'
import { STATUS } from '../../utils/contanst'

const QuestionListSLice = createSlice({
  name: 'questionList',
  initialState: {
    questionList: [],
    questionListStatus: STATUS.IDLE,
    totalQuestions: 0,
    types: [],
    skills: []
  },
  reducers: {
    setQuestionList(state, action) {
      state.questionList = action.payload
    },
    setQuestionStatus(state, action) {
      state.questionListStatus = action.payload
    },
    setTotalQuestion(state, action) {
      state.totalQuestions = action.payload
    },
    setType(state, action) {
      state.types = action.payload
    },
    setSkill(state, action) {
      state.skills = action.payload
    }
  }
})

export default QuestionListSLice.reducer
export const { setQuestionList, setQuestionStatus, setTotalQuestion, setSkill, setType } = QuestionListSLice.actions

export const fetchQuestionList = () => {
  return async function fetchQuestionThunk(dispatch: Dispatch) {
    dispatch(setQuestionStatus(STATUS.LOADING))
    try {
      const reponse = await axiosInstance.get(`interviewer/question`)
      const data = await reponse.data
      // console.log(data)
      dispatch(setQuestionList(data.result.content))
      // dispatch(setQuestionStatus(STATUS.IDLE));
    } catch (error) {
      dispatch(setQuestionStatus(STATUS.ERROR))
    }
  }
}
