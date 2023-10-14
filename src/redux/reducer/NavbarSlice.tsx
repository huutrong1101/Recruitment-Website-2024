import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  drawerVisible: false,
  items: [
    {
      name: 'Home',
      url: '/'
    },
    {
      name: 'Jobs',
      url: '/jobs'
    },
    {
      name: 'Events',
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
