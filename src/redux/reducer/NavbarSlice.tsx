import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  drawerVisible: false,
  items: [
    {
      name: 'Việc làm',
      url: '/jobs'
    },
    {
      name: 'Công ty',
      url: '/recruiters'
    },
    {
      name: 'Cẩm nang nghề nghiệp',
      url: '/news'
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
