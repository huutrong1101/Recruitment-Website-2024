import { Dispatch } from '@reduxjs/toolkit'
import axiosInstance from '../utils/AxiosInstance'
import { setNewDetail, setNews, setTotalNews } from '../redux/reducer/NewSlice'

const getListNews = async (dispatch: Dispatch, { name = '', type = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()

  if (name) params.append('name', name)
  if (type) params.append('type', type)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  const queryParams = params.toString()

  const response = await axiosInstance.get(`blogs?${queryParams}`)

  const data = response.data.metadata

  dispatch(setNews(data.listBlog))
  dispatch(setTotalNews(data.totalElement))
}

const getListNewsWithType = async ({ name = '', type = '', page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams()

  if (name) params.append('name', name)
  if (type) params.append('type', type)

  params.append('page', page.toString())
  params.append('limit', limit.toString())

  const queryParams = params.toString()

  return await axiosInstance.get(`blogs?${queryParams}`)
}

const getNewFromId = async (dispatch: Dispatch, newId: string) => {
  if (!newId) {
    throw new Error(`The value jobId cannot be undefined`)
  }
  const response = await axiosInstance.get(`/blogs/${newId}`)
  const data = response.data.metadata
  dispatch(setNewDetail(data))
}

const getListRelatedNews = async (newId: string) => {
  if (!newId) {
    throw new Error(`The value jobId cannot be undefined`)
  }
  return await axiosInstance.get(`/blogs/${newId}/related_blogs`)
}

export const NewService = {
  getListNews,
  getNewFromId,
  getListNewsWithType,
  getListRelatedNews
}
