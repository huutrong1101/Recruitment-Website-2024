import { Dispatch } from '@reduxjs/toolkit'
import axiosInstance from '../utils/AxiosInstance'
import { setEvents, setEventsStatus, setTotalEvents } from '../redux/reducer/HomeSlice'
import { STATUS } from '../utils/contanst'

async function getEvents(dispatch: Dispatch) {
  dispatch(setEventsStatus(STATUS.LOADING))
  try {
    const response = await axiosInstance.get('events')
    const data = response.data.result.content
    const totalEvents = response.data.result.totalElements
    dispatch(setEvents(data))
    dispatch(setTotalEvents(totalEvents))
    dispatch(setEventsStatus(STATUS.IDLE))
  } catch (error) {
    dispatch(setEventsStatus(STATUS.ERROR))
  }
}

export const EventService = {
  getEvents
}
