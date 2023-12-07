import { Dispatch, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../utils/AxiosInstance'
import { STATUS } from '../../utils/contanst'

const AdminListAcountRecentSlice = createSlice({
  name: 'adminacountList',
  initialState: {
    adminmanagerAcountList: [],
    adminmanagerAcountListStatus: STATUS.IDLE,
    totalListAcounts: 0
  },
  reducers: {
    setAdminManagerAcountList(state, action) {
      state.adminmanagerAcountList = action.payload
    },
    setAdminManagerAcountListStatus(state, action) {
      state.adminmanagerAcountListStatus = action.payload
    },
    setTotalListAcounts(state, action) {
      state.totalListAcounts = action.payload
    }
  }
})
export default AdminListAcountRecentSlice.reducer

export const { setAdminManagerAcountList, setAdminManagerAcountListStatus, setTotalListAcounts } =
  AdminListAcountRecentSlice.actions

export const fetchAdminManagerAcountList = () => {
  return async function fetchAdminManagerAcountListThunk(dispatch: Dispatch) {
    dispatch(setAdminManagerAcountListStatus(STATUS.LOADING))
    try {
      const reponse = await axiosInstance.get('admin/users?size=8&page=1')
      const data = await reponse.data
      const totalListAcounts = reponse.data.result.totalElements

      dispatch(setTotalListAcounts(totalListAcounts))
      dispatch(setAdminManagerAcountList(data.result.content))
      dispatch(setAdminManagerAcountListStatus(STATUS.IDLE))
    } catch (error) {
      dispatch(setAdminManagerAcountListStatus(STATUS.ERROR))
    }
  }
}
