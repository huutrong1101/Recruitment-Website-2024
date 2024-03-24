import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  drawerVisible: false,
  items: [
    {
      name: 'Trang chủ',
      url: '/'
    },
    {
      name: 'Giới thiệu',
      url: '/about-us'
    },
    {
      name: 'Tuyển dụng',
      url: '/jobs'
    },
    {
      name: 'Tin tức',
      url: '/events'
    }
  ],
  menu: {
    visible: false
  }
}

const NavbarSlice = createSlice({
  name: 'Navbar',
  initialState,
  reducers: {
    setNavbarDrawerVisible: (state, action) => {
      state.drawerVisible = action.payload
    },
    setNavbarMenu: (state, action) => {
      state.menu = action.payload
    }
  }
})

export const { setNavbarDrawerVisible, setNavbarMenu } = NavbarSlice.actions

export default NavbarSlice.reducer
