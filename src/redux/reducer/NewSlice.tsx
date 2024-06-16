import { createSlice } from '@reduxjs/toolkit'
import { STATUS } from '../../utils/contanst'
import { set } from 'lodash'
import { NewInterface } from '../../types/job.type'

interface NewState {
  listNews: NewInterface[]
  totalNews: number
  newDetail: NewInterface | null
}

const initialState: NewState = {
  listNews: [],
  newDetail: null,
  totalNews: 0
}

const NewSlice = createSlice({
  name: 'BlogSlice',
  initialState,
  reducers: {
    setNews(state, action) {
      state.listNews = action.payload
    },
    setTotalNews(state, action) {
      state.totalNews = action.payload
    },
    setNewDetail(state, action) {
      state.newDetail = action.payload
    }
  }
})

export const { setNews, setTotalNews, setNewDetail } = NewSlice.actions

export default NewSlice.reducer
